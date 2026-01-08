/**
 * Client-side Supabase helpers
 *
 * This file provides helpers for client components that need to access Supabase.
 * It's separate from queries.ts to avoid importing server-only code.
 */

import { createClient } from './client'

/**
 * Get a typed Supabase client for client components
 */
export function getSupabaseBrowser() {
  return createClient()
}

// Re-export createClient for compatibility
export { createClient }
