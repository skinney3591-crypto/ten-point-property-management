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
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          avatar_url?: string | null
          created_at?: string
        }
      }
      properties: {
        Row: {
          id: string
          user_id: string
          name: string
          address: string
          description: string | null
          airbnb_ical_url: string | null
          vrbo_ical_url: string | null
          amenities: Json | null
          house_rules: string | null
          check_in_time: string | null
          check_out_time: string | null
          photos: string[] | null
          is_public: boolean
          nightly_rate: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          address: string
          description?: string | null
          airbnb_ical_url?: string | null
          vrbo_ical_url?: string | null
          amenities?: Json | null
          house_rules?: string | null
          check_in_time?: string | null
          check_out_time?: string | null
          photos?: string[] | null
          is_public?: boolean
          nightly_rate?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          address?: string
          description?: string | null
          airbnb_ical_url?: string | null
          vrbo_ical_url?: string | null
          amenities?: Json | null
          house_rules?: string | null
          check_in_time?: string | null
          check_out_time?: string | null
          photos?: string[] | null
          is_public?: boolean
          nightly_rate?: number | null
          created_at?: string
        }
      }
      guests: {
        Row: {
          id: string
          user_id: string
          email: string
          name: string
          phone: string | null
          notes: string | null
          preferences: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          email: string
          name: string
          phone?: string | null
          notes?: string | null
          preferences?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          email?: string
          name?: string
          phone?: string | null
          notes?: string | null
          preferences?: Json | null
          created_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          property_id: string
          guest_id: string | null
          source: 'airbnb' | 'vrbo' | 'direct' | 'other'
          check_in: string
          check_out: string
          status: 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled'
          nightly_rate: number | null
          cleaning_fee: number | null
          total_amount: number | null
          platform_fee: number | null
          payout_amount: number | null
          notes: string | null
          external_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          property_id: string
          guest_id?: string | null
          source: 'airbnb' | 'vrbo' | 'direct' | 'other'
          check_in: string
          check_out: string
          status?: 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled'
          nightly_rate?: number | null
          cleaning_fee?: number | null
          total_amount?: number | null
          platform_fee?: number | null
          payout_amount?: number | null
          notes?: string | null
          external_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          guest_id?: string | null
          source?: 'airbnb' | 'vrbo' | 'direct' | 'other'
          check_in?: string
          check_out?: string
          status?: 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled'
          nightly_rate?: number | null
          cleaning_fee?: number | null
          total_amount?: number | null
          platform_fee?: number | null
          payout_amount?: number | null
          notes?: string | null
          external_id?: string | null
          created_at?: string
        }
      }
      expenses: {
        Row: {
          id: string
          property_id: string
          booking_id: string | null
          category: string
          amount: number
          description: string | null
          date: string
          vendor_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          property_id: string
          booking_id?: string | null
          category: string
          amount: number
          description?: string | null
          date: string
          vendor_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          booking_id?: string | null
          category?: string
          amount?: number
          description?: string | null
          date?: string
          vendor_id?: string | null
          created_at?: string
        }
      }
      maintenance_tasks: {
        Row: {
          id: string
          property_id: string
          type: 'cleaning' | 'landscaping' | 'pool' | 'repair' | 'other'
          title: string
          scheduled_date: string
          completed_date: string | null
          vendor_id: string | null
          cost: number | null
          notes: string | null
          recurring: boolean
          recurrence_rule: string | null
          created_at: string
        }
        Insert: {
          id?: string
          property_id: string
          type: 'cleaning' | 'landscaping' | 'pool' | 'repair' | 'other'
          title: string
          scheduled_date: string
          completed_date?: string | null
          vendor_id?: string | null
          cost?: number | null
          notes?: string | null
          recurring?: boolean
          recurrence_rule?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          type?: 'cleaning' | 'landscaping' | 'pool' | 'repair' | 'other'
          title?: string
          scheduled_date?: string
          completed_date?: string | null
          vendor_id?: string | null
          cost?: number | null
          notes?: string | null
          recurring?: boolean
          recurrence_rule?: string | null
          created_at?: string
        }
      }
      vendors: {
        Row: {
          id: string
          user_id: string
          name: string
          service_type: string
          email: string | null
          phone: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          service_type: string
          email?: string | null
          phone?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          service_type?: string
          email?: string | null
          phone?: string | null
          notes?: string | null
          created_at?: string
        }
      }
      guest_communications: {
        Row: {
          id: string
          guest_id: string
          booking_id: string | null
          type: 'email' | 'sms'
          direction: 'in' | 'out'
          subject: string | null
          content: string
          sent_at: string
        }
        Insert: {
          id?: string
          guest_id: string
          booking_id?: string | null
          type: 'email' | 'sms'
          direction: 'in' | 'out'
          subject?: string | null
          content: string
          sent_at?: string
        }
        Update: {
          id?: string
          guest_id?: string
          booking_id?: string | null
          type?: 'email' | 'sms'
          direction?: 'in' | 'out'
          subject?: string | null
          content?: string
          sent_at?: string
        }
      }
      inquiries: {
        Row: {
          id: string
          property_id: string
          name: string
          email: string
          phone: string | null
          check_in: string | null
          check_out: string | null
          guests: number | null
          message: string
          status: 'new' | 'contacted' | 'converted' | 'declined'
          created_at: string
        }
        Insert: {
          id?: string
          property_id: string
          name: string
          email: string
          phone?: string | null
          check_in?: string | null
          check_out?: string | null
          guests?: number | null
          message: string
          status?: 'new' | 'contacted' | 'converted' | 'declined'
          created_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          name?: string
          email?: string
          phone?: string | null
          check_in?: string | null
          check_out?: string | null
          guests?: number | null
          message?: string
          status?: 'new' | 'contacted' | 'converted' | 'declined'
          created_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          booking_id: string
          guest_id: string
          rating: number
          content: string | null
          platform: string | null
          created_at: string
        }
        Insert: {
          id?: string
          booking_id: string
          guest_id: string
          rating: number
          content?: string | null
          platform?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          booking_id?: string
          guest_id?: string
          rating?: number
          content?: string | null
          platform?: string | null
          created_at?: string
        }
      }
      guest_portal_tokens: {
        Row: {
          id: string
          guest_id: string
          token: string
          expires_at: string
          created_at: string
        }
        Insert: {
          id?: string
          guest_id: string
          token: string
          expires_at: string
          created_at?: string
        }
        Update: {
          id?: string
          guest_id?: string
          token?: string
          expires_at?: string
          created_at?: string
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Convenience types
export type User = Database['public']['Tables']['users']['Row']
export type Property = Database['public']['Tables']['properties']['Row']
export type Guest = Database['public']['Tables']['guests']['Row']
export type Booking = Database['public']['Tables']['bookings']['Row']
export type Expense = Database['public']['Tables']['expenses']['Row']
export type MaintenanceTask = Database['public']['Tables']['maintenance_tasks']['Row']
export type Vendor = Database['public']['Tables']['vendors']['Row']
export type GuestCommunication = Database['public']['Tables']['guest_communications']['Row']
export type Review = Database['public']['Tables']['reviews']['Row']
export type GuestPortalToken = Database['public']['Tables']['guest_portal_tokens']['Row']

// Insert types
export type PropertyInsert = Database['public']['Tables']['properties']['Insert']
export type GuestInsert = Database['public']['Tables']['guests']['Insert']
export type BookingInsert = Database['public']['Tables']['bookings']['Insert']
export type MaintenanceTaskInsert = Database['public']['Tables']['maintenance_tasks']['Insert']
export type VendorInsert = Database['public']['Tables']['vendors']['Insert']
export type ExpenseInsert = Database['public']['Tables']['expenses']['Insert']
export type GuestCommunicationInsert = Database['public']['Tables']['guest_communications']['Insert']
export type ReviewInsert = Database['public']['Tables']['reviews']['Insert']
export type GuestPortalTokenInsert = Database['public']['Tables']['guest_portal_tokens']['Insert']

// Extended types for joins
export interface BookingWithDetails extends Booking {
  property?: Property
  guest?: Guest | null
}

export interface MaintenanceWithDetails extends MaintenanceTask {
  property?: Property
  vendor?: Vendor | null
}
