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
      admin_allowlist: {
        Row: {
          created_at: string
          email: string
        }
        Insert: {
          created_at?: string
          email: string
        }
        Update: {
          created_at?: string
          email?: string
        }
        Relationships: []
      }
      content_overrides: {
        Row: {
          block_type: string
          created_at: string
          created_by: string | null
          id: string
          is_published: boolean
          module_id: string
          payload: Json
          position: string
          program_id: string
          section_id: string | null
          sort_order: number
          updated_at: string
        }
        Insert: {
          block_type: string
          created_at?: string
          created_by?: string | null
          id?: string
          is_published?: boolean
          module_id: string
          payload?: Json
          position: string
          program_id: string
          section_id?: string | null
          sort_order?: number
          updated_at?: string
        }
        Update: {
          block_type?: string
          created_at?: string
          created_by?: string | null
          id?: string
          is_published?: boolean
          module_id?: string
          payload?: Json
          position?: string
          program_id?: string
          section_id?: string | null
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      module_progress: {
        Row: {
          certificate_hash: string | null
          certificate_id: string | null
          completed_at: string | null
          completed_interactives: string[]
          completed_sections: string[]
          created_at: string
          last_viewed_section: string
          module_id: number
          points: number
          started_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          certificate_hash?: string | null
          certificate_id?: string | null
          completed_at?: string | null
          completed_interactives?: string[]
          completed_sections?: string[]
          created_at?: string
          last_viewed_section?: string
          module_id: number
          points?: number
          started_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          certificate_hash?: string | null
          certificate_id?: string | null
          completed_at?: string | null
          completed_interactives?: string[]
          completed_sections?: string[]
          created_at?: string
          last_viewed_section?: string
          module_id?: number
          points?: number
          started_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "module_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      program_entitlements: {
        Row: {
          access_ends_at: string | null
          access_starts_at: string | null
          amount_total: number | null
          created_at: string
          currency: string | null
          id: string
          note: string | null
          program_key: string
          source: string
          status: string
          stripe_checkout_session_id: string | null
          stripe_customer_id: string | null
          stripe_payment_intent_id: string | null
          stripe_price_id: string | null
          stripe_subscription_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          access_ends_at?: string | null
          access_starts_at?: string | null
          amount_total?: number | null
          created_at?: string
          currency?: string | null
          id?: string
          note?: string | null
          program_key: string
          source?: string
          status?: string
          stripe_checkout_session_id?: string | null
          stripe_customer_id?: string | null
          stripe_payment_intent_id?: string | null
          stripe_price_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          access_ends_at?: string | null
          access_starts_at?: string | null
          amount_total?: number | null
          created_at?: string
          currency?: string | null
          id?: string
          note?: string | null
          program_key?: string
          source?: string
          status?: string
          stripe_checkout_session_id?: string | null
          stripe_customer_id?: string | null
          stripe_payment_intent_id?: string | null
          stripe_price_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      program_profiles: {
        Row: {
          bio: string | null
          country: string | null
          created_at: string
          display_name: string | null
          experience_level: string | null
          goal: string | null
          mission_badge: string | null
          organization: string | null
          program: string | null
          track: string | null
          updated_at: string
          user_id: string
          username: string | null
        }
        Insert: {
          bio?: string | null
          country?: string | null
          created_at?: string
          display_name?: string | null
          experience_level?: string | null
          goal?: string | null
          mission_badge?: string | null
          organization?: string | null
          program?: string | null
          track?: string | null
          updated_at?: string
          user_id: string
          username?: string | null
        }
        Update: {
          bio?: string | null
          country?: string | null
          created_at?: string
          display_name?: string | null
          experience_level?: string | null
          goal?: string | null
          mission_badge?: string | null
          organization?: string | null
          program?: string | null
          track?: string | null
          updated_at?: string
          user_id?: string
          username?: string | null
        }
        Relationships: []
      }
      session_history: {
        Row: {
          created_at: string
          ended_at: string
          id: number
          module_id: number
          sections_viewed: string[]
          started_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          ended_at: string
          id?: number
          module_id: number
          sections_viewed?: string[]
          started_at: string
          user_id: string
        }
        Update: {
          created_at?: string
          ended_at?: string
          id?: number
          module_id?: number
          sections_viewed?: string[]
          started_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          created_at: string
          email: string
          final_certification_hash: string | null
          final_certification_id: string | null
          id: string
          metadata: Json
          name: string
          picture: string | null
          total_points: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          final_certification_hash?: string | null
          final_certification_id?: string | null
          id: string
          metadata?: Json
          name: string
          picture?: string | null
          total_points?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          final_certification_hash?: string | null
          final_certification_id?: string | null
          id?: string
          metadata?: Json
          name?: string
          picture?: string | null
          total_points?: number
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      grant_program_access: {
        Args: {
          _access_ends_at?: string
          _note?: string
          _program_key: string
          _source?: string
          _user_id: string
        }
        Returns: {
          access_ends_at: string | null
          access_starts_at: string | null
          amount_total: number | null
          created_at: string
          currency: string | null
          id: string
          note: string | null
          program_key: string
          source: string
          status: string
          stripe_checkout_session_id: string | null
          stripe_customer_id: string | null
          stripe_payment_intent_id: string | null
          stripe_price_id: string | null
          stripe_subscription_id: string | null
          updated_at: string
          user_id: string
        }
        SetofOptions: {
          from: "*"
          to: "program_entitlements"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      has_program_access: {
        Args: { _program_key: string; _user_id: string }
        Returns: boolean
      }
      is_content_admin: { Args: never; Returns: boolean }
      is_zen_admin: { Args: never; Returns: boolean }
      revoke_program_access: {
        Args: { _note?: string; _program_key: string; _user_id: string }
        Returns: {
          access_ends_at: string | null
          access_starts_at: string | null
          amount_total: number | null
          created_at: string
          currency: string | null
          id: string
          note: string | null
          program_key: string
          source: string
          status: string
          stripe_checkout_session_id: string | null
          stripe_customer_id: string | null
          stripe_payment_intent_id: string | null
          stripe_price_id: string | null
          stripe_subscription_id: string | null
          updated_at: string
          user_id: string
        }
        SetofOptions: {
          from: "*"
          to: "program_entitlements"
          isOneToOne: true
          isSetofReturn: false
        }
      }
    }
    Enums: {
      [_ in never]: never
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
