#!/usr/bin/env python3
"""Generate web-ready Prabha Yogashala brand assets from the approved master.

The source artwork is preserved unchanged. This script removes only the uniform
white matte, crops excess canvas, and creates the approved symbol-only icon by
retaining the artwork components above the wordmark plus the connected hand/tree
component. It does not redraw, recolour, or reinterpret the logo.
"""

from collections import deque
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "assets-source/branding/prabha-yogashala-logo-original.png"
BRAND_DIR = ROOT / "public/brand"
APP_DIR = ROOT / "src/app"
IVORY = (251, 249, 246, 255)


def remove_white_matte(image: Image.Image) -> Image.Image:
    """Convert the source's white matte to alpha and recover edge colours."""
    rgb = image.convert("RGB")
    pixels: list[tuple[int, int, int, int]] = []

    for red, green, blue in rgb.getdata():
        alpha = (255 - min(red, green, blue)) / 255
        if alpha <= 0.012:
            pixels.append((0, 0, 0, 0))
            continue

        def unmatte(channel: int) -> int:
            return max(0, min(255, round(255 + (channel - 255) / alpha)))

        pixels.append(
            (unmatte(red), unmatte(green), unmatte(blue), round(alpha * 255))
        )

    output = Image.new("RGBA", rgb.size)
    output.putdata(pixels)
    return output


def crop_with_padding(image: Image.Image, padding: int) -> Image.Image:
    bounds = image.getbbox()
    if bounds is None:
        raise RuntimeError("The source logo contains no visible artwork.")

    left, top, right, bottom = bounds
    return image.crop(
        (
            max(0, left - padding),
            max(0, top - padding),
            min(image.width, right + padding),
            min(image.height, bottom + padding),
        )
    )


def connected_components(image: Image.Image) -> list[list[tuple[int, int]]]:
    """Return 8-connected visible pixel components without external CV tools."""
    alpha = image.getchannel("A")
    width, height = image.size
    visible = bytearray(1 if value > 3 else 0 for value in alpha.getdata())
    visited = bytearray(width * height)
    components: list[list[tuple[int, int]]] = []

    for start in range(width * height):
        if not visible[start] or visited[start]:
            continue

        visited[start] = 1
        queue = deque([start])
        component: list[tuple[int, int]] = []

        while queue:
            index = queue.popleft()
            x, y = index % width, index // width
            component.append((x, y))

            for next_y in range(max(0, y - 1), min(height, y + 2)):
                row = next_y * width
                for next_x in range(max(0, x - 1), min(width, x + 2)):
                    neighbour = row + next_x
                    if visible[neighbour] and not visited[neighbour]:
                        visited[neighbour] = 1
                        queue.append(neighbour)

        components.append(component)

    return components


def extract_mark(lockup: Image.Image) -> Image.Image:
    """Remove the two wordmarks while preserving the official symbol pixels."""
    components = connected_components(lockup)
    if not components:
        raise RuntimeError("No visible logo components were found.")

    largest = max(components, key=len)
    keep = set(largest)

    # In the tightly cropped approved master, every detached symbol element
    # begins above y=650. The PRABHA and Yogashala letter components begin below.
    for component in components:
        if min(y for _, y in component) < 650:
            keep.update(component)

    source_pixels = lockup.load()
    mark = Image.new("RGBA", lockup.size)
    mark_pixels = mark.load()
    for x, y in keep:
        mark_pixels[x, y] = source_pixels[x, y]

    return crop_with_padding(mark, 28)


def square_canvas(image: Image.Image, size: int, padding_ratio: float) -> Image.Image:
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    available = round(size * (1 - 2 * padding_ratio))
    scale = min(available / image.width, available / image.height)
    resized = image.resize(
        (round(image.width * scale), round(image.height * scale)),
        Image.Resampling.LANCZOS,
    )
    canvas.alpha_composite(
        resized,
        ((size - resized.width) // 2, (size - resized.height) // 2),
    )
    return canvas


def main() -> None:
    BRAND_DIR.mkdir(parents=True, exist_ok=True)
    source = Image.open(SOURCE)
    lockup = crop_with_padding(remove_white_matte(source), 28)
    mark = extract_mark(lockup)

    lockup.save(BRAND_DIR / "prabha-yogashala-logo.png", optimize=True)
    mark_square = square_canvas(mark, 768, 0.055)
    mark_square.save(BRAND_DIR / "prabha-yogashala-mark.png", optimize=True)

    icon = mark_square.resize((512, 512), Image.Resampling.LANCZOS)
    icon.save(APP_DIR / "icon.png", optimize=True)

    apple_icon = Image.new("RGBA", (180, 180), IVORY)
    apple_mark = square_canvas(mark, 180, 0.10)
    apple_icon.alpha_composite(apple_mark)
    apple_icon.convert("RGB").save(APP_DIR / "apple-icon.png", optimize=True)

    favicon = square_canvas(mark, 64, 0.08)
    favicon.save(
        APP_DIR / "favicon.ico",
        format="ICO",
        sizes=[(16, 16), (32, 32), (48, 48), (64, 64)],
    )

    print(f"Generated lockup: {lockup.size}")
    print(f"Generated mark: {mark_square.size}")
    print("Generated app icons: 512px, 180px, and multi-size ICO")


if __name__ == "__main__":
    main()
