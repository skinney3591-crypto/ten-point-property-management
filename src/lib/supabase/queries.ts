/**
 * Typed Supabase Query Helpers (Server-side only)
 *
 * These helpers provide type-safe database queries without needing `as any` casts.
 * They wrap the Supabase client methods with proper TypeScript generics.
 *
 * NOTE: This file is for server components and API routes only.
 * For client components, use `getSupabaseBrowser` from '@/lib/supabase/client-queries'
 */

import { createClient } from './server'
import type {
  Database,
  Property,
  Guest,
  Booking,
  Expense,
  MaintenanceTask,
  Vendor,
  GuestCommunication,
  Review,
  GuestPortalToken,
  User
} from '@/types/database'

// Table name type for type-safe table references
type TableName = keyof Database['public']['Tables']

// Generic row type extractor
type TableRow<T extends TableName> = Database['public']['Tables'][T]['Row']
type TableInsert<T extends TableName> = Database['public']['Tables'][T]['Insert']
type TableUpdate<T extends TableName> = Database['public']['Tables'][T]['Update']

/**
 * Get a typed Supabase client for server components
 */
export async function getSupabase() {
  return createClient()
}

// ============================================
// PROPERTY QUERIES
// ============================================

export async function getProperties(): Promise<Property[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .order('name')

  if (error) throw error
  return data ?? []
}

export async function getPropertyById(id: string): Promise<Property | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data
}

export async function createProperty(property: TableInsert<'properties'>): Promise<Property> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('properties')
    .insert(property as never)
    .select()
    .single() as { data: Property; error: unknown }

  if (error) throw error
  return data
}

export async function updateProperty(id: string, updates: TableUpdate<'properties'>): Promise<Property> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('properties')
    .update(updates as never)
    .eq('id', id)
    .select()
    .single() as { data: Property; error: unknown }

  if (error) throw error
  return data
}

export async function deleteProperty(id: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('properties')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// ============================================
// GUEST QUERIES
// ============================================

export async function getGuests(): Promise<Guest[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('guests')
    .select('*')
    .order('name')

  if (error) throw error
  return data ?? []
}

export async function getGuestById(id: string): Promise<Guest | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('guests')
    .select('*')
    .eq('id', id)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data
}

export async function getGuestByEmail(email: string): Promise<Guest | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('guests')
    .select('*')
    .eq('email', email)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data
}

export async function createGuest(guest: TableInsert<'guests'>): Promise<Guest> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('guests')
    .insert(guest as never)
    .select()
    .single() as { data: Guest; error: unknown }

  if (error) throw error
  return data
}

export async function updateGuest(id: string, updates: TableUpdate<'guests'>): Promise<Guest> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('guests')
    .update(updates as never)
    .eq('id', id)
    .select()
    .single() as { data: Guest; error: unknown }

  if (error) throw error
  return data
}

export async function deleteGuest(id: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('guests')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// ============================================
// BOOKING QUERIES
// ============================================

export async function getBookings(): Promise<Booking[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .order('check_in', { ascending: false })

  if (error) throw error
  return data ?? []
}

export async function getBookingsByProperty(propertyId: string): Promise<Booking[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('property_id', propertyId)
    .order('check_in', { ascending: false })

  if (error) throw error
  return data ?? []
}

export async function getBookingsByGuest(guestId: string): Promise<Booking[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('guest_id', guestId)
    .order('check_in', { ascending: false })

  if (error) throw error
  return data ?? []
}

export async function getBookingById(id: string): Promise<Booking | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('id', id)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data
}

export async function getUpcomingBookings(limit?: number): Promise<Booking[]> {
  const supabase = await createClient()
  const today = new Date().toISOString().split('T')[0]

  let query = supabase
    .from('bookings')
    .select('*')
    .gte('check_in', today)
    .order('check_in')

  if (limit) {
    query = query.limit(limit)
  }

  const { data, error } = await query
  if (error) throw error
  return data ?? []
}

export async function createBooking(booking: TableInsert<'bookings'>): Promise<Booking> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('bookings')
    .insert(booking as never)
    .select()
    .single() as { data: Booking; error: unknown }

  if (error) throw error
  return data
}

export async function updateBooking(id: string, updates: TableUpdate<'bookings'>): Promise<Booking> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('bookings')
    .update(updates as never)
    .eq('id', id)
    .select()
    .single() as { data: Booking; error: unknown }

  if (error) throw error
  return data
}

export async function deleteBooking(id: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('bookings')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// ============================================
// EXPENSE QUERIES
// ============================================

export async function getExpenses(): Promise<Expense[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .order('date', { ascending: false })

  if (error) throw error
  return data ?? []
}

export async function getExpensesByProperty(propertyId: string): Promise<Expense[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('property_id', propertyId)
    .order('date', { ascending: false })

  if (error) throw error
  return data ?? []
}

export async function createExpense(expense: TableInsert<'expenses'>): Promise<Expense> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('expenses')
    .insert(expense as never)
    .select()
    .single() as { data: Expense; error: unknown }

  if (error) throw error
  return data
}

export async function updateExpense(id: string, updates: TableUpdate<'expenses'>): Promise<Expense> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('expenses')
    .update(updates as never)
    .eq('id', id)
    .select()
    .single() as { data: Expense; error: unknown }

  if (error) throw error
  return data
}

export async function deleteExpense(id: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('expenses')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// ============================================
// MAINTENANCE TASK QUERIES
// ============================================

export async function getMaintenanceTasks(): Promise<MaintenanceTask[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('maintenance_tasks')
    .select('*')
    .order('scheduled_date')

  if (error) throw error
  return data ?? []
}

export async function getMaintenanceTasksByProperty(propertyId: string): Promise<MaintenanceTask[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('maintenance_tasks')
    .select('*')
    .eq('property_id', propertyId)
    .order('scheduled_date')

  if (error) throw error
  return data ?? []
}

export async function getPendingMaintenanceTasks(): Promise<MaintenanceTask[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('maintenance_tasks')
    .select('*')
    .is('completed_date', null)
    .order('scheduled_date')

  if (error) throw error
  return data ?? []
}

export async function createMaintenanceTask(task: TableInsert<'maintenance_tasks'>): Promise<MaintenanceTask> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('maintenance_tasks')
    .insert(task as never)
    .select()
    .single() as { data: MaintenanceTask; error: unknown }

  if (error) throw error
  return data
}

export async function updateMaintenanceTask(id: string, updates: TableUpdate<'maintenance_tasks'>): Promise<MaintenanceTask> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('maintenance_tasks')
    .update(updates as never)
    .eq('id', id)
    .select()
    .single() as { data: MaintenanceTask; error: unknown }

  if (error) throw error
  return data
}

export async function deleteMaintenanceTask(id: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('maintenance_tasks')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// ============================================
// VENDOR QUERIES
// ============================================

export async function getVendors(): Promise<Vendor[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('vendors')
    .select('*')
    .order('name')

  if (error) throw error
  return data ?? []
}

export async function getVendorById(id: string): Promise<Vendor | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('vendors')
    .select('*')
    .eq('id', id)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data
}

export async function createVendor(vendor: TableInsert<'vendors'>): Promise<Vendor> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('vendors')
    .insert(vendor as never)
    .select()
    .single() as { data: Vendor; error: unknown }

  if (error) throw error
  return data
}

export async function updateVendor(id: string, updates: TableUpdate<'vendors'>): Promise<Vendor> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('vendors')
    .update(updates as never)
    .eq('id', id)
    .select()
    .single() as { data: Vendor; error: unknown }

  if (error) throw error
  return data
}

export async function deleteVendor(id: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('vendors')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// ============================================
// COMMUNICATION QUERIES
// ============================================

export async function getCommunicationsByGuest(guestId: string): Promise<GuestCommunication[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('guest_communications')
    .select('*')
    .eq('guest_id', guestId)
    .order('sent_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

export async function createCommunication(comm: TableInsert<'guest_communications'>): Promise<GuestCommunication> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('guest_communications')
    .insert(comm as never)
    .select()
    .single() as { data: GuestCommunication; error: unknown }

  if (error) throw error
  return data
}

// ============================================
// PORTAL TOKEN QUERIES
// ============================================

export async function getPortalTokenByToken(token: string): Promise<GuestPortalToken | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('guest_portal_tokens')
    .select('*')
    .eq('token', token)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data
}

export async function createPortalToken(tokenData: TableInsert<'guest_portal_tokens'>): Promise<GuestPortalToken> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('guest_portal_tokens')
    .insert(tokenData as never)
    .select()
    .single() as { data: GuestPortalToken; error: unknown }

  if (error) throw error
  return data
}

export async function deletePortalTokensByGuest(guestId: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('guest_portal_tokens')
    .delete()
    .eq('guest_id', guestId)

  if (error) throw error
}

// ============================================
// USER QUERIES
// ============================================

export async function getUserById(id: string): Promise<User | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data
}

export async function upsertUser(user: TableInsert<'users'>): Promise<User> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('users')
    .upsert(user as never)
    .select()
    .single() as { data: User; error: unknown }

  if (error) throw error
  return data
}

// ============================================
// REVIEW QUERIES
// ============================================

export async function getReviewsByGuest(guestId: string): Promise<Review[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('guest_id', guestId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

export async function createReview(review: TableInsert<'reviews'>): Promise<Review> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('reviews')
    .insert(review as never)
    .select()
    .single() as { data: Review; error: unknown }

  if (error) throw error
  return data
}

// ============================================
// INQUIRY QUERIES (using guests table for now)
// ============================================

export async function getInquiries(): Promise<Guest[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('guests')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

// ============================================
// RELATIONAL QUERIES (with joins)
// ============================================

export interface GuestWithBookings extends Guest {
  bookings: Booking[]
}

export interface GuestWithFullData extends Guest {
  bookings: (Booking & { properties: Property })[]
  guest_communications: GuestCommunication[]
}

export interface BookingWithProperty extends Booking {
  properties: Property
}

export interface BookingWithGuest extends Booking {
  guests: Guest | null
}

export interface ExpenseWithDetails extends Expense {
  properties: Property
  vendors: Vendor | null
}

export interface MaintenanceWithDetails extends MaintenanceTask {
  properties: Property
  vendors: Vendor | null
}

export interface InquiryWithProperty {
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
  properties: {
    id: string
    name: string
  }
}

/**
 * Get guests with their booking history
 */
export async function getGuestsWithBookings(): Promise<GuestWithBookings[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('guests')
    .select('*, bookings(*)')
    .order('name')

  if (error) throw error
  return (data ?? []) as GuestWithBookings[]
}

/**
 * Get a single guest with full relational data (bookings with properties, communications)
 */
export async function getGuestWithFullData(id: string): Promise<GuestWithFullData | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('guests')
    .select('*, bookings(*, properties(*)), guest_communications(*)')
    .eq('id', id)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data as GuestWithFullData | null
}

/**
 * Get bookings within a date range with property data
 */
export async function getBookingsInRangeWithProperty(
  startDate: Date,
  endDate: Date,
  excludeCancelled = true
): Promise<BookingWithProperty[]> {
  const supabase = await createClient()
  let query = supabase
    .from('bookings')
    .select('*, properties(*)')
    .gte('check_in', startDate.toISOString())
    .lte('check_out', endDate.toISOString())

  if (excludeCancelled) {
    query = query.neq('status', 'cancelled')
  }

  const { data, error } = await query
  if (error) throw error
  return (data ?? []) as BookingWithProperty[]
}

/**
 * Get bookings for a property with guest data
 */
export async function getBookingsByPropertyWithGuest(propertyId: string): Promise<BookingWithGuest[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('bookings')
    .select('*, guests(*)')
    .eq('property_id', propertyId)
    .order('check_in', { ascending: false })

  if (error) throw error
  return (data ?? []) as BookingWithGuest[]
}

/**
 * Get expenses within a date range with property and vendor data
 */
export async function getExpensesInRangeWithDetails(
  startDate: Date,
  endDate: Date
): Promise<ExpenseWithDetails[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('expenses')
    .select('*, properties(*), vendors(*)')
    .gte('date', startDate.toISOString())
    .lte('date', endDate.toISOString())
    .order('date', { ascending: false })

  if (error) throw error
  return (data ?? []) as ExpenseWithDetails[]
}

/**
 * Get maintenance tasks with property and vendor details
 */
export async function getMaintenanceTasksWithDetails(): Promise<MaintenanceWithDetails[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('maintenance_tasks')
    .select('*, properties(*), vendors(*)')
    .order('scheduled_date', { ascending: true })

  if (error) throw error
  return (data ?? []) as MaintenanceWithDetails[]
}

/**
 * Get inquiries with property data
 */
export async function getInquiriesWithProperty(): Promise<InquiryWithProperty[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('inquiries')
    .select('*, properties(id, name)')
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data ?? []) as InquiryWithProperty[]
}
