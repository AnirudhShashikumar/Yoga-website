export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      bookings: {
        Row: {
          created_at: string
          customer_id: string
          id: string
          session_id: string
          status: Database["public"]["Enums"]["booking_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_id: string
          id?: string
          session_id: string
          status?: Database["public"]["Enums"]["booking_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_id?: string
          id?: string
          session_id?: string
          status?: Database["public"]["Enums"]["booking_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "class_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      class_sessions: {
        Row: {
          archived_at: string | null
          capacity: number | null
          class_id: string
          created_at: string
          ends_at: string
          format: Database["public"]["Enums"]["delivery_format"]
          id: string
          starts_at: string
          status: Database["public"]["Enums"]["session_status"]
          updated_at: string
        }
        Insert: {
          archived_at?: string | null
          capacity?: number | null
          class_id: string
          created_at?: string
          ends_at: string
          format: Database["public"]["Enums"]["delivery_format"]
          id?: string
          starts_at: string
          status?: Database["public"]["Enums"]["session_status"]
          updated_at?: string
        }
        Update: {
          archived_at?: string | null
          capacity?: number | null
          class_id?: string
          created_at?: string
          ends_at?: string
          format?: Database["public"]["Enums"]["delivery_format"]
          id?: string
          starts_at?: string
          status?: Database["public"]["Enums"]["session_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "class_sessions_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
        ]
      }
      classes: {
        Row: {
          archived_at: string | null
          available_formats: Database["public"]["Enums"]["delivery_format"][]
          category: Database["public"]["Enums"]["practice_category"]
          created_at: string
          description: string
          featured: boolean
          id: string
          levels: Database["public"]["Enums"]["experience_level"][]
          media_path: string | null
          name: string
          published: boolean
          short_description: string
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          archived_at?: string | null
          available_formats?: Database["public"]["Enums"]["delivery_format"][]
          category: Database["public"]["Enums"]["practice_category"]
          created_at?: string
          description: string
          featured?: boolean
          id?: string
          levels?: Database["public"]["Enums"]["experience_level"][]
          media_path?: string | null
          name: string
          published?: boolean
          short_description: string
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          archived_at?: string | null
          available_formats?: Database["public"]["Enums"]["delivery_format"][]
          category?: Database["public"]["Enums"]["practice_category"]
          created_at?: string
          description?: string
          featured?: boolean
          id?: string
          levels?: Database["public"]["Enums"]["experience_level"][]
          media_path?: string | null
          name?: string
          published?: boolean
          short_description?: string
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      gallery_items: {
        Row: {
          alt_text: string
          archived_at: string | null
          caption: string | null
          created_at: string
          id: string
          media_type: Database["public"]["Enums"]["gallery_media_type"]
          published: boolean
          sort_order: number
          storage_path: string
          updated_at: string
        }
        Insert: {
          alt_text?: string
          archived_at?: string | null
          caption?: string | null
          created_at?: string
          id?: string
          media_type: Database["public"]["Enums"]["gallery_media_type"]
          published?: boolean
          sort_order?: number
          storage_path: string
          updated_at?: string
        }
        Update: {
          alt_text?: string
          archived_at?: string | null
          caption?: string | null
          created_at?: string
          id?: string
          media_type?: Database["public"]["Enums"]["gallery_media_type"]
          published?: boolean
          sort_order?: number
          storage_path?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          age: number | null
          created_at: string
          experience_level:
            | Database["public"]["Enums"]["experience_level"]
            | null
          full_name: string | null
          id: string
          phone: string | null
          preferred_format:
            | Database["public"]["Enums"]["delivery_format"]
            | null
          updated_at: string
        }
        Insert: {
          age?: number | null
          created_at?: string
          experience_level?:
            | Database["public"]["Enums"]["experience_level"]
            | null
          full_name?: string | null
          id: string
          phone?: string | null
          preferred_format?:
            | Database["public"]["Enums"]["delivery_format"]
            | null
          updated_at?: string
        }
        Update: {
          age?: number | null
          created_at?: string
          experience_level?:
            | Database["public"]["Enums"]["experience_level"]
            | null
          full_name?: string | null
          id?: string
          phone?: string | null
          preferred_format?:
            | Database["public"]["Enums"]["delivery_format"]
            | null
          updated_at?: string
        }
        Relationships: []
      }
      trial_enquiries: {
        Row: {
          age: number
          consent_given: boolean
          consent_source: string | null
          consented_at: string | null
          created_at: string
          email: string
          experience_level: Database["public"]["Enums"]["experience_level"]
          id: string
          interested_class_id: string | null
          interested_practice: string
          message: string
          name: string
          phone: string
          preferred_format: Database["public"]["Enums"]["delivery_format"]
          preferred_time_window: Database["public"]["Enums"]["enquiry_time_window"]
          status: Database["public"]["Enums"]["enquiry_status"]
          updated_at: string
          user_id: string | null
        }
        Insert: {
          age: number
          consent_given?: boolean
          consent_source?: string | null
          consented_at?: string | null
          created_at?: string
          email: string
          experience_level: Database["public"]["Enums"]["experience_level"]
          id?: string
          interested_class_id?: string | null
          interested_practice: string
          message?: string
          name: string
          phone: string
          preferred_format: Database["public"]["Enums"]["delivery_format"]
          preferred_time_window: Database["public"]["Enums"]["enquiry_time_window"]
          status?: Database["public"]["Enums"]["enquiry_status"]
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          age?: number
          consent_given?: boolean
          consent_source?: string | null
          consented_at?: string | null
          created_at?: string
          email?: string
          experience_level?: Database["public"]["Enums"]["experience_level"]
          id?: string
          interested_class_id?: string | null
          interested_practice?: string
          message?: string
          name?: string
          phone?: string
          preferred_format?: Database["public"]["Enums"]["delivery_format"]
          preferred_time_window?: Database["public"]["Enums"]["enquiry_time_window"]
          status?: Database["public"]["Enums"]["enquiry_status"]
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trial_enquiries_interested_class_id_fkey"
            columns: ["interested_class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          assigned_at: string
          assigned_by: string | null
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          assigned_at?: string
          assigned_by?: string | null
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      workshops: {
        Row: {
          archived_at: string | null
          created_at: string
          description: string
          ends_at: string | null
          format: Database["public"]["Enums"]["delivery_format"] | null
          id: string
          media_path: string | null
          published: boolean
          slug: string
          starts_at: string | null
          summary: string
          title: string
          updated_at: string
        }
        Insert: {
          archived_at?: string | null
          created_at?: string
          description: string
          ends_at?: string | null
          format?: Database["public"]["Enums"]["delivery_format"] | null
          id?: string
          media_path?: string | null
          published?: boolean
          slug: string
          starts_at?: string | null
          summary: string
          title: string
          updated_at?: string
        }
        Update: {
          archived_at?: string | null
          created_at?: string
          description?: string
          ends_at?: string | null
          format?: Database["public"]["Enums"]["delivery_format"] | null
          id?: string
          media_path?: string | null
          published?: boolean
          slug?: string
          starts_at?: string | null
          summary?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_customer_directory: {
        Args: never
        Returns: {
          created_at: string
          email: string
          email_confirmed_at: string
          last_sign_in_at: string
          user_id: string
        }[]
      }
    }
    Enums: {
      app_role: "customer" | "admin"
      booking_status: "pending" | "confirmed" | "completed" | "cancelled"
      delivery_format: "online" | "offline"
      enquiry_status: "new" | "contacted" | "converted" | "closed"
      enquiry_time_window: "morning" | "evening"
      experience_level: "beginner" | "intermediate" | "advanced"
      gallery_media_type: "image" | "video"
      practice_category:
        | "foundational"
        | "dynamic"
        | "mind_breath"
        | "specialized"
        | "personal_groups"
      session_status: "draft" | "published" | "cancelled" | "completed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["customer", "admin"],
      booking_status: ["pending", "confirmed", "completed", "cancelled"],
      delivery_format: ["online", "offline"],
      enquiry_status: ["new", "contacted", "converted", "closed"],
      enquiry_time_window: ["morning", "evening"],
      experience_level: ["beginner", "intermediate", "advanced"],
      gallery_media_type: ["image", "video"],
      practice_category: [
        "foundational",
        "dynamic",
        "mind_breath",
        "specialized",
        "personal_groups",
      ],
      session_status: ["draft", "published", "cancelled", "completed"],
    },
  },
} as const
