-- Remove User Isolation - All authenticated users see all data
-- Run this in Supabase SQL Editor

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can view own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Users can insert own data" ON users;

DROP POLICY IF EXISTS "Users can view own properties" ON properties;
DROP POLICY IF EXISTS "Users can insert own properties" ON properties;
DROP POLICY IF EXISTS "Users can update own properties" ON properties;
DROP POLICY IF EXISTS "Users can delete own properties" ON properties;
DROP POLICY IF EXISTS "Public can view public properties" ON properties;

DROP POLICY IF EXISTS "Users can view own guests" ON guests;
DROP POLICY IF EXISTS "Users can insert own guests" ON guests;
DROP POLICY IF EXISTS "Users can update own guests" ON guests;
DROP POLICY IF EXISTS "Users can delete own guests" ON guests;

DROP POLICY IF EXISTS "Users can view own vendors" ON vendors;
DROP POLICY IF EXISTS "Users can insert own vendors" ON vendors;
DROP POLICY IF EXISTS "Users can update own vendors" ON vendors;
DROP POLICY IF EXISTS "Users can delete own vendors" ON vendors;

DROP POLICY IF EXISTS "Users can view own bookings" ON bookings;
DROP POLICY IF EXISTS "Users can insert own bookings" ON bookings;
DROP POLICY IF EXISTS "Users can update own bookings" ON bookings;
DROP POLICY IF EXISTS "Users can delete own bookings" ON bookings;
DROP POLICY IF EXISTS "Public can view bookings for public properties" ON bookings;

DROP POLICY IF EXISTS "Users can view own expenses" ON expenses;
DROP POLICY IF EXISTS "Users can manage own expenses" ON expenses;

DROP POLICY IF EXISTS "Users can view own maintenance" ON maintenance_tasks;
DROP POLICY IF EXISTS "Users can manage own maintenance" ON maintenance_tasks;

DROP POLICY IF EXISTS "Users can view own communications" ON guest_communications;
DROP POLICY IF EXISTS "Users can manage own communications" ON guest_communications;

DROP POLICY IF EXISTS "Users can view own reviews" ON reviews;
DROP POLICY IF EXISTS "Users can manage own reviews" ON reviews;

DROP POLICY IF EXISTS "Users can view own tokens" ON guest_portal_tokens;
DROP POLICY IF EXISTS "Users can manage own tokens" ON guest_portal_tokens;

DROP POLICY IF EXISTS "Users can view own inquiries" ON inquiries;
DROP POLICY IF EXISTS "Users can manage own inquiries" ON inquiries;
DROP POLICY IF EXISTS "Anyone can submit inquiries" ON inquiries;

-- Create new policies: Any authenticated user can do anything
-- Users table
CREATE POLICY "Authenticated users can view all users" ON users
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert users" ON users
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update users" ON users
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Properties table
CREATE POLICY "Authenticated users can manage all properties" ON properties
  FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Public can view public properties" ON properties
  FOR SELECT USING (is_public = true);

-- Guests table
CREATE POLICY "Authenticated users can manage all guests" ON guests
  FOR ALL USING (auth.role() = 'authenticated');

-- Vendors table
CREATE POLICY "Authenticated users can manage all vendors" ON vendors
  FOR ALL USING (auth.role() = 'authenticated');

-- Bookings table
CREATE POLICY "Authenticated users can manage all bookings" ON bookings
  FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Public can view bookings for public properties" ON bookings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = bookings.property_id
      AND properties.is_public = true
    )
  );

-- Expenses table
CREATE POLICY "Authenticated users can manage all expenses" ON expenses
  FOR ALL USING (auth.role() = 'authenticated');

-- Maintenance tasks table
CREATE POLICY "Authenticated users can manage all maintenance" ON maintenance_tasks
  FOR ALL USING (auth.role() = 'authenticated');

-- Guest communications table
CREATE POLICY "Authenticated users can manage all communications" ON guest_communications
  FOR ALL USING (auth.role() = 'authenticated');

-- Reviews table
CREATE POLICY "Authenticated users can manage all reviews" ON reviews
  FOR ALL USING (auth.role() = 'authenticated');

-- Guest portal tokens table
CREATE POLICY "Authenticated users can manage all tokens" ON guest_portal_tokens
  FOR ALL USING (auth.role() = 'authenticated');

-- Inquiries table
CREATE POLICY "Authenticated users can manage all inquiries" ON inquiries
  FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Anyone can submit inquiries" ON inquiries
  FOR INSERT WITH CHECK (true);
