-- Ten Point Property Management - Test Data Seed
-- Run this in Supabase SQL Editor after logging in once

-- Get the first user ID (you should have logged in at least once)
DO $$
DECLARE
  v_user_id UUID;
  v_prop1_id UUID := gen_random_uuid();
  v_prop2_id UUID := gen_random_uuid();
  v_prop3_id UUID := gen_random_uuid();
  v_prop4_id UUID := gen_random_uuid();
  v_prop5_id UUID := gen_random_uuid();
  v_guest1_id UUID := gen_random_uuid();
  v_guest2_id UUID := gen_random_uuid();
  v_guest3_id UUID := gen_random_uuid();
  v_guest4_id UUID := gen_random_uuid();
  v_guest5_id UUID := gen_random_uuid();
  v_guest6_id UUID := gen_random_uuid();
  v_guest7_id UUID := gen_random_uuid();
  v_guest8_id UUID := gen_random_uuid();
  v_guest9_id UUID := gen_random_uuid();
  v_guest10_id UUID := gen_random_uuid();
  v_vendor1_id UUID := gen_random_uuid();
  v_vendor2_id UUID := gen_random_uuid();
  v_vendor3_id UUID := gen_random_uuid();
BEGIN
  -- Get user ID from auth.users
  SELECT id INTO v_user_id FROM auth.users LIMIT 1;

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'No user found. Please log in to the app first.';
  END IF;

  -- Insert into public users table if not exists
  INSERT INTO users (id, email, name)
  SELECT v_user_id, email, raw_user_meta_data->>'full_name'
  FROM auth.users WHERE id = v_user_id
  ON CONFLICT (id) DO NOTHING;

  -- =====================
  -- PROPERTIES (5 Montana rentals)
  -- =====================
  INSERT INTO properties (id, user_id, name, address, description, amenities, house_rules, check_in_time, check_out_time, is_public, nightly_rate, photos) VALUES
  (v_prop1_id, v_user_id, 'Mountain View Lodge', '1234 Glacier Road, Whitefish, MT 59937',
   'Stunning 4-bedroom mountain lodge with panoramic views of Glacier National Park. Perfect for families and groups seeking adventure in the Montana wilderness. Features a hot tub, game room, and spacious deck for wildlife watching.',
   '["4 Bedrooms", "3 Bathrooms", "Sleeps 10", "Hot Tub", "Game Room", "Mountain Views", "Fireplace", "Full Kitchen", "WiFi", "Washer/Dryer", "Hiking Trails", "Pet Friendly"]'::jsonb,
   'No smoking inside. Quiet hours 10pm-7am. Maximum 10 guests. Pets allowed with prior approval ($50 fee). Please remove shoes indoors.',
   '16:00', '11:00', true, 425.00,
   '["https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800", "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=800", "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800"]'::jsonb),

  (v_prop2_id, v_user_id, 'Riverside Cabin', '567 Flathead River Lane, Kalispell, MT 59901',
   'Cozy 2-bedroom cabin right on the Flathead River. Wake up to the sound of rushing water and enjoy world-class fly fishing from your backyard. Recently renovated with modern amenities while keeping rustic charm.',
   '["2 Bedrooms", "1 Bathroom", "Sleeps 4", "River Access", "Fly Fishing", "Kayaks Included", "Fire Pit", "BBQ Grill", "WiFi", "Full Kitchen"]'::jsonb,
   'Catch and release fishing encouraged. Life jackets required for water activities. No loud music by the river. Campfires in designated pit only.',
   '15:00', '10:00', true, 275.00,
   '["https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=800", "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800"]'::jsonb),

  (v_prop3_id, v_user_id, 'Big Sky Retreat', '890 Lone Mountain Trail, Big Sky, MT 59716',
   'Luxury 5-bedroom ski-in/ski-out chalet at Big Sky Resort. High-end finishes throughout, gourmet kitchen, and private hot tub with mountain views. Perfect for ski trips and summer hiking adventures.',
   '["5 Bedrooms", "4.5 Bathrooms", "Sleeps 12", "Ski-In/Ski-Out", "Hot Tub", "Heated Garage", "Boot Warmers", "Gourmet Kitchen", "Home Theater", "WiFi", "Gym"]'::jsonb,
   'No shoes on hardwood floors. Ski equipment storage in garage only. Hot tub closes at 10pm. No parties or events without prior approval.',
   '16:00', '10:00', true, 895.00,
   '["https://images.unsplash.com/photo-1520984032042-162d526883e0?w=800", "https://images.unsplash.com/photo-1605540436563-5bca919ae766?w=800", "https://images.unsplash.com/photo-1517320964276-a002fa203177?w=800"]'::jsonb),

  (v_prop4_id, v_user_id, 'Paradise Valley Ranch', '2345 Yellowstone Trail, Livingston, MT 59047',
   'Authentic Montana ranch experience on 40 acres bordering Yellowstone National Park. Original 1920s farmhouse beautifully restored with modern comforts. Horses available for trail rides, stunning stargazing at night.',
   '["3 Bedrooms", "2 Bathrooms", "Sleeps 8", "40 Acres", "Horse Rides", "Near Yellowstone", "Hot Springs Nearby", "Stargazing", "Full Kitchen", "WiFi", "Fire Pit"]'::jsonb,
   'Ranch animals are not pets - observe from a distance. Close all gates. Stay on marked trails when hiking. Campfires in designated areas only.',
   '15:00', '11:00', true, 350.00,
   '["https://images.unsplash.com/photo-1500076656116-558758c991c1?w=800", "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800"]'::jsonb),

  (v_prop5_id, v_user_id, 'Lakefront Hideaway', '789 Flathead Lake Drive, Polson, MT 59860',
   'Private lakefront home on Flathead Lake with 100ft of shoreline and private dock. 3 bedrooms with stunning lake views from every room. Kayaks, paddleboards, and fishing gear included.',
   '["3 Bedrooms", "2 Bathrooms", "Sleeps 6", "Private Dock", "Lake Access", "Kayaks", "Paddleboards", "Fishing Gear", "BBQ", "Fire Pit", "WiFi"]'::jsonb,
   'Life jackets required for all water activities. Dock quiet hours after sunset. No wake zone - respect neighbors. Fish cleaning station available.',
   '16:00', '10:00', true, 375.00,
   '["https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800", "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800"]'::jsonb);

  -- =====================
  -- VENDORS
  -- =====================
  INSERT INTO vendors (id, user_id, name, service_type, email, phone, notes) VALUES
  (v_vendor1_id, v_user_id, 'Mountain Clean Co', 'cleaning', 'info@mountainclean.com', '(406) 555-0101', 'Primary cleaning service. $150 per turnover for cabins, $250 for lodges.'),
  (v_vendor2_id, v_user_id, 'Big Sky Landscaping', 'landscaping', 'bigsky@landscape.com', '(406) 555-0202', 'Weekly lawn care in summer, snow removal in winter. $200/month base.'),
  (v_vendor3_id, v_user_id, 'Hot Tub Pros Montana', 'pool', 'service@hottubpros.com', '(406) 555-0303', 'Hot tub maintenance and repair. $75 per service call.');

  -- =====================
  -- GUESTS (10 guests)
  -- =====================
  INSERT INTO guests (id, user_id, email, name, phone, notes, preferences) VALUES
  (v_guest1_id, v_user_id, 'johnson.family@email.com', 'Michael Johnson', '(303) 555-1234', 'Repeat guest, very respectful. Loves fly fishing.', '{"dietary": "none", "room_temp": "cool"}'::jsonb),
  (v_guest2_id, v_user_id, 'sarah.williams@email.com', 'Sarah Williams', '(206) 555-2345', 'Travels with elderly parents. Needs ground floor access.', '{"accessibility": "ground floor", "quiet": true}'::jsonb),
  (v_guest3_id, v_user_id, 'the.petersons@email.com', 'Robert Peterson', '(415) 555-3456', 'Annual ski trip group. 8-10 people usually.', '{"group_size": "large", "ski_equipment": true}'::jsonb),
  (v_guest4_id, v_user_id, 'emily.chen@email.com', 'Emily Chen', '(312) 555-4567', 'Photography enthusiast, early riser for sunrise shots.', '{"early_checkin": "preferred", "photography": true}'::jsonb),
  (v_guest5_id, v_user_id, 'david.martinez@email.com', 'David Martinez', '(720) 555-5678', 'Honeymoon couple. Very private, minimal contact preferred.', '{"occasion": "honeymoon", "privacy": "high"}'::jsonb),
  (v_guest6_id, v_user_id, 'thompson.adventures@email.com', 'Lisa Thompson', '(503) 555-6789', 'Adventure family with 3 kids. Very active outdoors.', '{"kids": 3, "activities": ["hiking", "fishing", "kayaking"]}'::jsonb),
  (v_guest7_id, v_user_id, 'james.wilson@email.com', 'James Wilson', '(602) 555-7890', 'Corporate retreat organizer. Books for team events.', '{"corporate": true, "catering": "sometimes"}'::jsonb),
  (v_guest8_id, v_user_id, 'amanda.brown@email.com', 'Amanda Brown', '(801) 555-8901', 'Yoga retreat leader. Needs quiet spaces.', '{"wellness": true, "quiet_hours": "important"}'::jsonb),
  (v_guest9_id, v_user_id, 'kevin.oreilly@email.com', 'Kevin O''Reilly', '(406) 555-9012', 'Local Montana resident. Books for visiting family.', '{"local": true, "discount": "repeat"}'::jsonb),
  (v_guest10_id, v_user_id, 'garcia.reunion@email.com', 'Maria Garcia', '(505) 555-0123', 'Annual family reunion organizer. 15-20 people.', '{"reunion": true, "large_group": true}'::jsonb);

  -- =====================
  -- BOOKINGS (Past Year - ~40 bookings spread across properties)
  -- =====================

  -- Mountain View Lodge bookings
  INSERT INTO bookings (property_id, guest_id, source, check_in, check_out, status, nightly_rate, cleaning_fee, total_amount, platform_fee, payout_amount, notes) VALUES
  (v_prop1_id, v_guest1_id, 'airbnb', CURRENT_DATE - INTERVAL '340 days', CURRENT_DATE - INTERVAL '335 days', 'checked_out', 395.00, 200.00, 2175.00, 217.50, 1957.50, 'Great guests, left property spotless'),
  (v_prop1_id, v_guest3_id, 'vrbo', CURRENT_DATE - INTERVAL '300 days', CURRENT_DATE - INTERVAL '293 days', 'checked_out', 425.00, 200.00, 3175.00, 285.75, 2889.25, 'Ski trip group, 10 guests'),
  (v_prop1_id, v_guest6_id, 'direct', CURRENT_DATE - INTERVAL '250 days', CURRENT_DATE - INTERVAL '245 days', 'checked_out', 400.00, 200.00, 2200.00, 0.00, 2200.00, 'Family with kids, very happy'),
  (v_prop1_id, v_guest7_id, 'airbnb', CURRENT_DATE - INTERVAL '200 days', CURRENT_DATE - INTERVAL '197 days', 'checked_out', 450.00, 200.00, 1550.00, 155.00, 1395.00, 'Corporate retreat'),
  (v_prop1_id, v_guest10_id, 'vrbo', CURRENT_DATE - INTERVAL '150 days', CURRENT_DATE - INTERVAL '143 days', 'checked_out', 425.00, 200.00, 3175.00, 285.75, 2889.25, 'Family reunion - 18 people'),
  (v_prop1_id, v_guest1_id, 'direct', CURRENT_DATE - INTERVAL '90 days', CURRENT_DATE - INTERVAL '85 days', 'checked_out', 425.00, 200.00, 2325.00, 0.00, 2325.00, 'Repeat guest - fishing trip'),
  (v_prop1_id, v_guest4_id, 'airbnb', CURRENT_DATE - INTERVAL '45 days', CURRENT_DATE - INTERVAL '42 days', 'checked_out', 450.00, 200.00, 1550.00, 155.00, 1395.00, 'Photography workshop'),
  (v_prop1_id, v_guest3_id, 'vrbo', CURRENT_DATE + INTERVAL '15 days', CURRENT_DATE + INTERVAL '22 days', 'confirmed', 475.00, 200.00, 3525.00, 317.25, 3207.75, 'Annual ski trip - returning group');

  -- Riverside Cabin bookings
  INSERT INTO bookings (property_id, guest_id, source, check_in, check_out, status, nightly_rate, cleaning_fee, total_amount, platform_fee, payout_amount, notes) VALUES
  (v_prop2_id, v_guest1_id, 'airbnb', CURRENT_DATE - INTERVAL '320 days', CURRENT_DATE - INTERVAL '315 days', 'checked_out', 250.00, 125.00, 1375.00, 137.50, 1237.50, 'Fly fishing trip'),
  (v_prop2_id, v_guest5_id, 'direct', CURRENT_DATE - INTERVAL '280 days', CURRENT_DATE - INTERVAL '275 days', 'checked_out', 275.00, 125.00, 1500.00, 0.00, 1500.00, 'Honeymoon couple'),
  (v_prop2_id, v_guest9_id, 'direct', CURRENT_DATE - INTERVAL '240 days', CURRENT_DATE - INTERVAL '237 days', 'checked_out', 250.00, 125.00, 875.00, 0.00, 875.00, 'Local booking - family visit'),
  (v_prop2_id, v_guest4_id, 'vrbo', CURRENT_DATE - INTERVAL '180 days', CURRENT_DATE - INTERVAL '176 days', 'checked_out', 275.00, 125.00, 1225.00, 110.25, 1114.75, 'River photography'),
  (v_prop2_id, v_guest8_id, 'airbnb', CURRENT_DATE - INTERVAL '120 days', CURRENT_DATE - INTERVAL '115 days', 'checked_out', 275.00, 125.00, 1500.00, 150.00, 1350.00, 'Solo wellness retreat'),
  (v_prop2_id, v_guest1_id, 'direct', CURRENT_DATE - INTERVAL '60 days', CURRENT_DATE - INTERVAL '55 days', 'checked_out', 275.00, 125.00, 1500.00, 0.00, 1500.00, 'Return guest - more fishing'),
  (v_prop2_id, v_guest2_id, 'airbnb', CURRENT_DATE - INTERVAL '20 days', CURRENT_DATE - INTERVAL '16 days', 'checked_out', 275.00, 125.00, 1225.00, 122.50, 1102.50, 'Quiet getaway'),
  (v_prop2_id, v_guest5_id, 'vrbo', CURRENT_DATE + INTERVAL '30 days', CURRENT_DATE + INTERVAL '35 days', 'confirmed', 299.00, 125.00, 1620.00, 145.80, 1474.20, 'Anniversary trip');

  -- Big Sky Retreat bookings
  INSERT INTO bookings (property_id, guest_id, source, check_in, check_out, status, nightly_rate, cleaning_fee, total_amount, platform_fee, payout_amount, notes) VALUES
  (v_prop3_id, v_guest3_id, 'vrbo', CURRENT_DATE - INTERVAL '330 days', CURRENT_DATE - INTERVAL '323 days', 'checked_out', 850.00, 350.00, 6300.00, 567.00, 5733.00, 'Ski week - full house'),
  (v_prop3_id, v_guest7_id, 'direct', CURRENT_DATE - INTERVAL '270 days', CURRENT_DATE - INTERVAL '266 days', 'checked_out', 895.00, 350.00, 3930.00, 0.00, 3930.00, 'Corporate retreat - 12 people'),
  (v_prop3_id, v_guest10_id, 'airbnb', CURRENT_DATE - INTERVAL '210 days', CURRENT_DATE - INTERVAL '203 days', 'checked_out', 750.00, 350.00, 5600.00, 560.00, 5040.00, 'Summer family reunion'),
  (v_prop3_id, v_guest3_id, 'vrbo', CURRENT_DATE - INTERVAL '100 days', CURRENT_DATE - INTERVAL '93 days', 'checked_out', 895.00, 350.00, 6615.00, 595.35, 6019.65, 'Early season ski'),
  (v_prop3_id, v_guest7_id, 'direct', CURRENT_DATE - INTERVAL '35 days', CURRENT_DATE - INTERVAL '32 days', 'checked_out', 895.00, 350.00, 3035.00, 0.00, 3035.00, 'Team building event'),
  (v_prop3_id, v_guest3_id, 'vrbo', CURRENT_DATE + INTERVAL '45 days', CURRENT_DATE + INTERVAL '52 days', 'confirmed', 950.00, 350.00, 7000.00, 630.00, 6370.00, 'Peak ski season booking');

  -- Paradise Valley Ranch bookings
  INSERT INTO bookings (property_id, guest_id, source, check_in, check_out, status, nightly_rate, cleaning_fee, total_amount, platform_fee, payout_amount, notes) VALUES
  (v_prop4_id, v_guest6_id, 'airbnb', CURRENT_DATE - INTERVAL '310 days', CURRENT_DATE - INTERVAL '305 days', 'checked_out', 325.00, 175.00, 1800.00, 180.00, 1620.00, 'Family adventure trip'),
  (v_prop4_id, v_guest4_id, 'vrbo', CURRENT_DATE - INTERVAL '260 days', CURRENT_DATE - INTERVAL '256 days', 'checked_out', 350.00, 175.00, 1575.00, 141.75, 1433.25, 'Yellowstone photography'),
  (v_prop4_id, v_guest2_id, 'direct', CURRENT_DATE - INTERVAL '220 days', CURRENT_DATE - INTERVAL '214 days', 'checked_out', 350.00, 175.00, 2275.00, 0.00, 2275.00, 'Multi-generational trip'),
  (v_prop4_id, v_guest8_id, 'airbnb', CURRENT_DATE - INTERVAL '170 days', CURRENT_DATE - INTERVAL '164 days', 'checked_out', 350.00, 175.00, 2275.00, 227.50, 2047.50, 'Yoga retreat group'),
  (v_prop4_id, v_guest6_id, 'vrbo', CURRENT_DATE - INTERVAL '110 days', CURRENT_DATE - INTERVAL '104 days', 'checked_out', 350.00, 175.00, 2275.00, 204.75, 2070.25, 'Return visit - kids loved horses'),
  (v_prop4_id, v_guest9_id, 'direct', CURRENT_DATE - INTERVAL '50 days', CURRENT_DATE - INTERVAL '46 days', 'checked_out', 350.00, 175.00, 1575.00, 0.00, 1575.00, 'Local guest - Yellowstone trip'),
  (v_prop4_id, v_guest4_id, 'airbnb', CURRENT_DATE - INTERVAL '10 days', CURRENT_DATE - INTERVAL '6 days', 'checked_out', 375.00, 175.00, 1675.00, 167.50, 1507.50, 'Fall photography'),
  (v_prop4_id, v_guest2_id, 'vrbo', CURRENT_DATE + INTERVAL '60 days', CURRENT_DATE + INTERVAL '67 days', 'confirmed', 350.00, 175.00, 2625.00, 236.25, 2388.75, 'Holiday family gathering');

  -- Lakefront Hideaway bookings
  INSERT INTO bookings (property_id, guest_id, source, check_in, check_out, status, nightly_rate, cleaning_fee, total_amount, platform_fee, payout_amount, notes) VALUES
  (v_prop5_id, v_guest6_id, 'airbnb', CURRENT_DATE - INTERVAL '290 days', CURRENT_DATE - INTERVAL '285 days', 'checked_out', 350.00, 150.00, 1900.00, 190.00, 1710.00, 'Summer lake vacation'),
  (v_prop5_id, v_guest5_id, 'direct', CURRENT_DATE - INTERVAL '230 days', CURRENT_DATE - INTERVAL '225 days', 'checked_out', 375.00, 150.00, 2025.00, 0.00, 2025.00, 'Romantic getaway'),
  (v_prop5_id, v_guest1_id, 'vrbo', CURRENT_DATE - INTERVAL '190 days', CURRENT_DATE - INTERVAL '184 days', 'checked_out', 375.00, 150.00, 2400.00, 216.00, 2184.00, 'Fishing and kayaking'),
  (v_prop5_id, v_guest8_id, 'airbnb', CURRENT_DATE - INTERVAL '140 days', CURRENT_DATE - INTERVAL '135 days', 'checked_out', 375.00, 150.00, 2025.00, 202.50, 1822.50, 'Lakeside meditation retreat'),
  (v_prop5_id, v_guest6_id, 'direct', CURRENT_DATE - INTERVAL '80 days', CURRENT_DATE - INTERVAL '73 days', 'checked_out', 375.00, 150.00, 2775.00, 0.00, 2775.00, 'End of summer trip'),
  (v_prop5_id, v_guest9_id, 'vrbo', CURRENT_DATE - INTERVAL '30 days', CURRENT_DATE - INTERVAL '27 days', 'checked_out', 350.00, 150.00, 1200.00, 108.00, 1092.00, 'Quick local getaway'),
  (v_prop5_id, v_guest1_id, 'airbnb', CURRENT_DATE + INTERVAL '90 days', CURRENT_DATE + INTERVAL '97 days', 'confirmed', 325.00, 150.00, 2425.00, 242.50, 2182.50, 'Ice fishing trip');

  -- =====================
  -- MAINTENANCE TASKS
  -- =====================
  INSERT INTO maintenance_tasks (property_id, type, title, scheduled_date, completed_date, vendor_id, cost, notes, recurring) VALUES
  -- Mountain View Lodge
  (v_prop1_id, 'cleaning', 'Post-checkout deep clean', CURRENT_DATE - INTERVAL '335 days', CURRENT_DATE - INTERVAL '335 days', v_vendor1_id, 250.00, 'Standard turnover', false),
  (v_prop1_id, 'pool', 'Hot tub maintenance', CURRENT_DATE - INTERVAL '300 days', CURRENT_DATE - INTERVAL '300 days', v_vendor3_id, 150.00, 'Filter replacement', false),
  (v_prop1_id, 'repair', 'Deck board replacement', CURRENT_DATE - INTERVAL '200 days', CURRENT_DATE - INTERVAL '198 days', NULL, 450.00, 'Replaced 6 worn boards', false),
  (v_prop1_id, 'landscaping', 'Snow removal', CURRENT_DATE - INTERVAL '100 days', CURRENT_DATE - INTERVAL '100 days', v_vendor2_id, 200.00, 'Heavy snowfall', false),
  (v_prop1_id, 'cleaning', 'Spring deep clean', CURRENT_DATE - INTERVAL '45 days', CURRENT_DATE - INTERVAL '45 days', v_vendor1_id, 350.00, 'Seasonal deep clean', false),

  -- Riverside Cabin
  (v_prop2_id, 'cleaning', 'Standard turnover', CURRENT_DATE - INTERVAL '315 days', CURRENT_DATE - INTERVAL '315 days', v_vendor1_id, 150.00, NULL, false),
  (v_prop2_id, 'repair', 'Dock repair', CURRENT_DATE - INTERVAL '250 days', CURRENT_DATE - INTERVAL '248 days', NULL, 800.00, 'Storm damage repair', false),
  (v_prop2_id, 'landscaping', 'Trail clearing', CURRENT_DATE - INTERVAL '180 days', CURRENT_DATE - INTERVAL '180 days', v_vendor2_id, 300.00, 'Cleared fallen trees', false),

  -- Big Sky Retreat
  (v_prop3_id, 'cleaning', 'Post-ski season deep clean', CURRENT_DATE - INTERVAL '323 days', CURRENT_DATE - INTERVAL '323 days', v_vendor1_id, 400.00, 'Full house cleaning', false),
  (v_prop3_id, 'pool', 'Hot tub winterization', CURRENT_DATE - INTERVAL '270 days', CURRENT_DATE - INTERVAL '270 days', v_vendor3_id, 200.00, NULL, false),
  (v_prop3_id, 'repair', 'Boot warmer replacement', CURRENT_DATE - INTERVAL '150 days', CURRENT_DATE - INTERVAL '149 days', NULL, 350.00, 'Replaced 4 warmers', false),
  (v_prop3_id, 'landscaping', 'Snow removal - heavy', CURRENT_DATE - INTERVAL '95 days', CURRENT_DATE - INTERVAL '95 days', v_vendor2_id, 400.00, '3 feet of snow', false),

  -- Paradise Valley Ranch
  (v_prop4_id, 'landscaping', 'Pasture maintenance', CURRENT_DATE - INTERVAL '280 days', CURRENT_DATE - INTERVAL '280 days', v_vendor2_id, 500.00, 'Fence repair and mowing', false),
  (v_prop4_id, 'repair', 'Barn door fix', CURRENT_DATE - INTERVAL '200 days', CURRENT_DATE - INTERVAL '199 days', NULL, 275.00, 'Hinge replacement', false),
  (v_prop4_id, 'other', 'Well inspection', CURRENT_DATE - INTERVAL '120 days', CURRENT_DATE - INTERVAL '120 days', NULL, 350.00, 'Annual inspection - passed', false),

  -- Lakefront Hideaway
  (v_prop5_id, 'repair', 'Dock maintenance', CURRENT_DATE - INTERVAL '300 days', CURRENT_DATE - INTERVAL '298 days', NULL, 600.00, 'Pre-season prep', false),
  (v_prop5_id, 'cleaning', 'Standard turnover', CURRENT_DATE - INTERVAL '285 days', CURRENT_DATE - INTERVAL '285 days', v_vendor1_id, 175.00, NULL, false),
  (v_prop5_id, 'other', 'Kayak/paddleboard maintenance', CURRENT_DATE - INTERVAL '200 days', CURRENT_DATE - INTERVAL '200 days', NULL, 150.00, 'Patched kayak, new paddles', false),

  -- Upcoming maintenance
  (v_prop1_id, 'pool', 'Hot tub service', CURRENT_DATE + INTERVAL '10 days', NULL, v_vendor3_id, NULL, 'Quarterly maintenance', false),
  (v_prop3_id, 'cleaning', 'Pre-ski season prep', CURRENT_DATE + INTERVAL '20 days', NULL, v_vendor1_id, NULL, 'Deep clean before peak season', false);

  -- =====================
  -- EXPENSES
  -- =====================
  INSERT INTO expenses (property_id, category, amount, description, date, vendor_id) VALUES
  -- Utilities
  (v_prop1_id, 'utilities', 450.00, 'Electric - January', CURRENT_DATE - INTERVAL '330 days', NULL),
  (v_prop1_id, 'utilities', 380.00, 'Electric - February', CURRENT_DATE - INTERVAL '300 days', NULL),
  (v_prop1_id, 'utilities', 320.00, 'Electric - March', CURRENT_DATE - INTERVAL '270 days', NULL),
  (v_prop1_id, 'utilities', 280.00, 'Electric - April', CURRENT_DATE - INTERVAL '240 days', NULL),
  (v_prop1_id, 'utilities', 220.00, 'Electric - May', CURRENT_DATE - INTERVAL '210 days', NULL),
  (v_prop1_id, 'utilities', 180.00, 'Electric - June', CURRENT_DATE - INTERVAL '180 days', NULL),
  (v_prop1_id, 'utilities', 150.00, 'Electric - July', CURRENT_DATE - INTERVAL '150 days', NULL),
  (v_prop1_id, 'utilities', 160.00, 'Electric - August', CURRENT_DATE - INTERVAL '120 days', NULL),
  (v_prop1_id, 'utilities', 200.00, 'Electric - September', CURRENT_DATE - INTERVAL '90 days', NULL),
  (v_prop1_id, 'utilities', 280.00, 'Electric - October', CURRENT_DATE - INTERVAL '60 days', NULL),
  (v_prop1_id, 'utilities', 380.00, 'Electric - November', CURRENT_DATE - INTERVAL '30 days', NULL),

  -- Supplies
  (v_prop1_id, 'supplies', 250.00, 'Linens and towels', CURRENT_DATE - INTERVAL '200 days', NULL),
  (v_prop2_id, 'supplies', 180.00, 'Fishing gear replacement', CURRENT_DATE - INTERVAL '180 days', NULL),
  (v_prop3_id, 'supplies', 500.00, 'New ski boot warmers', CURRENT_DATE - INTERVAL '150 days', NULL),
  (v_prop4_id, 'supplies', 300.00, 'Horse feed and supplies', CURRENT_DATE - INTERVAL '120 days', NULL),
  (v_prop5_id, 'supplies', 400.00, 'New paddleboards', CURRENT_DATE - INTERVAL '200 days', NULL),

  -- Insurance
  (v_prop1_id, 'other', 2400.00, 'Annual property insurance', CURRENT_DATE - INTERVAL '365 days', NULL),
  (v_prop2_id, 'other', 1800.00, 'Annual property insurance', CURRENT_DATE - INTERVAL '365 days', NULL),
  (v_prop3_id, 'other', 3600.00, 'Annual property insurance', CURRENT_DATE - INTERVAL '365 days', NULL),
  (v_prop4_id, 'other', 2200.00, 'Annual property insurance', CURRENT_DATE - INTERVAL '365 days', NULL),
  (v_prop5_id, 'other', 2000.00, 'Annual property insurance', CURRENT_DATE - INTERVAL '365 days', NULL),

  -- Property taxes (quarterly)
  (v_prop1_id, 'other', 1500.00, 'Property tax Q1', CURRENT_DATE - INTERVAL '300 days', NULL),
  (v_prop1_id, 'other', 1500.00, 'Property tax Q2', CURRENT_DATE - INTERVAL '210 days', NULL),
  (v_prop1_id, 'other', 1500.00, 'Property tax Q3', CURRENT_DATE - INTERVAL '120 days', NULL),
  (v_prop1_id, 'other', 1500.00, 'Property tax Q4', CURRENT_DATE - INTERVAL '30 days', NULL);

  -- =====================
  -- INQUIRIES (some recent ones)
  -- =====================
  INSERT INTO inquiries (property_id, name, email, phone, check_in, check_out, guests, message, status, created_at) VALUES
  (v_prop1_id, 'Tom Bradley', 'tom.bradley@email.com', '(555) 123-4567', CURRENT_DATE + INTERVAL '60 days', CURRENT_DATE + INTERVAL '67 days', 8, 'Hi, we''re interested in booking your lodge for a family reunion. Is it available for the dates listed? We have 8 adults.', 'new', CURRENT_DATE - INTERVAL '2 days'),
  (v_prop3_id, 'Jennifer Adams', 'jadams@company.com', '(555) 234-5678', CURRENT_DATE + INTERVAL '75 days', CURRENT_DATE + INTERVAL '78 days', 10, 'Looking for a corporate retreat venue. Do you offer any discounts for 3+ night stays? We need space for 10 people with good WiFi.', 'contacted', CURRENT_DATE - INTERVAL '5 days'),
  (v_prop5_id, 'Mike Chen', 'mchen@email.com', NULL, CURRENT_DATE + INTERVAL '120 days', CURRENT_DATE + INTERVAL '125 days', 4, 'Is the lake good for fishing in spring? We''re a group of 4 looking for a fishing getaway.', 'new', CURRENT_DATE - INTERVAL '1 day'),
  (v_prop2_id, 'Sandra White', 'swhite@email.com', '(555) 345-6789', CURRENT_DATE + INTERVAL '45 days', CURRENT_DATE + INTERVAL '48 days', 2, 'My husband and I are celebrating our 25th anniversary. Is the cabin romantic? Any special touches you can arrange?', 'converted', CURRENT_DATE - INTERVAL '10 days');

  RAISE NOTICE 'Test data seeded successfully!';
  RAISE NOTICE 'Created: 5 properties, 10 guests, 3 vendors, ~40 bookings, maintenance tasks, expenses, and inquiries';
END $$;
