export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    public: {
        Tables: {
            audit_logs: {
                Row: {
                    action: string
                    created_at: string | null
                    entity_id: string | null
                    entity_type: string
                    id: string
                    new_data: Json | null
                    office_id: string | null
                    old_data: Json | null
                    user_id: string | null
                }
                Insert: {
                    action: string
                    created_at?: string | null
                    entity_id?: string | null
                    entity_type: string
                    id?: string
                    new_data?: Json | null
                    office_id?: string | null
                    old_data?: Json | null
                    user_id?: string | null
                }
                Update: {
                    action?: string
                    created_at?: string | null
                    entity_id?: string | null
                    entity_type?: string
                    id?: string
                    new_data?: Json | null
                    office_id?: string | null
                    old_data?: Json | null
                    user_id?: string | null
                }
            }
            clients: {
                Row: {
                    id: number
                    name: string
                    email: string | null
                    phone: string | null
                    address: string | null
                    type: string | null
                    status: string | null
                    office_id: string | null
                    active_cases: number | null
                    created_at: string | null
                }
                Insert: {
                    id?: number
                    name: string
                    email?: string | null
                    phone?: string | null
                    address?: string | null
                    type?: string | null
                    status?: string | null
                    office_id?: string | null
                    active_cases?: number | null
                    created_at?: string | null
                }
                Update: {
                    id?: number
                    name?: string
                    email?: string | null
                    phone?: string | null
                    address?: string | null
                    type?: string | null
                    status?: string | null
                    office_id?: string | null
                    active_cases?: number | null
                    created_at?: string | null
                }
            }
            client_documents: {
                Row: {
                    id: string
                    client_id: number
                    file_name: string
                    file_path: string
                    file_type: string | null
                    file_size: number | null
                    uploaded_by: string | null
                    office_id: number
                    created_at: string | null
                    updated_at: string | null
                }
                Insert: {
                    id?: string
                    client_id: number
                    file_name: string
                    file_path: string
                    file_type?: string | null
                    file_size?: number | null
                    uploaded_by?: string | null
                    office_id: number
                    created_at?: string | null
                    updated_at?: string | null
                }
                Update: {
                    id?: string
                    client_id?: number
                    file_name?: string
                    file_path?: string
                    file_type?: string | null
                    file_size?: number | null
                    uploaded_by?: string | null
                    office_id?: number
                    created_at?: string | null
                    updated_at?: string | null
                }
            }
            condominiums: {
                Row: {
                    id: number
                    name: string
                    address: string | null
                    units_total: number | null
                    office_id: string | null
                    created_at: string | null
                }
                Insert: {
                    id?: number
                    name: string
                    address?: string | null
                    units_total?: number | null
                    office_id?: string | null
                    created_at?: string | null
                }
                Update: {
                    id?: number
                    name?: string
                    address?: string | null
                    units_total?: number | null
                    office_id?: string | null
                    created_at?: string | null
                }
            }
            financial_records: {
                Row: {
                    id: number
                    description: string
                    type: string
                    amount_text: string | null
                    amount_numeric: number
                    currency: string | null
                    amount_brl: number | null
                    exchange_rate: number | null
                    date: string
                    category: string | null
                    status: string
                    office_id: string | null
                    created_at: string | null
                }
                Insert: {
                    id?: number
                    description: string
                    type: string
                    amount_text?: string | null
                    amount_numeric: number
                    currency?: string | null
                    amount_brl?: number | null
                    exchange_rate?: number | null
                    date: string
                    category?: string | null
                    status: string
                    office_id?: string | null
                    created_at?: string | null
                }
                Update: {
                    id?: number
                    description?: string
                    type?: string
                    amount_text?: string | null
                    amount_numeric?: number
                    currency?: string | null
                    amount_brl?: number | null
                    exchange_rate?: number | null
                    date?: string
                    category?: string | null
                    status?: string
                    office_id?: string | null
                    created_at?: string | null
                }
            }
            office_invites: {
                Row: {
                    id: number
                    code: string
                    office_id: number
                    role: string
                    created_by: string | null
                    expires_at: string
                    used: boolean | null
                    used_by: string | null
                    used_at: string | null
                    created_at: string | null
                }
                Insert: {
                    id?: number
                    code: string
                    office_id: number
                    role?: string
                    created_by?: string | null
                    expires_at: string
                    used?: boolean | null
                    used_by?: string | null
                    used_at?: string | null
                    created_at?: string | null
                }
                Update: {
                    id?: number
                    code?: string
                    office_id?: number
                    role?: string
                    created_by?: string | null
                    expires_at?: string
                    used?: boolean | null
                    used_by?: string | null
                    used_at?: string | null
                    created_at?: string | null
                }
            }
            office_members: {
                Row: {
                    id: number
                    office_id: string
                    user_id: string
                    role: string | null
                    created_at: string | null
                }
                Insert: {
                    id?: number
                    office_id: string
                    user_id: string
                    role?: string | null
                    created_at?: string | null
                }
                Update: {
                    id?: number
                    office_id?: string
                    user_id?: string
                    role?: string | null
                    created_at?: string | null
                }
            }
            offices: {
                Row: {
                    id: string
                    name: string
                    created_at: string | null
                }
                Insert: {
                    id?: string
                    name: string
                    created_at?: string | null
                }
                Update: {
                    id?: string
                    name?: string
                    created_at?: string | null
                }
            }
            process_ai_analysis: {
                Row: {
                    id: number
                    process_id: number | null
                    analysis_data: Json
                    analyzed_at: string | null
                    model_version: string | null
                    created_at: string | null
                }
                Insert: {
                    id?: number
                    process_id?: number | null
                    analysis_data: Json
                    analyzed_at?: string | null
                    model_version?: string | null
                    created_at?: string | null
                }
                Update: {
                    id?: number
                    process_id?: number | null
                    analysis_data?: Json
                    analyzed_at?: string | null
                    model_version?: string | null
                    created_at?: string | null
                }
            }
            process_comments: {
                Row: {
                    id: number
                    process_id: number
                    user_id: string | null
                    comment: string
                    created_at: string | null
                }
                Insert: {
                    id?: number
                    process_id: number
                    user_id?: string | null
                    comment: string
                    created_at?: string | null
                }
                Update: {
                    id?: number
                    process_id?: number
                    user_id?: string | null
                    comment?: string
                    created_at?: string | null
                }
            }
            processes: {
                Row: {
                    id: number
                    process_number: string
                    title: string
                    court: string | null
                    status: string
                    client_id: number | null
                    office_id: string | null
                    created_at: string | null
                    updated_at: string | null
                }
                Insert: {
                    id?: number
                    process_number: string
                    title: string
                    court?: string | null
                    status: string
                    client_id?: number | null
                    office_id?: string | null
                    created_at?: string | null
                    updated_at?: string | null
                }
                Update: {
                    id?: number
                    process_number?: string
                    title?: string
                    court?: string | null
                    status?: string
                    client_id?: number | null
                    office_id?: string | null
                    created_at?: string | null
                    updated_at?: string | null
                }
            }
            profiles: {
                Row: {
                    id: string
                    full_name: string | null
                    office_id: string | null
                    created_at: string | null
                }
                Insert: {
                    id: string
                    full_name?: string | null
                    office_id?: string | null
                    created_at?: string | null
                }
                Update: {
                    id?: string
                    full_name?: string | null
                    office_id?: string | null
                    created_at?: string | null
                }
            }
            units: {
                Row: {
                    id: number
                    condominium_id: number
                    unit_number: string
                    owner_name: string | null
                    office_id: string | null
                    created_at: string | null
                }
                Insert: {
                    id?: number
                    condominium_id: number
                    unit_number: string
                    owner_name?: string | null
                    office_id?: string | null
                    created_at?: string | null
                }
                Update: {
                    id?: number
                    condominium_id?: number
                    unit_number?: string
                    owner_name?: string | null
                    office_id?: string | null
                    created_at?: string | null
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
    }
}

type PublicSchema = Database[keyof Database]

export type Tables<
    PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
            Row: infer R
        }
    ? R
    : never
    : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
            Row: infer R
        }
    ? R
    : never
    : never

export type TablesInsert<
    PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
        Insert: infer I
    }
    ? I
    : never
    : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
    }
    ? I
    : never
    : never

export type TablesUpdate<
    PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
        Update: infer U
    }
    ? U
    : never
    : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
    }
    ? U
    : never
    : never
