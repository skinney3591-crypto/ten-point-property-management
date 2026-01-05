-- Ten Point Property Management - Test Data Seed
-- Run this in Supabase SQL Editor after logging in once
-- Creates comprehensive test data for the past 3 months and upcoming 2 months

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
  v_guest11_id UUID := gen_random_uuid();
  v_guest12_id UUID := gen_random_uuid();
  v_guest13_id UUID := gen_random_uuid();
  v_guest14_id UUID := gen_random_uuid();
  v_guest15_id UUID := gen_random_uuid();
  v_vendor1_id UUID := gen_random_uuid();
  v_vendor2_id UUID := gen_random_uuid();
  v_vendor3_id UUID := gen_random_uuid();
  v_vendor4_id UUID := gen_random_uuid();
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
  -- VENDORS (External contractors only - Ten Point handles cleaning internally)
  -- =====================
  INSERT INTO vendors (id, user_id, name, service_type, email, phone, notes) VALUES
  (v_vendor1_id, v_user_id, 'Big Sky Landscaping', 'landscaping', 'bigsky@landscape.com', '(406) 555-0202', 'Weekly lawn care in summer, snow removal in winter. $200/month base.'),
  (v_vendor2_id, v_user_id, 'Hot Tub Pros Montana', 'pool', 'service@hottubpros.com', '(406) 555-0303', 'Hot tub maintenance and repair. $75 per service call.'),
  (v_vendor3_id, v_user_id, 'Whitefish Plumbing & Electric', 'repair', 'info@whitefishpe.com', '(406) 555-0404', 'Licensed plumber and electrician. Emergency service available.'),
  (v_vendor4_id, v_user_id, 'Montana Pest Control', 'other', 'bugs@mtpest.com', '(406) 555-0505', 'Quarterly pest prevention. $125 per property per visit.');

  -- =====================
  -- GUESTS (15 guests for more variety)
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
  (v_guest10_id, v_user_id, 'garcia.reunion@email.com', 'Maria Garcia', '(505) 555-0123', 'Annual family reunion organizer. 15-20 people.', '{"reunion": true, "large_group": true}'::jsonb),
  (v_guest11_id, v_user_id, 'alex.turner@email.com', 'Alex Turner', '(425) 555-1122', 'Remote worker, needs reliable WiFi. Extended stays.', '{"remote_work": true, "long_stay": true}'::jsonb),
  (v_guest12_id, v_user_id, 'nancy.drew@email.com', 'Nancy Drew', '(303) 555-2233', 'Mystery writer. Loves secluded properties for writing retreats.', '{"quiet": true, "workspace": "important"}'::jsonb),
  (v_guest13_id, v_user_id, 'bill.harris@email.com', 'Bill Harris', '(480) 555-3344', 'Retired couple. Birdwatching enthusiasts.', '{"birdwatching": true, "early_morning": true}'::jsonb),
  (v_guest14_id, v_user_id, 'kate.murphy@email.com', 'Kate Murphy', '(971) 555-4455', 'Young professional group. Weekend getaways.', '{"group": true, "nightlife": false}'::jsonb),
  (v_guest15_id, v_user_id, 'chris.baker@email.com', 'Chris Baker', '(385) 555-5566', 'Snowmobiling group. Winter bookings mostly.', '{"winter_sports": true, "garage": "needed"}'::jsonb);

  -- =====================
  -- BOOKINGS - Past 3 months and next 2 months (heavy booking activity)
  -- =====================

  -- MOUNTAIN VIEW LODGE - Past bookings
  INSERT INTO bookings (property_id, guest_id, source, check_in, check_out, status, nightly_rate, cleaning_fee, total_amount, platform_fee, payout_amount, notes) VALUES
  (v_prop1_id, v_guest3_id, 'vrbo', CURRENT_DATE - INTERVAL '85 days', CURRENT_DATE - INTERVAL '78 days', 'checked_out', 425.00, 250.00, 3225.00, 290.25, 2934.75, 'Ski group - 10 people, great guests'),
  (v_prop1_id, v_guest10_id, 'airbnb', CURRENT_DATE - INTERVAL '71 days', CURRENT_DATE - INTERVAL '64 days', 'checked_out', 450.00, 250.00, 3400.00, 340.00, 3060.00, 'Family reunion - house was full'),
  (v_prop1_id, v_guest7_id, 'direct', CURRENT_DATE - INTERVAL '57 days', CURRENT_DATE - INTERVAL '54 days', 'checked_out', 475.00, 250.00, 1675.00, 0.00, 1675.00, 'Corporate team building'),
  (v_prop1_id, v_guest1_id, 'airbnb', CURRENT_DATE - INTERVAL '50 days', CURRENT_DATE - INTERVAL '45 days', 'checked_out', 425.00, 250.00, 2375.00, 237.50, 2137.50, 'Repeat guest - fishing trip'),
  (v_prop1_id, v_guest15_id, 'vrbo', CURRENT_DATE - INTERVAL '38 days', CURRENT_DATE - INTERVAL '33 days', 'checked_out', 450.00, 250.00, 2500.00, 225.00, 2275.00, 'Snowmobile group'),
  (v_prop1_id, v_guest4_id, 'direct', CURRENT_DATE - INTERVAL '28 days', CURRENT_DATE - INTERVAL '25 days', 'checked_out', 425.00, 250.00, 1525.00, 0.00, 1525.00, 'Photography workshop'),
  (v_prop1_id, v_guest6_id, 'airbnb', CURRENT_DATE - INTERVAL '21 days', CURRENT_DATE - INTERVAL '14 days', 'checked_out', 425.00, 250.00, 3225.00, 322.50, 2902.50, 'Family with kids - week stay'),
  (v_prop1_id, v_guest11_id, 'vrbo', CURRENT_DATE - INTERVAL '10 days', CURRENT_DATE - INTERVAL '3 days', 'checked_out', 400.00, 250.00, 3050.00, 274.50, 2775.50, 'Remote worker extended stay');

  -- MOUNTAIN VIEW LODGE - Current and upcoming
  INSERT INTO bookings (property_id, guest_id, source, check_in, check_out, status, nightly_rate, cleaning_fee, total_amount, platform_fee, payout_amount, notes) VALUES
  (v_prop1_id, v_guest3_id, 'vrbo', CURRENT_DATE + INTERVAL '5 days', CURRENT_DATE + INTERVAL '12 days', 'confirmed', 475.00, 250.00, 3575.00, 321.75, 3253.25, 'Annual ski trip - returning group'),
  (v_prop1_id, v_guest7_id, 'direct', CURRENT_DATE + INTERVAL '18 days', CURRENT_DATE + INTERVAL '21 days', 'confirmed', 450.00, 250.00, 1600.00, 0.00, 1600.00, 'Corporate retreat'),
  (v_prop1_id, v_guest10_id, 'airbnb', CURRENT_DATE + INTERVAL '35 days', CURRENT_DATE + INTERVAL '42 days', 'confirmed', 425.00, 250.00, 3225.00, 322.50, 2902.50, 'Winter family reunion');

  -- RIVERSIDE CABIN - Past bookings
  INSERT INTO bookings (property_id, guest_id, source, check_in, check_out, status, nightly_rate, cleaning_fee, total_amount, platform_fee, payout_amount, notes) VALUES
  (v_prop2_id, v_guest1_id, 'airbnb', CURRENT_DATE - INTERVAL '82 days', CURRENT_DATE - INTERVAL '77 days', 'checked_out', 275.00, 150.00, 1525.00, 152.50, 1372.50, 'Fly fishing trip'),
  (v_prop2_id, v_guest5_id, 'direct', CURRENT_DATE - INTERVAL '68 days', CURRENT_DATE - INTERVAL '64 days', 'checked_out', 299.00, 150.00, 1346.00, 0.00, 1346.00, 'Romantic getaway'),
  (v_prop2_id, v_guest12_id, 'vrbo', CURRENT_DATE - INTERVAL '55 days', CURRENT_DATE - INTERVAL '48 days', 'checked_out', 275.00, 150.00, 2075.00, 186.75, 1888.25, 'Writing retreat - 7 nights'),
  (v_prop2_id, v_guest9_id, 'direct', CURRENT_DATE - INTERVAL '42 days', CURRENT_DATE - INTERVAL '39 days', 'checked_out', 275.00, 150.00, 975.00, 0.00, 975.00, 'Local booking'),
  (v_prop2_id, v_guest8_id, 'airbnb', CURRENT_DATE - INTERVAL '35 days', CURRENT_DATE - INTERVAL '31 days', 'checked_out', 275.00, 150.00, 1250.00, 125.00, 1125.00, 'Solo retreat'),
  (v_prop2_id, v_guest13_id, 'vrbo', CURRENT_DATE - INTERVAL '24 days', CURRENT_DATE - INTERVAL '19 days', 'checked_out', 275.00, 150.00, 1525.00, 137.25, 1387.75, 'Birdwatching couple'),
  (v_prop2_id, v_guest1_id, 'direct', CURRENT_DATE - INTERVAL '14 days', CURRENT_DATE - INTERVAL '10 days', 'checked_out', 275.00, 150.00, 1250.00, 0.00, 1250.00, 'Return guest - more fishing'),
  (v_prop2_id, v_guest14_id, 'airbnb', CURRENT_DATE - INTERVAL '7 days', CURRENT_DATE - INTERVAL '4 days', 'checked_out', 299.00, 150.00, 1047.00, 104.70, 942.30, 'Weekend getaway');

  -- RIVERSIDE CABIN - Upcoming
  INSERT INTO bookings (property_id, guest_id, source, check_in, check_out, status, nightly_rate, cleaning_fee, total_amount, platform_fee, payout_amount, notes) VALUES
  (v_prop2_id, v_guest5_id, 'vrbo', CURRENT_DATE + INTERVAL '3 days', CURRENT_DATE + INTERVAL '7 days', 'confirmed', 299.00, 150.00, 1346.00, 121.14, 1224.86, 'Anniversary trip'),
  (v_prop2_id, v_guest12_id, 'direct', CURRENT_DATE + INTERVAL '14 days', CURRENT_DATE + INTERVAL '21 days', 'confirmed', 250.00, 150.00, 1900.00, 0.00, 1900.00, 'Extended writing retreat - discounted'),
  (v_prop2_id, v_guest1_id, 'airbnb', CURRENT_DATE + INTERVAL '28 days', CURRENT_DATE + INTERVAL '32 days', 'confirmed', 275.00, 150.00, 1250.00, 125.00, 1125.00, 'Spring fishing');

  -- BIG SKY RETREAT - Past bookings
  INSERT INTO bookings (property_id, guest_id, source, check_in, check_out, status, nightly_rate, cleaning_fee, total_amount, platform_fee, payout_amount, notes) VALUES
  (v_prop3_id, v_guest3_id, 'vrbo', CURRENT_DATE - INTERVAL '88 days', CURRENT_DATE - INTERVAL '81 days', 'checked_out', 895.00, 400.00, 6665.00, 599.85, 6065.15, 'Peak ski week - full house'),
  (v_prop3_id, v_guest7_id, 'direct', CURRENT_DATE - INTERVAL '74 days', CURRENT_DATE - INTERVAL '70 days', 'checked_out', 850.00, 400.00, 3800.00, 0.00, 3800.00, 'Corporate leadership retreat'),
  (v_prop3_id, v_guest15_id, 'airbnb', CURRENT_DATE - INTERVAL '60 days', CURRENT_DATE - INTERVAL '55 days', 'checked_out', 895.00, 400.00, 4875.00, 487.50, 4387.50, 'Snowmobile group'),
  (v_prop3_id, v_guest10_id, 'vrbo', CURRENT_DATE - INTERVAL '45 days', CURRENT_DATE - INTERVAL '38 days', 'checked_out', 895.00, 400.00, 6665.00, 599.85, 6065.15, 'Large family gathering'),
  (v_prop3_id, v_guest3_id, 'direct', CURRENT_DATE - INTERVAL '31 days', CURRENT_DATE - INTERVAL '26 days', 'checked_out', 850.00, 400.00, 4650.00, 0.00, 4650.00, 'Return ski group - mid-week discount'),
  (v_prop3_id, v_guest7_id, 'airbnb', CURRENT_DATE - INTERVAL '17 days', CURRENT_DATE - INTERVAL '14 days', 'checked_out', 895.00, 400.00, 3085.00, 308.50, 2776.50, 'Quick corporate getaway'),
  (v_prop3_id, v_guest14_id, 'vrbo', CURRENT_DATE - INTERVAL '8 days', CURRENT_DATE - INTERVAL '5 days', 'checked_out', 895.00, 400.00, 3085.00, 277.65, 2807.35, 'Friend group ski trip');

  -- BIG SKY RETREAT - Upcoming
  INSERT INTO bookings (property_id, guest_id, source, check_in, check_out, status, nightly_rate, cleaning_fee, total_amount, platform_fee, payout_amount, notes) VALUES
  (v_prop3_id, v_guest3_id, 'vrbo', CURRENT_DATE + INTERVAL '8 days', CURRENT_DATE + INTERVAL '15 days', 'confirmed', 950.00, 400.00, 7050.00, 634.50, 6415.50, 'Peak season booking'),
  (v_prop3_id, v_guest15_id, 'airbnb', CURRENT_DATE + INTERVAL '22 days', CURRENT_DATE + INTERVAL '26 days', 'confirmed', 895.00, 400.00, 3980.00, 398.00, 3582.00, 'Snowmobile weekend'),
  (v_prop3_id, v_guest7_id, 'direct', CURRENT_DATE + INTERVAL '40 days', CURRENT_DATE + INTERVAL '43 days', 'confirmed', 850.00, 400.00, 2950.00, 0.00, 2950.00, 'Spring corporate event');

  -- PARADISE VALLEY RANCH - Past bookings
  INSERT INTO bookings (property_id, guest_id, source, check_in, check_out, status, nightly_rate, cleaning_fee, total_amount, platform_fee, payout_amount, notes) VALUES
  (v_prop4_id, v_guest6_id, 'airbnb', CURRENT_DATE - INTERVAL '80 days', CURRENT_DATE - INTERVAL '74 days', 'checked_out', 350.00, 200.00, 2300.00, 230.00, 2070.00, 'Family adventure - kids loved horses'),
  (v_prop4_id, v_guest4_id, 'vrbo', CURRENT_DATE - INTERVAL '65 days', CURRENT_DATE - INTERVAL '61 days', 'checked_out', 350.00, 200.00, 1600.00, 144.00, 1456.00, 'Winter photography'),
  (v_prop4_id, v_guest8_id, 'direct', CURRENT_DATE - INTERVAL '52 days', CURRENT_DATE - INTERVAL '46 days', 'checked_out', 325.00, 200.00, 2150.00, 0.00, 2150.00, 'Yoga retreat group'),
  (v_prop4_id, v_guest2_id, 'airbnb', CURRENT_DATE - INTERVAL '40 days', CURRENT_DATE - INTERVAL '35 days', 'checked_out', 350.00, 200.00, 1950.00, 195.00, 1755.00, 'Multi-generational trip'),
  (v_prop4_id, v_guest13_id, 'vrbo', CURRENT_DATE - INTERVAL '30 days', CURRENT_DATE - INTERVAL '26 days', 'checked_out', 350.00, 200.00, 1600.00, 144.00, 1456.00, 'Birdwatching near Yellowstone'),
  (v_prop4_id, v_guest9_id, 'direct', CURRENT_DATE - INTERVAL '20 days', CURRENT_DATE - INTERVAL '17 days', 'checked_out', 350.00, 200.00, 1250.00, 0.00, 1250.00, 'Local - family visiting'),
  (v_prop4_id, v_guest6_id, 'airbnb', CURRENT_DATE - INTERVAL '12 days', CURRENT_DATE - INTERVAL '7 days', 'checked_out', 375.00, 200.00, 2075.00, 207.50, 1867.50, 'Return family visit'),
  (v_prop4_id, v_guest4_id, 'direct', CURRENT_DATE - INTERVAL '4 days', CURRENT_DATE - INTERVAL '1 day', 'checked_out', 350.00, 200.00, 1250.00, 0.00, 1250.00, 'Quick photo trip');

  -- PARADISE VALLEY RANCH - Upcoming
  INSERT INTO bookings (property_id, guest_id, source, check_in, check_out, status, nightly_rate, cleaning_fee, total_amount, platform_fee, payout_amount, notes) VALUES
  (v_prop4_id, v_guest8_id, 'vrbo', CURRENT_DATE + INTERVAL '2 days', CURRENT_DATE + INTERVAL '6 days', 'confirmed', 350.00, 200.00, 1600.00, 144.00, 1456.00, 'Wellness retreat'),
  (v_prop4_id, v_guest2_id, 'airbnb', CURRENT_DATE + INTERVAL '12 days', CURRENT_DATE + INTERVAL '17 days', 'confirmed', 350.00, 200.00, 1950.00, 195.00, 1755.00, 'Family trip'),
  (v_prop4_id, v_guest6_id, 'direct', CURRENT_DATE + INTERVAL '25 days', CURRENT_DATE + INTERVAL '30 days', 'confirmed', 350.00, 200.00, 1950.00, 0.00, 1950.00, 'Spring break family trip');

  -- LAKEFRONT HIDEAWAY - Past bookings
  INSERT INTO bookings (property_id, guest_id, source, check_in, check_out, status, nightly_rate, cleaning_fee, total_amount, platform_fee, payout_amount, notes) VALUES
  (v_prop5_id, v_guest6_id, 'airbnb', CURRENT_DATE - INTERVAL '78 days', CURRENT_DATE - INTERVAL '72 days', 'checked_out', 350.00, 175.00, 2275.00, 227.50, 2047.50, 'Winter lake getaway'),
  (v_prop5_id, v_guest11_id, 'vrbo', CURRENT_DATE - INTERVAL '62 days', CURRENT_DATE - INTERVAL '52 days', 'checked_out', 325.00, 175.00, 3425.00, 308.25, 3116.75, 'Remote work - 10 night stay'),
  (v_prop5_id, v_guest5_id, 'direct', CURRENT_DATE - INTERVAL '48 days', CURRENT_DATE - INTERVAL '44 days', 'checked_out', 375.00, 175.00, 1675.00, 0.00, 1675.00, 'Romantic escape'),
  (v_prop5_id, v_guest13_id, 'airbnb', CURRENT_DATE - INTERVAL '38 days', CURRENT_DATE - INTERVAL '33 days', 'checked_out', 350.00, 175.00, 1925.00, 192.50, 1732.50, 'Birdwatching on the lake'),
  (v_prop5_id, v_guest1_id, 'vrbo', CURRENT_DATE - INTERVAL '27 days', CURRENT_DATE - INTERVAL '22 days', 'checked_out', 375.00, 175.00, 2050.00, 184.50, 1865.50, 'Ice fishing attempt'),
  (v_prop5_id, v_guest14_id, 'airbnb', CURRENT_DATE - INTERVAL '18 days', CURRENT_DATE - INTERVAL '15 days', 'checked_out', 375.00, 175.00, 1300.00, 130.00, 1170.00, 'Weekend getaway'),
  (v_prop5_id, v_guest9_id, 'direct', CURRENT_DATE - INTERVAL '10 days', CURRENT_DATE - INTERVAL '7 days', 'checked_out', 350.00, 175.00, 1225.00, 0.00, 1225.00, 'Local family visit'),
  (v_prop5_id, v_guest12_id, 'vrbo', CURRENT_DATE - INTERVAL '5 days', CURRENT_DATE - INTERVAL '2 days', 'checked_out', 375.00, 175.00, 1300.00, 117.00, 1183.00, 'Writing inspiration');

  -- LAKEFRONT HIDEAWAY - Upcoming
  INSERT INTO bookings (property_id, guest_id, source, check_in, check_out, status, nightly_rate, cleaning_fee, total_amount, platform_fee, payout_amount, notes) VALUES
  (v_prop5_id, v_guest11_id, 'direct', CURRENT_DATE + INTERVAL '1 day', CURRENT_DATE + INTERVAL '8 days', 'confirmed', 325.00, 175.00, 2450.00, 0.00, 2450.00, 'Remote work week'),
  (v_prop5_id, v_guest5_id, 'airbnb', CURRENT_DATE + INTERVAL '15 days', CURRENT_DATE + INTERVAL '19 days', 'confirmed', 375.00, 175.00, 1675.00, 167.50, 1507.50, 'Valentine''s getaway'),
  (v_prop5_id, v_guest6_id, 'vrbo', CURRENT_DATE + INTERVAL '30 days', CURRENT_DATE + INTERVAL '37 days', 'confirmed', 375.00, 175.00, 2800.00, 252.00, 2548.00, 'Spring break family week');

  -- =====================
  -- MAINTENANCE TASKS - Comprehensive list
  -- =====================

  -- Past completed maintenance (columns: property_id, type, title, scheduled_date, completed_date, vendor_id, cost, notes)
  INSERT INTO maintenance_tasks (property_id, type, title, scheduled_date, completed_date, vendor_id, cost, notes) VALUES
  -- Mountain View Lodge
  (v_prop1_id, 'cleaning', 'Post-checkout turnover - ski group', CURRENT_DATE - INTERVAL '78 days', CURRENT_DATE - INTERVAL '78 days', NULL, 0.00, 'Ten Point staff - 4 hours'),
  (v_prop1_id, 'pool', 'Hot tub filter replacement', CURRENT_DATE - INTERVAL '75 days', CURRENT_DATE - INTERVAL '75 days', v_vendor2_id, 185.00, 'Filter + labor'),
  (v_prop1_id, 'cleaning', 'Post-checkout turnover - deep clean', CURRENT_DATE - INTERVAL '64 days', CURRENT_DATE - INTERVAL '64 days', NULL, 0.00, 'Ten Point staff - 6 hours (extra dirty)'),
  (v_prop1_id, 'repair', 'Dishwasher repair', CURRENT_DATE - INTERVAL '60 days', CURRENT_DATE - INTERVAL '59 days', v_vendor3_id, 275.00, 'Pump replacement - not draining'),
  (v_prop1_id, 'cleaning', 'Post-checkout turnover', CURRENT_DATE - INTERVAL '54 days', CURRENT_DATE - INTERVAL '54 days', NULL, 0.00, 'Ten Point staff - 4 hours'),
  (v_prop1_id, 'landscaping', 'Snow removal - heavy storm', CURRENT_DATE - INTERVAL '50 days', CURRENT_DATE - INTERVAL '50 days', v_vendor1_id, 350.00, '2 feet of snow - driveway and walkways'),
  (v_prop1_id, 'cleaning', 'Post-checkout turnover', CURRENT_DATE - INTERVAL '45 days', CURRENT_DATE - INTERVAL '45 days', NULL, 0.00, 'Ten Point staff - 4 hours'),
  (v_prop1_id, 'cleaning', 'Post-checkout turnover', CURRENT_DATE - INTERVAL '33 days', CURRENT_DATE - INTERVAL '33 days', NULL, 0.00, 'Ten Point staff - 4 hours'),
  (v_prop1_id, 'repair', 'Garage door adjustment', CURRENT_DATE - INTERVAL '30 days', CURRENT_DATE - INTERVAL '30 days', v_vendor3_id, 125.00, 'Sensor realignment - not closing'),
  (v_prop1_id, 'cleaning', 'Post-checkout turnover', CURRENT_DATE - INTERVAL '25 days', CURRENT_DATE - INTERVAL '25 days', NULL, 0.00, 'Ten Point staff - 4 hours'),
  (v_prop1_id, 'cleaning', 'Post-checkout turnover - family deep clean', CURRENT_DATE - INTERVAL '14 days', CURRENT_DATE - INTERVAL '14 days', NULL, 0.00, 'Ten Point staff - 5 hours'),
  (v_prop1_id, 'pool', 'Hot tub service', CURRENT_DATE - INTERVAL '10 days', CURRENT_DATE - INTERVAL '10 days', v_vendor2_id, 95.00, 'Water chemistry check - balanced'),
  (v_prop1_id, 'cleaning', 'Post-checkout turnover', CURRENT_DATE - INTERVAL '3 days', CURRENT_DATE - INTERVAL '3 days', NULL, 0.00, 'Ten Point staff - 4 hours'),

  -- Riverside Cabin
  (v_prop2_id, 'cleaning', 'Post-checkout turnover', CURRENT_DATE - INTERVAL '77 days', CURRENT_DATE - INTERVAL '77 days', NULL, 0.00, 'Ten Point staff - 2.5 hours'),
  (v_prop2_id, 'cleaning', 'Post-checkout turnover', CURRENT_DATE - INTERVAL '64 days', CURRENT_DATE - INTERVAL '64 days', NULL, 0.00, 'Ten Point staff - 2.5 hours'),
  (v_prop2_id, 'repair', 'Kayak repairs', CURRENT_DATE - INTERVAL '55 days', CURRENT_DATE - INTERVAL '54 days', NULL, 45.00, 'DIY repair kit - patch small holes'),
  (v_prop2_id, 'cleaning', 'Post-checkout turnover - long stay', CURRENT_DATE - INTERVAL '48 days', CURRENT_DATE - INTERVAL '48 days', NULL, 0.00, 'Ten Point staff - 3 hours'),
  (v_prop2_id, 'cleaning', 'Post-checkout turnover', CURRENT_DATE - INTERVAL '39 days', CURRENT_DATE - INTERVAL '39 days', NULL, 0.00, 'Ten Point staff - 2.5 hours'),
  (v_prop2_id, 'landscaping', 'Trail clearing', CURRENT_DATE - INTERVAL '35 days', CURRENT_DATE - INTERVAL '35 days', v_vendor1_id, 150.00, 'Chainsaw work - fallen branch'),
  (v_prop2_id, 'cleaning', 'Post-checkout turnover', CURRENT_DATE - INTERVAL '31 days', CURRENT_DATE - INTERVAL '31 days', NULL, 0.00, 'Ten Point staff - 2.5 hours'),
  (v_prop2_id, 'cleaning', 'Post-checkout turnover', CURRENT_DATE - INTERVAL '19 days', CURRENT_DATE - INTERVAL '19 days', NULL, 0.00, 'Ten Point staff - 2.5 hours'),
  (v_prop2_id, 'cleaning', 'Post-checkout turnover', CURRENT_DATE - INTERVAL '10 days', CURRENT_DATE - INTERVAL '10 days', NULL, 0.00, 'Ten Point staff - 2.5 hours'),
  (v_prop2_id, 'cleaning', 'Post-checkout turnover', CURRENT_DATE - INTERVAL '4 days', CURRENT_DATE - INTERVAL '4 days', NULL, 0.00, 'Ten Point staff - 2.5 hours'),

  -- Big Sky Retreat
  (v_prop3_id, 'cleaning', 'Post-checkout turnover - full house', CURRENT_DATE - INTERVAL '81 days', CURRENT_DATE - INTERVAL '81 days', NULL, 0.00, 'Ten Point staff - 8 hours (2 people)'),
  (v_prop3_id, 'pool', 'Hot tub deep clean', CURRENT_DATE - INTERVAL '78 days', CURRENT_DATE - INTERVAL '78 days', v_vendor2_id, 225.00, 'Drain, clean, refill - post heavy use'),
  (v_prop3_id, 'cleaning', 'Post-checkout turnover - corporate', CURRENT_DATE - INTERVAL '70 days', CURRENT_DATE - INTERVAL '70 days', NULL, 0.00, 'Ten Point staff - 6 hours'),
  (v_prop3_id, 'repair', 'Boot warmer replacement', CURRENT_DATE - INTERVAL '65 days', CURRENT_DATE - INTERVAL '64 days', NULL, 380.00, 'Parts ordered online - 2 units failed'),
  (v_prop3_id, 'cleaning', 'Post-checkout turnover', CURRENT_DATE - INTERVAL '55 days', CURRENT_DATE - INTERVAL '55 days', NULL, 0.00, 'Ten Point staff - 6 hours'),
  (v_prop3_id, 'landscaping', 'Snow removal', CURRENT_DATE - INTERVAL '48 days', CURRENT_DATE - INTERVAL '48 days', v_vendor1_id, 450.00, 'Roof rake + driveway - heavy accumulation'),
  (v_prop3_id, 'cleaning', 'Post-checkout turnover - large group', CURRENT_DATE - INTERVAL '38 days', CURRENT_DATE - INTERVAL '38 days', NULL, 0.00, 'Ten Point staff - 8 hours'),
  (v_prop3_id, 'cleaning', 'Post-checkout turnover', CURRENT_DATE - INTERVAL '26 days', CURRENT_DATE - INTERVAL '26 days', NULL, 0.00, 'Ten Point staff - 6 hours'),
  (v_prop3_id, 'pool', 'Hot tub chemical balance', CURRENT_DATE - INTERVAL '20 days', CURRENT_DATE - INTERVAL '20 days', v_vendor2_id, 75.00, 'Routine weekly service'),
  (v_prop3_id, 'cleaning', 'Post-checkout turnover - quick turn', CURRENT_DATE - INTERVAL '14 days', CURRENT_DATE - INTERVAL '14 days', NULL, 0.00, 'Ten Point staff - 6 hours'),
  (v_prop3_id, 'cleaning', 'Post-checkout turnover', CURRENT_DATE - INTERVAL '5 days', CURRENT_DATE - INTERVAL '5 days', NULL, 0.00, 'Ten Point staff - 6 hours'),

  -- Paradise Valley Ranch
  (v_prop4_id, 'cleaning', 'Post-checkout turnover - family', CURRENT_DATE - INTERVAL '74 days', CURRENT_DATE - INTERVAL '74 days', NULL, 0.00, 'Ten Point staff - 4 hours'),
  (v_prop4_id, 'cleaning', 'Post-checkout turnover', CURRENT_DATE - INTERVAL '61 days', CURRENT_DATE - INTERVAL '61 days', NULL, 0.00, 'Ten Point staff - 4 hours'),
  (v_prop4_id, 'landscaping', 'Fence repair', CURRENT_DATE - INTERVAL '58 days', CURRENT_DATE - INTERVAL '57 days', v_vendor1_id, 425.00, 'Replace 20ft section - wind damage'),
  (v_prop4_id, 'cleaning', 'Post-checkout turnover - yoga group', CURRENT_DATE - INTERVAL '46 days', CURRENT_DATE - INTERVAL '46 days', NULL, 0.00, 'Ten Point staff - 4 hours'),
  (v_prop4_id, 'other', 'Horse area cleanup', CURRENT_DATE - INTERVAL '42 days', CURRENT_DATE - INTERVAL '42 days', NULL, 0.00, 'Ten Point staff - 2 hours - pre-guest prep'),
  (v_prop4_id, 'cleaning', 'Post-checkout turnover - multi-gen', CURRENT_DATE - INTERVAL '35 days', CURRENT_DATE - INTERVAL '35 days', NULL, 0.00, 'Ten Point staff - 4 hours'),
  (v_prop4_id, 'cleaning', 'Post-checkout turnover', CURRENT_DATE - INTERVAL '26 days', CURRENT_DATE - INTERVAL '26 days', NULL, 0.00, 'Ten Point staff - 3.5 hours'),
  (v_prop4_id, 'cleaning', 'Post-checkout turnover', CURRENT_DATE - INTERVAL '17 days', CURRENT_DATE - INTERVAL '17 days', NULL, 0.00, 'Ten Point staff - 3.5 hours'),
  (v_prop4_id, 'other', 'Pest inspection', CURRENT_DATE - INTERVAL '15 days', CURRENT_DATE - INTERVAL '15 days', v_vendor4_id, 125.00, 'Quarterly prevention - all clear'),
  (v_prop4_id, 'cleaning', 'Post-checkout turnover - return family', CURRENT_DATE - INTERVAL '7 days', CURRENT_DATE - INTERVAL '7 days', NULL, 0.00, 'Ten Point staff - 4 hours'),
  (v_prop4_id, 'cleaning', 'Post-checkout turnover - quick stay', CURRENT_DATE - INTERVAL '1 day', CURRENT_DATE - INTERVAL '1 day', NULL, 0.00, 'Ten Point staff - 3 hours'),

  -- Lakefront Hideaway
  (v_prop5_id, 'cleaning', 'Post-checkout turnover - winter', CURRENT_DATE - INTERVAL '72 days', CURRENT_DATE - INTERVAL '72 days', NULL, 0.00, 'Ten Point staff - 3.5 hours'),
  (v_prop5_id, 'repair', 'Dock inspection', CURRENT_DATE - INTERVAL '68 days', CURRENT_DATE - INTERVAL '68 days', NULL, 0.00, 'Pre-season check - minor repairs needed'),
  (v_prop5_id, 'cleaning', 'Post-checkout turnover - long stay', CURRENT_DATE - INTERVAL '52 days', CURRENT_DATE - INTERVAL '52 days', NULL, 0.00, 'Ten Point staff - 4 hours'),
  (v_prop5_id, 'cleaning', 'Post-checkout turnover', CURRENT_DATE - INTERVAL '44 days', CURRENT_DATE - INTERVAL '44 days', NULL, 0.00, 'Ten Point staff - 3.5 hours'),
  (v_prop5_id, 'repair', 'Dock board replacement', CURRENT_DATE - INTERVAL '40 days', CURRENT_DATE - INTERVAL '39 days', v_vendor3_id, 350.00, 'Replaced 4 rotted boards'),
  (v_prop5_id, 'cleaning', 'Post-checkout turnover - birdwatcher', CURRENT_DATE - INTERVAL '33 days', CURRENT_DATE - INTERVAL '33 days', NULL, 0.00, 'Ten Point staff - 3.5 hours'),
  (v_prop5_id, 'cleaning', 'Post-checkout turnover', CURRENT_DATE - INTERVAL '22 days', CURRENT_DATE - INTERVAL '22 days', NULL, 0.00, 'Ten Point staff - 3.5 hours'),
  (v_prop5_id, 'other', 'Pest inspection', CURRENT_DATE - INTERVAL '18 days', CURRENT_DATE - INTERVAL '18 days', v_vendor4_id, 125.00, 'Quarterly prevention - all clear'),
  (v_prop5_id, 'cleaning', 'Post-checkout turnover - weekend', CURRENT_DATE - INTERVAL '15 days', CURRENT_DATE - INTERVAL '15 days', NULL, 0.00, 'Ten Point staff - 3 hours'),
  (v_prop5_id, 'cleaning', 'Post-checkout turnover', CURRENT_DATE - INTERVAL '7 days', CURRENT_DATE - INTERVAL '7 days', NULL, 0.00, 'Ten Point staff - 3.5 hours'),
  (v_prop5_id, 'cleaning', 'Post-checkout turnover - writer', CURRENT_DATE - INTERVAL '2 days', CURRENT_DATE - INTERVAL '2 days', NULL, 0.00, 'Ten Point staff - 3 hours');

  -- Upcoming/pending maintenance
  INSERT INTO maintenance_tasks (property_id, type, title, scheduled_date, vendor_id, notes) VALUES
  (v_prop1_id, 'cleaning', 'Pre-arrival prep - ski group', CURRENT_DATE + INTERVAL '4 days', NULL, 'Ten Point staff scheduled'),
  (v_prop1_id, 'pool', 'Hot tub quarterly service', CURRENT_DATE + INTERVAL '10 days', v_vendor2_id, 'Filter and water change'),
  (v_prop2_id, 'cleaning', 'Pre-arrival prep - anniversary', CURRENT_DATE + INTERVAL '2 days', NULL, 'Extra attention to details'),
  (v_prop3_id, 'cleaning', 'Pre-arrival deep clean', CURRENT_DATE + INTERVAL '7 days', NULL, 'Peak season prep - full team 3 people'),
  (v_prop3_id, 'landscaping', 'Snow removal', CURRENT_DATE + INTERVAL '7 days', v_vendor1_id, 'Pre-guest clearing - weather dependent'),
  (v_prop4_id, 'cleaning', 'Pre-arrival prep - wellness', CURRENT_DATE + INTERVAL '1 day', NULL, 'Ten Point staff'),
  (v_prop4_id, 'other', 'Horse prep', CURRENT_DATE + INTERVAL '1 day', NULL, 'Groom and prepare for guests'),
  (v_prop5_id, 'cleaning', 'Pre-arrival prep - remote worker', CURRENT_DATE, NULL, 'Extra WiFi check'),
  (v_prop5_id, 'repair', 'Paddleboard inspection', CURRENT_DATE + INTERVAL '20 days', NULL, 'Pre-season check all equipment'),
  (v_prop1_id, 'other', 'Pest prevention', CURRENT_DATE + INTERVAL '15 days', v_vendor4_id, 'Quarterly service all 5 properties');

  -- =====================
  -- EXPENSES - Comprehensive including Ten Point cleaning labor
  -- =====================
  INSERT INTO expenses (property_id, category, amount, description, date, vendor_id) VALUES

  -- TEN POINT CLEANING LABOR (internal cost tracked as expense)
  -- Mountain View Lodge cleaning
  (v_prop1_id, 'maintenance', 120.00, 'Ten Point cleaning - turnover (4 hrs @ $30)', CURRENT_DATE - INTERVAL '78 days', NULL),
  (v_prop1_id, 'maintenance', 180.00, 'Ten Point cleaning - deep clean (6 hrs @ $30)', CURRENT_DATE - INTERVAL '64 days', NULL),
  (v_prop1_id, 'maintenance', 120.00, 'Ten Point cleaning - turnover (4 hrs @ $30)', CURRENT_DATE - INTERVAL '54 days', NULL),
  (v_prop1_id, 'maintenance', 120.00, 'Ten Point cleaning - turnover (4 hrs @ $30)', CURRENT_DATE - INTERVAL '45 days', NULL),
  (v_prop1_id, 'maintenance', 120.00, 'Ten Point cleaning - turnover (4 hrs @ $30)', CURRENT_DATE - INTERVAL '33 days', NULL),
  (v_prop1_id, 'maintenance', 120.00, 'Ten Point cleaning - turnover (4 hrs @ $30)', CURRENT_DATE - INTERVAL '25 days', NULL),
  (v_prop1_id, 'maintenance', 150.00, 'Ten Point cleaning - family deep clean (5 hrs @ $30)', CURRENT_DATE - INTERVAL '14 days', NULL),
  (v_prop1_id, 'maintenance', 120.00, 'Ten Point cleaning - turnover (4 hrs @ $30)', CURRENT_DATE - INTERVAL '3 days', NULL),

  -- Riverside Cabin cleaning
  (v_prop2_id, 'maintenance', 75.00, 'Ten Point cleaning - turnover (2.5 hrs @ $30)', CURRENT_DATE - INTERVAL '77 days', NULL),
  (v_prop2_id, 'maintenance', 75.00, 'Ten Point cleaning - turnover (2.5 hrs @ $30)', CURRENT_DATE - INTERVAL '64 days', NULL),
  (v_prop2_id, 'maintenance', 90.00, 'Ten Point cleaning - long stay (3 hrs @ $30)', CURRENT_DATE - INTERVAL '48 days', NULL),
  (v_prop2_id, 'maintenance', 75.00, 'Ten Point cleaning - turnover (2.5 hrs @ $30)', CURRENT_DATE - INTERVAL '39 days', NULL),
  (v_prop2_id, 'maintenance', 75.00, 'Ten Point cleaning - turnover (2.5 hrs @ $30)', CURRENT_DATE - INTERVAL '31 days', NULL),
  (v_prop2_id, 'maintenance', 75.00, 'Ten Point cleaning - turnover (2.5 hrs @ $30)', CURRENT_DATE - INTERVAL '19 days', NULL),
  (v_prop2_id, 'maintenance', 75.00, 'Ten Point cleaning - turnover (2.5 hrs @ $30)', CURRENT_DATE - INTERVAL '10 days', NULL),
  (v_prop2_id, 'maintenance', 75.00, 'Ten Point cleaning - turnover (2.5 hrs @ $30)', CURRENT_DATE - INTERVAL '4 days', NULL),

  -- Big Sky Retreat cleaning
  (v_prop3_id, 'maintenance', 240.00, 'Ten Point cleaning - full house (8 hrs @ $30)', CURRENT_DATE - INTERVAL '81 days', NULL),
  (v_prop3_id, 'maintenance', 180.00, 'Ten Point cleaning - corporate (6 hrs @ $30)', CURRENT_DATE - INTERVAL '70 days', NULL),
  (v_prop3_id, 'maintenance', 180.00, 'Ten Point cleaning - standard (6 hrs @ $30)', CURRENT_DATE - INTERVAL '55 days', NULL),
  (v_prop3_id, 'maintenance', 240.00, 'Ten Point cleaning - large group (8 hrs @ $30)', CURRENT_DATE - INTERVAL '38 days', NULL),
  (v_prop3_id, 'maintenance', 180.00, 'Ten Point cleaning - standard (6 hrs @ $30)', CURRENT_DATE - INTERVAL '26 days', NULL),
  (v_prop3_id, 'maintenance', 180.00, 'Ten Point cleaning - quick turn (6 hrs @ $30)', CURRENT_DATE - INTERVAL '14 days', NULL),
  (v_prop3_id, 'maintenance', 180.00, 'Ten Point cleaning - standard (6 hrs @ $30)', CURRENT_DATE - INTERVAL '5 days', NULL),

  -- Paradise Valley Ranch cleaning
  (v_prop4_id, 'maintenance', 120.00, 'Ten Point cleaning - family (4 hrs @ $30)', CURRENT_DATE - INTERVAL '74 days', NULL),
  (v_prop4_id, 'maintenance', 120.00, 'Ten Point cleaning - standard (4 hrs @ $30)', CURRENT_DATE - INTERVAL '61 days', NULL),
  (v_prop4_id, 'maintenance', 120.00, 'Ten Point cleaning - yoga group (4 hrs @ $30)', CURRENT_DATE - INTERVAL '46 days', NULL),
  (v_prop4_id, 'maintenance', 60.00, 'Ten Point horse area prep (2 hrs @ $30)', CURRENT_DATE - INTERVAL '42 days', NULL),
  (v_prop4_id, 'maintenance', 120.00, 'Ten Point cleaning - multi-gen (4 hrs @ $30)', CURRENT_DATE - INTERVAL '35 days', NULL),
  (v_prop4_id, 'maintenance', 105.00, 'Ten Point cleaning - standard (3.5 hrs @ $30)', CURRENT_DATE - INTERVAL '26 days', NULL),
  (v_prop4_id, 'maintenance', 105.00, 'Ten Point cleaning - standard (3.5 hrs @ $30)', CURRENT_DATE - INTERVAL '17 days', NULL),
  (v_prop4_id, 'maintenance', 120.00, 'Ten Point cleaning - return family (4 hrs @ $30)', CURRENT_DATE - INTERVAL '7 days', NULL),
  (v_prop4_id, 'maintenance', 90.00, 'Ten Point cleaning - quick stay (3 hrs @ $30)', CURRENT_DATE - INTERVAL '1 day', NULL),

  -- Lakefront Hideaway cleaning
  (v_prop5_id, 'maintenance', 105.00, 'Ten Point cleaning - winter (3.5 hrs @ $30)', CURRENT_DATE - INTERVAL '72 days', NULL),
  (v_prop5_id, 'maintenance', 120.00, 'Ten Point cleaning - long stay (4 hrs @ $30)', CURRENT_DATE - INTERVAL '52 days', NULL),
  (v_prop5_id, 'maintenance', 105.00, 'Ten Point cleaning - standard (3.5 hrs @ $30)', CURRENT_DATE - INTERVAL '44 days', NULL),
  (v_prop5_id, 'maintenance', 105.00, 'Ten Point cleaning - standard (3.5 hrs @ $30)', CURRENT_DATE - INTERVAL '33 days', NULL),
  (v_prop5_id, 'maintenance', 105.00, 'Ten Point cleaning - standard (3.5 hrs @ $30)', CURRENT_DATE - INTERVAL '22 days', NULL),
  (v_prop5_id, 'maintenance', 90.00, 'Ten Point cleaning - weekend (3 hrs @ $30)', CURRENT_DATE - INTERVAL '15 days', NULL),
  (v_prop5_id, 'maintenance', 105.00, 'Ten Point cleaning - standard (3.5 hrs @ $30)', CURRENT_DATE - INTERVAL '7 days', NULL),
  (v_prop5_id, 'maintenance', 90.00, 'Ten Point cleaning - writer (3 hrs @ $30)', CURRENT_DATE - INTERVAL '2 days', NULL),

  -- UTILITIES (monthly)
  (v_prop1_id, 'utilities', 385.00, 'Electric - December', CURRENT_DATE - INTERVAL '75 days', NULL),
  (v_prop1_id, 'utilities', 420.00, 'Electric - January', CURRENT_DATE - INTERVAL '45 days', NULL),
  (v_prop1_id, 'utilities', 380.00, 'Electric - February', CURRENT_DATE - INTERVAL '15 days', NULL),
  (v_prop1_id, 'utilities', 95.00, 'Internet - December', CURRENT_DATE - INTERVAL '75 days', NULL),
  (v_prop1_id, 'utilities', 95.00, 'Internet - January', CURRENT_DATE - INTERVAL '45 days', NULL),
  (v_prop1_id, 'utilities', 95.00, 'Internet - February', CURRENT_DATE - INTERVAL '15 days', NULL),
  (v_prop1_id, 'utilities', 180.00, 'Propane refill', CURRENT_DATE - INTERVAL '60 days', NULL),

  (v_prop2_id, 'utilities', 145.00, 'Electric - December', CURRENT_DATE - INTERVAL '75 days', NULL),
  (v_prop2_id, 'utilities', 165.00, 'Electric - January', CURRENT_DATE - INTERVAL '45 days', NULL),
  (v_prop2_id, 'utilities', 155.00, 'Electric - February', CURRENT_DATE - INTERVAL '15 days', NULL),
  (v_prop2_id, 'utilities', 75.00, 'Internet - December', CURRENT_DATE - INTERVAL '75 days', NULL),
  (v_prop2_id, 'utilities', 75.00, 'Internet - January', CURRENT_DATE - INTERVAL '45 days', NULL),
  (v_prop2_id, 'utilities', 75.00, 'Internet - February', CURRENT_DATE - INTERVAL '15 days', NULL),

  (v_prop3_id, 'utilities', 525.00, 'Electric - December', CURRENT_DATE - INTERVAL '75 days', NULL),
  (v_prop3_id, 'utilities', 580.00, 'Electric - January', CURRENT_DATE - INTERVAL '45 days', NULL),
  (v_prop3_id, 'utilities', 550.00, 'Electric - February', CURRENT_DATE - INTERVAL '15 days', NULL),
  (v_prop3_id, 'utilities', 150.00, 'Internet/Cable - December', CURRENT_DATE - INTERVAL '75 days', NULL),
  (v_prop3_id, 'utilities', 150.00, 'Internet/Cable - January', CURRENT_DATE - INTERVAL '45 days', NULL),
  (v_prop3_id, 'utilities', 150.00, 'Internet/Cable - February', CURRENT_DATE - INTERVAL '15 days', NULL),
  (v_prop3_id, 'utilities', 320.00, 'Propane - heating', CURRENT_DATE - INTERVAL '55 days', NULL),

  (v_prop4_id, 'utilities', 195.00, 'Electric - December', CURRENT_DATE - INTERVAL '75 days', NULL),
  (v_prop4_id, 'utilities', 210.00, 'Electric - January', CURRENT_DATE - INTERVAL '45 days', NULL),
  (v_prop4_id, 'utilities', 200.00, 'Electric - February', CURRENT_DATE - INTERVAL '15 days', NULL),
  (v_prop4_id, 'utilities', 85.00, 'Internet - December', CURRENT_DATE - INTERVAL '75 days', NULL),
  (v_prop4_id, 'utilities', 85.00, 'Internet - January', CURRENT_DATE - INTERVAL '45 days', NULL),
  (v_prop4_id, 'utilities', 85.00, 'Internet - February', CURRENT_DATE - INTERVAL '15 days', NULL),
  (v_prop4_id, 'other', 250.00, 'Horse feed and supplies', CURRENT_DATE - INTERVAL '40 days', NULL),

  (v_prop5_id, 'utilities', 175.00, 'Electric - December', CURRENT_DATE - INTERVAL '75 days', NULL),
  (v_prop5_id, 'utilities', 190.00, 'Electric - January', CURRENT_DATE - INTERVAL '45 days', NULL),
  (v_prop5_id, 'utilities', 180.00, 'Electric - February', CURRENT_DATE - INTERVAL '15 days', NULL),
  (v_prop5_id, 'utilities', 85.00, 'Internet - December', CURRENT_DATE - INTERVAL '75 days', NULL),
  (v_prop5_id, 'utilities', 85.00, 'Internet - January', CURRENT_DATE - INTERVAL '45 days', NULL),
  (v_prop5_id, 'utilities', 85.00, 'Internet - February', CURRENT_DATE - INTERVAL '15 days', NULL),

  -- SUPPLIES
  (v_prop1_id, 'supplies', 185.00, 'Linens and towels restock', CURRENT_DATE - INTERVAL '60 days', NULL),
  (v_prop1_id, 'supplies', 95.00, 'Cleaning supplies', CURRENT_DATE - INTERVAL '45 days', NULL),
  (v_prop1_id, 'supplies', 125.00, 'Kitchen supplies restock', CURRENT_DATE - INTERVAL '30 days', NULL),
  (v_prop2_id, 'supplies', 75.00, 'Fishing tackle replacement', CURRENT_DATE - INTERVAL '50 days', NULL),
  (v_prop2_id, 'supplies', 60.00, 'Cleaning supplies', CURRENT_DATE - INTERVAL '35 days', NULL),
  (v_prop3_id, 'supplies', 220.00, 'Premium linens', CURRENT_DATE - INTERVAL '70 days', NULL),
  (v_prop3_id, 'supplies', 145.00, 'Cleaning supplies bulk', CURRENT_DATE - INTERVAL '40 days', NULL),
  (v_prop3_id, 'supplies', 85.00, 'Coffee and kitchen stock', CURRENT_DATE - INTERVAL '20 days', NULL),
  (v_prop4_id, 'supplies', 95.00, 'Cleaning supplies', CURRENT_DATE - INTERVAL '55 days', NULL),
  (v_prop4_id, 'supplies', 65.00, 'Fire pit supplies', CURRENT_DATE - INTERVAL '25 days', NULL),
  (v_prop5_id, 'supplies', 110.00, 'Water sports equipment', CURRENT_DATE - INTERVAL '65 days', NULL),
  (v_prop5_id, 'supplies', 70.00, 'Cleaning supplies', CURRENT_DATE - INTERVAL '30 days', NULL);

  -- =====================
  -- INQUIRIES
  -- =====================
  INSERT INTO inquiries (property_id, name, email, phone, check_in, check_out, guests, message, status, created_at) VALUES
  (v_prop1_id, 'Tom Bradley', 'tom.bradley@email.com', '(555) 123-4567', CURRENT_DATE + INTERVAL '50 days', CURRENT_DATE + INTERVAL '57 days', 8, 'Hi, we''re interested in booking your lodge for a family gathering. Is it available for the dates listed? We have 8 adults. Also wondering about pet policy.', 'new', CURRENT_DATE - INTERVAL '1 day'),
  (v_prop3_id, 'Jennifer Adams', 'jadams@company.com', '(555) 234-5678', CURRENT_DATE + INTERVAL '55 days', CURRENT_DATE + INTERVAL '58 days', 10, 'Looking for a corporate retreat venue. Do you offer any discounts for 3+ night stays? We need space for 10 people with good WiFi for remote meetings.', 'contacted', CURRENT_DATE - INTERVAL '3 days'),
  (v_prop5_id, 'Mike Chen', 'mchen@email.com', NULL, CURRENT_DATE + INTERVAL '45 days', CURRENT_DATE + INTERVAL '50 days', 4, 'Is the lake good for fishing in late winter/early spring? We''re a group of 4 looking for a fishing getaway. What fish are typically caught?', 'new', CURRENT_DATE - INTERVAL '2 hours'),
  (v_prop2_id, 'Sandra White', 'swhite@email.com', '(555) 345-6789', CURRENT_DATE + INTERVAL '35 days', CURRENT_DATE + INTERVAL '38 days', 2, 'My husband and I are celebrating our 30th anniversary. Is the cabin romantic? Can you arrange any special touches like flowers or champagne?', 'converted', CURRENT_DATE - INTERVAL '5 days'),
  (v_prop4_id, 'Rachel Green', 'rgreen@wellness.com', '(555) 456-7890', CURRENT_DATE + INTERVAL '60 days', CURRENT_DATE + INTERVAL '64 days', 6, 'I run wellness retreats and your ranch looks perfect. Can we use the outdoor space for yoga? Is it quiet in the mornings? How are the horses for beginners?', 'new', CURRENT_DATE - INTERVAL '6 hours'),
  (v_prop1_id, 'Steve Morton', 'smorton@family.com', '(555) 567-8901', CURRENT_DATE + INTERVAL '70 days', CURRENT_DATE + INTERVAL '77 days', 10, 'Planning a multi-family vacation. The kids (ages 8-15) love hiking and the hot tub. Are there good trails nearby? Is the game room kid-friendly?', 'contacted', CURRENT_DATE - INTERVAL '4 days');

  RAISE NOTICE 'Test data seeded successfully!';
  RAISE NOTICE 'Created: 5 properties, 15 guests, 4 vendors, 55+ bookings, 70+ maintenance tasks, 80+ expenses, and 6 inquiries';
END $$;
