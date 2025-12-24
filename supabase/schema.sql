-- Ten Point Property Management Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (property managers)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Properties table
CREATE TABLE IF NOT EXISTS properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  description TEXT,
  airbnb_ical_url TEXT,
  vrbo_ical_url TEXT,
  amenities JSONB DEFAULT '[]',
  house_rules TEXT,
  check_in_time TEXT DEFAULT '15:00',
  check_out_time TEXT DEFAULT '11:00',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Guests table
CREATE TABLE IF NOT EXISTS guests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  notes TEXT,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vendors table (for maintenance)
CREATE TABLE IF NOT EXISTS vendors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  service_type TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE NOT NULL,
  guest_id UUID REFERENCES guests(id) ON DELETE SET NULL,
  source TEXT NOT NULL CHECK (source IN ('airbnb', 'vrbo', 'direct', 'other')),
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  status TEXT DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'checked_in', 'checked_out', 'cancelled')),
  nightly_rate DECIMAL(10, 2),
  cleaning_fee DECIMAL(10, 2),
  total_amount DECIMAL(10, 2),
  platform_fee DECIMAL(10, 2),
  payout_amount DECIMAL(10, 2),
  notes TEXT,
  external_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Expenses table
CREATE TABLE IF NOT EXISTS expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE NOT NULL,
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  category TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  vendor_id UUID REFERENCES vendors(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Maintenance tasks table
CREATE TABLE IF NOT EXISTS maintenance_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('cleaning', 'landscaping', 'pool', 'repair', 'other')),
  title TEXT NOT NULL,
  scheduled_date DATE NOT NULL,
  completed_date DATE,
  vendor_id UUID REFERENCES vendors(id) ON DELETE SET NULL,
  cost DECIMAL(10, 2),
  notes TEXT,
  recurring BOOLEAN DEFAULT FALSE,
  recurrence_rule TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Guest communications table
CREATE TABLE IF NOT EXISTS guest_communications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  guest_id UUID REFERENCES guests(id) ON DELETE CASCADE NOT NULL,
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('email', 'sms')),
  direction TEXT NOT NULL CHECK (direction IN ('in', 'out')),
  subject TEXT,
  content TEXT NOT NULL,
  sent_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE NOT NULL,
  guest_id UUID REFERENCES guests(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  content TEXT,
  platform TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Guest portal tokens table (for magic link auth)
CREATE TABLE IF NOT EXISTS guest_portal_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  guest_id UUID REFERENCES guests(id) ON DELETE CASCADE NOT NULL,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_properties_user_id ON properties(user_id);
CREATE INDEX IF NOT EXISTS idx_guests_user_id ON guests(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_property_id ON bookings(property_id);
CREATE INDEX IF NOT EXISTS idx_bookings_guest_id ON bookings(guest_id);
CREATE INDEX IF NOT EXISTS idx_bookings_dates ON bookings(check_in, check_out);
CREATE INDEX IF NOT EXISTS idx_maintenance_property_id ON maintenance_tasks(property_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_scheduled ON maintenance_tasks(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_expenses_property_id ON expenses(property_id);
CREATE INDEX IF NOT EXISTS idx_guest_portal_tokens_token ON guest_portal_tokens(token);

-- Row Level Security (RLS) Policies
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE guest_communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE guest_portal_tokens ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own data" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Properties policies
CREATE POLICY "Users can view own properties" ON properties
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own properties" ON properties
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own properties" ON properties
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own properties" ON properties
  FOR DELETE USING (auth.uid() = user_id);

-- Guests policies
CREATE POLICY "Users can view own guests" ON guests
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own guests" ON guests
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own guests" ON guests
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own guests" ON guests
  FOR DELETE USING (auth.uid() = user_id);

-- Vendors policies
CREATE POLICY "Users can view own vendors" ON vendors
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own vendors" ON vendors
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own vendors" ON vendors
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own vendors" ON vendors
  FOR DELETE USING (auth.uid() = user_id);

-- Bookings policies (through property ownership)
CREATE POLICY "Users can view own bookings" ON bookings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = bookings.property_id
      AND properties.user_id = auth.uid()
    )
  );
CREATE POLICY "Users can insert own bookings" ON bookings
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = bookings.property_id
      AND properties.user_id = auth.uid()
    )
  );
CREATE POLICY "Users can update own bookings" ON bookings
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = bookings.property_id
      AND properties.user_id = auth.uid()
    )
  );
CREATE POLICY "Users can delete own bookings" ON bookings
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = bookings.property_id
      AND properties.user_id = auth.uid()
    )
  );

-- Expenses policies (through property ownership)
CREATE POLICY "Users can view own expenses" ON expenses
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = expenses.property_id
      AND properties.user_id = auth.uid()
    )
  );
CREATE POLICY "Users can manage own expenses" ON expenses
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = expenses.property_id
      AND properties.user_id = auth.uid()
    )
  );

-- Maintenance tasks policies (through property ownership)
CREATE POLICY "Users can view own maintenance" ON maintenance_tasks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = maintenance_tasks.property_id
      AND properties.user_id = auth.uid()
    )
  );
CREATE POLICY "Users can manage own maintenance" ON maintenance_tasks
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = maintenance_tasks.property_id
      AND properties.user_id = auth.uid()
    )
  );

-- Guest communications policies (through guest ownership)
CREATE POLICY "Users can view own communications" ON guest_communications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM guests
      WHERE guests.id = guest_communications.guest_id
      AND guests.user_id = auth.uid()
    )
  );
CREATE POLICY "Users can manage own communications" ON guest_communications
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM guests
      WHERE guests.id = guest_communications.guest_id
      AND guests.user_id = auth.uid()
    )
  );

-- Reviews policies
CREATE POLICY "Users can view own reviews" ON reviews
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM bookings
      JOIN properties ON properties.id = bookings.property_id
      WHERE bookings.id = reviews.booking_id
      AND properties.user_id = auth.uid()
    )
  );
CREATE POLICY "Users can manage own reviews" ON reviews
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM bookings
      JOIN properties ON properties.id = bookings.property_id
      WHERE bookings.id = reviews.booking_id
      AND properties.user_id = auth.uid()
    )
  );

-- Guest portal tokens policies (through guest ownership)
CREATE POLICY "Users can view own tokens" ON guest_portal_tokens
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM guests
      WHERE guests.id = guest_portal_tokens.guest_id
      AND guests.user_id = auth.uid()
    )
  );
CREATE POLICY "Users can manage own tokens" ON guest_portal_tokens
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM guests
      WHERE guests.id = guest_portal_tokens.guest_id
      AND guests.user_id = auth.uid()
    )
  );
