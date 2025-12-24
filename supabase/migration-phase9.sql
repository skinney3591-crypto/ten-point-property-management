-- Phase 9: Public Property Listings Migration
-- Run this in Supabase SQL Editor

-- 1. Add new columns to properties table
ALTER TABLE properties ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT FALSE;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS photos JSONB DEFAULT '[]';
ALTER TABLE properties ADD COLUMN IF NOT EXISTS nightly_rate DECIMAL(10, 2);

-- 2. Create inquiries table
CREATE TABLE IF NOT EXISTS inquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  check_in DATE,
  check_out DATE,
  guests INTEGER,
  message TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'converted', 'declined')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create index for inquiries
CREATE INDEX IF NOT EXISTS idx_inquiries_property_id ON inquiries(property_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status);
CREATE INDEX IF NOT EXISTS idx_properties_is_public ON properties(is_public);

-- 4. Enable RLS on inquiries
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies for inquiries (owners can manage through property ownership)
CREATE POLICY "Users can view own inquiries" ON inquiries
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = inquiries.property_id
      AND properties.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage own inquiries" ON inquiries
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = inquiries.property_id
      AND properties.user_id = auth.uid()
    )
  );

-- 6. Allow public to insert inquiries (for the inquiry form)
CREATE POLICY "Anyone can submit inquiries" ON inquiries
  FOR INSERT WITH CHECK (true);

-- 7. Allow public to view public properties (for listings page)
CREATE POLICY "Public can view public properties" ON properties
  FOR SELECT USING (is_public = true);

-- 8. Allow public to view bookings for public properties (to show availability)
CREATE POLICY "Public can view bookings for public properties" ON bookings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = bookings.property_id
      AND properties.is_public = true
    )
  );
