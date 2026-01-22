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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      food_entries: {
        Row: {
          category: string | null
          created_at: string
          date: string
          id: string
          is_locked: boolean | null
          item: string
          packaging: string | null
          quantity: number
          recorded_by: string | null
          recorded_by_user_id: string | null
          unit: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          date?: string
          id?: string
          is_locked?: boolean | null
          item: string
          packaging?: string | null
          quantity: number
          recorded_by?: string | null
          recorded_by_user_id?: string | null
          unit?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          date?: string
          id?: string
          is_locked?: boolean | null
          item?: string
          packaging?: string | null
          quantity?: number
          recorded_by?: string | null
          recorded_by_user_id?: string | null
          unit?: string | null
        }
        Relationships: []
      }
      fuel_entries: {
        Row: {
          created_at: string
          date: string
          fuel_type: string
          hours_end: string | null
          hours_start: string | null
          id: string
          is_locked: boolean | null
          km_end: string | null
          km_start: string | null
          liters: number
          meter_end: string | null
          meter_start: string | null
          operator: string | null
          operator_user_id: string | null
          photo_url: string | null
          target_machine: string | null
        }
        Insert: {
          created_at?: string
          date?: string
          fuel_type: string
          hours_end?: string | null
          hours_start?: string | null
          id?: string
          is_locked?: boolean | null
          km_end?: string | null
          km_start?: string | null
          liters: number
          meter_end?: string | null
          meter_start?: string | null
          operator?: string | null
          operator_user_id?: string | null
          photo_url?: string | null
          target_machine?: string | null
        }
        Update: {
          created_at?: string
          date?: string
          fuel_type?: string
          hours_end?: string | null
          hours_start?: string | null
          id?: string
          is_locked?: boolean | null
          km_end?: string | null
          km_start?: string | null
          liters?: number
          meter_end?: string | null
          meter_start?: string | null
          operator?: string | null
          operator_user_id?: string | null
          photo_url?: string | null
          target_machine?: string | null
        }
        Relationships: []
      }
      inspection_reports: {
        Row: {
          created_at: string
          id: string
          inspection_date: string
          inspector_id: string | null
          inspector_name: string | null
          is_validated: boolean | null
          reference_code: string
          sections: Json
          updated_at: string
          validated_at: string | null
          validated_by: string | null
          vehicle_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          inspection_date?: string
          inspector_id?: string | null
          inspector_name?: string | null
          is_validated?: boolean | null
          reference_code: string
          sections?: Json
          updated_at?: string
          validated_at?: string | null
          validated_by?: string | null
          vehicle_id: string
        }
        Update: {
          created_at?: string
          id?: string
          inspection_date?: string
          inspector_id?: string | null
          inspector_name?: string | null
          is_validated?: boolean | null
          reference_code?: string
          sections?: Json
          updated_at?: string
          validated_at?: string | null
          validated_by?: string | null
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "inspection_reports_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      parts_entries: {
        Row: {
          condition: string | null
          created_at: string
          date: string
          id: string
          is_locked: boolean | null
          machine_id: string | null
          mechanic: string | null
          mechanic_user_id: string | null
          part_name: string
          part_number: string | null
          photo_url: string | null
          reason: string | null
          work_order: string | null
        }
        Insert: {
          condition?: string | null
          created_at?: string
          date?: string
          id?: string
          is_locked?: boolean | null
          machine_id?: string | null
          mechanic?: string | null
          mechanic_user_id?: string | null
          part_name: string
          part_number?: string | null
          photo_url?: string | null
          reason?: string | null
          work_order?: string | null
        }
        Update: {
          condition?: string | null
          created_at?: string
          date?: string
          id?: string
          is_locked?: boolean | null
          machine_id?: string | null
          mechanic?: string | null
          mechanic_user_id?: string | null
          part_name?: string
          part_number?: string | null
          photo_url?: string | null
          reason?: string | null
          work_order?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vehicles: {
        Row: {
          color: string | null
          created_at: string
          created_by: string | null
          id: string
          license_plate: string | null
          make: string
          mileage: string | null
          model: string
          status: string
          updated_at: string
          vin: string | null
          year: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          license_plate?: string | null
          make: string
          mileage?: string | null
          model: string
          status?: string
          updated_at?: string
          vin?: string | null
          year?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          license_plate?: string | null
          make?: string
          mileage?: string | null
          model?: string
          status?: string
          updated_at?: string
          vin?: string | null
          year?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_staff: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "inspector" | "operator" | "viewer"
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
    Enums: {
      app_role: ["admin", "inspector", "operator", "viewer"],
    },
  },
} as const
