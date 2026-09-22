import { siteConfig } from "@/config/site";

export const frequentlyAskedQuestions = [
  {
    question: "Can beginners join Prabha Yogashala?",
    answer:
      "Yes. Beginner, intermediate, and advanced practitioners are part of the confirmed audience. Share your current experience when enquiring so the available options can be discussed clearly.",
  },
  {
    question: "What ages can join?",
    answer: "Prabha Yogashala welcomes practitioners aged 10 and above.",
  },
  {
    question: "Are online and offline sessions available?",
    answer:
      "Yes. Both online and offline delivery are offered. Availability for an individual practice should be confirmed during your enquiry.",
  },
  {
    question: "Can I book a trial class without an account?",
    answer:
      "Yes. You can enquire about a trial class without creating an account. The current website prepares your details and directs you to WhatsApp until backend submission is connected.",
  },
  {
    question: "When are sessions generally available?",
    answer: `The confirmed broad windows are ${siteConfig.availability.morning} and ${siteConfig.availability.evening}. Exact class times and days are still being finalized.`,
  },
  {
    question: "How do I contact the instructor?",
    answer:
      "Use the verified WhatsApp link on this website. The instructor’s public name and biography will be added only after client approval.",
  },
  {
    question: "What should I prepare before a session?",
    answer:
      "Preparation can depend on the practice and format. Ask for session-specific guidance when your enquiry is confirmed rather than relying on a generic rule.",
  },
  {
    question: "What are the cancellation, refund, and payment policies?",
    answer:
      "These policies have not yet been approved for publication. Please contact Prabha Yogashala for the current information before making arrangements.",
  },
] as const;
