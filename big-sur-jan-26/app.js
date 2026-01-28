// ============ ACTIVITY DATA ============
const activities = [
    // EXPLORE - Hikes (subtype: hike)
    { id: 'ewoldsen', name: 'Ewoldsen Trail', emoji: '⛰️', cat: 'explore', subtype: 'hike', tag: 'Challenging', duration: 3.5, miles: 4.5, desc: 'Epic redwood canyon to ocean panorama. The most rewarding hike in Big Sur.', zone: 'south', coords: [36.2380, -121.7850] },
    { id: 'soberanes', name: 'Soberanes Canyon', emoji: '🌲', cat: 'explore', subtype: 'hike', tag: 'Moderate', duration: 2, miles: 3, desc: 'Lush redwood canyon near your stay. Whale watching from Soberanes Point!', zone: 'north', coords: [36.4467, -121.9283] },
    { id: 'garrapata-bluffs', name: 'Garrapata Bluffs', emoji: '🌊', cat: 'explore', subtype: 'coastal', tag: 'Easy Walk', duration: 1, miles: 2, desc: 'Coastal cliffs, wildflowers, sea lions. Quick scenic walk by your cabin.', zone: 'north', coords: [36.4583, -121.9217] },
    { id: 'pfeiffer-falls', name: 'Pfeiffer Falls + Valley View', emoji: '💧', cat: 'explore', subtype: 'hike', tag: 'Moderate', duration: 2, miles: 3.2, desc: 'Waterfall through redwood forest, then climb to sweeping valley panorama.', zone: 'central', coords: [36.2500, -121.7833] },
    { id: 'partington-cove', name: 'Partington Cove Tunnel', emoji: '🚪', cat: 'explore', subtype: 'hike', tag: 'Hidden Gem', duration: 0.75, miles: 1, desc: 'Secret 60-ft bootlegger tunnel to hidden cove. Spot sea otters!', zone: 'south', coords: [36.1783, -121.7017] },
    { id: 'point-lobos', name: 'Point Lobos Reserve', emoji: '🦭', cat: 'explore', subtype: 'coastal', tag: 'Crown Jewel', duration: 2, miles: 3, desc: 'Best state park in CA. Sea otters, seals, tide pools. Bird Island Trail stunning. $10.', zone: 'carmel', coords: [36.5167, -121.9500] },

    // EXPLORE - Beaches (subtype: beach)
    { id: 'pfeiffer-beach', name: 'Pfeiffer Beach', emoji: '🏖️', cat: 'explore', subtype: 'beach', tag: 'Must-See', duration: 1.5, desc: 'Famous Keyhole Rock, purple sand, dramatic sunset through the arch. $15.', zone: 'central', coords: [36.2383, -121.8150] },
    { id: 'garrapata-beach', name: 'Garrapata Beach', emoji: '🏖️', cat: 'explore', subtype: 'beach', tag: 'Hidden', duration: 1, desc: 'Secluded sandy beach near Calla Lily Valley. Driftwood shelters, great for picnics.', zone: 'north', coords: [36.4617, -121.9267] },
    { id: 'andrew-molera', name: 'Andrew Molera Beach', emoji: '🏖️', cat: 'explore', subtype: 'beach', tag: 'Expansive', duration: 1.5, miles: 2, desc: 'Longest beach in Big Sur. River crossing, monarch butterflies, wild and empty.', zone: 'central', coords: [36.2850, -121.8517] },
    { id: 'carmel-river-beach', name: 'Carmel River State Beach', emoji: '🏖️', cat: 'explore', subtype: 'beach', tag: 'Accessible', duration: 1, desc: 'Wide sandy beach at Carmel River mouth. Great for sunset walks, birdwatching.', zone: 'carmel', coords: [36.5367, -121.9283] },

    // EXPLORE - Scenic Stops (subtype: scenic)
    { id: 'mcway-falls', name: 'McWay Falls Overlook', emoji: '📸', cat: 'explore', subtype: 'scenic', tag: 'Iconic', duration: 0.5, desc: '80-foot waterfall onto pristine beach. THE Big Sur postcard shot.', zone: 'south', coords: [36.1583, -121.6717] },
    { id: 'bixby', name: 'Bixby Bridge', emoji: '📸', cat: 'explore', subtype: 'scenic', tag: 'Classic', duration: 0.5, desc: 'The Instagram shot. Park north of bridge, walk back. Big Little Lies fame!', zone: 'north', coords: [36.3717, -121.9017] },
    { id: '17-mile', name: '17-Mile Drive', emoji: '📸', cat: 'explore', subtype: 'scenic', tag: 'Iconic', duration: 1.5, desc: 'The Lone Cypress! Ghost Trees! Pebble Beach! $12.25 toll (refunded with $35 restaurant purchase).', zone: 'carmel', coords: [36.5700, -121.9617] },
    { id: 'henry-miller', name: 'Henry Miller Library', emoji: '📚', cat: 'experience', subtype: 'culture', tag: 'Quirky', duration: 1, desc: '"Where nothing happens." Funky bookstore/art space. RHCP played here! WiFi works.', zone: 'central', coords: [36.1883, -121.7217] },

    // EXPERIENCES - Seasonal & Special Activities
    { id: 'calla-lily', name: 'Calla Lily Valley', emoji: '🌸', cat: 'experience', subtype: 'seasonal', tag: 'Peak Bloom!', duration: 0.75, desc: 'Hidden valley BURSTING with white calla lilies in late Jan! Gate 18 at Garrapata. Waterproof shoes!', zone: 'north', coords: [36.4650, -121.9233] },
    { id: 'whale-watch', name: 'Gray Whale Watching', emoji: '🐋', cat: 'experience', subtype: 'seasonal', tag: 'Peak Migration!', duration: 0.5, desc: 'Mid-January is PEAK! Bring binoculars. Best from Soberanes Point or any overlook.', zone: 'north', coords: [36.4467, -121.9283] },
    { id: 'stargaze-garrapata', name: 'Stargazing at Cabin', emoji: '🌌', cat: 'experience', subtype: 'stargazing', tag: 'Near Cabin', duration: 1, desc: 'Dark skies right by your cabin! Minimal light pollution. Bring blankets, hot cocoa.', zone: 'north', coords: [36.4583, -121.9217] },
    { id: 'stargaze-pfeiffer', name: 'Pfeiffer Beach Night Sky', emoji: '🌌', cat: 'experience', subtype: 'stargazing', tag: 'Dramatic', duration: 1.5, desc: 'Stars through Keyhole Rock! Check tide times. Bortle Scale 2 - exceptional darkness.', zone: 'central', coords: [36.2383, -121.8150] },
    { id: 'stargaze-andrew-molera', name: 'Andrew Molera Stargazing', emoji: '🌌', cat: 'experience', subtype: 'stargazing', tag: 'Wide Open', duration: 1.5, desc: 'Expansive beach, unobstructed views. Milky Way reflected on water. Bring telescope!', zone: 'central', coords: [36.2850, -121.8517] },
    { id: 'stargaze-carmel', name: 'Carmel Beach Stars', emoji: '🌌', cat: 'experience', subtype: 'stargazing', tag: 'Easy Access', duration: 1, desc: 'Most accessible spot. Easy parking, flat beach. Good for casual stargazing.', zone: 'carmel', coords: [36.5367, -121.9283] },

    // EXPERIENCES - Beach Activities
    { id: 'beach-picnic-garrapata', name: 'Beach Picnic at Garrapata', emoji: '🧺', cat: 'experience', subtype: 'beach-activity', tag: 'Relaxed', duration: 1.5, desc: 'Pack a lunch from the deli and enjoy it on the beach. Driftwood shelters make cozy spots!', zone: 'north', coords: [36.4617, -121.9267] },
    { id: 'beach-picnic-pfeiffer', name: 'Sunset Picnic at Pfeiffer', emoji: '🧺', cat: 'experience', subtype: 'beach-activity', tag: 'Romantic', duration: 2, desc: 'Watch the sun set through Keyhole Rock with wine and cheese. Magical!', zone: 'central', coords: [36.2383, -121.8150] },
    { id: 'beach-time-carmel', name: 'Beach Time in Carmel', emoji: '🐕', cat: 'experience', subtype: 'beach-activity', tag: 'Easy', duration: 1.5, desc: 'Relax on the white sand. Dog-friendly! Great for a lazy afternoon before heading home.', zone: 'carmel', coords: [36.5550, -121.9300] },

    // RESTAURANTS & CAFES - Big Sur
    { id: 'nepenthe', name: 'Nepenthe', emoji: '🍽️', cat: 'restaurant', subtype: 'dining', tag: 'Essential', duration: 1.5, price: '$$$', desc: 'THE Big Sur restaurant. Terrace 800ft above Pacific. Ambrosia Burger legendary. Sunset dinner!', zone: 'central', coords: [36.2217, -121.7583] },
    { id: 'cafe-kevah', name: 'Cafe Kevah', emoji: '☕', cat: 'restaurant', subtype: 'cafe', tag: 'Casual', duration: 1, price: '$$', desc: 'Below Nepenthe. Same views, lighter fare. Fresh smoothies, sandwiches.', zone: 'central', coords: [36.2217, -121.7583] },
    { id: 'big-sur-bakery', name: 'Big Sur Bakery', emoji: '🥐', cat: 'restaurant', subtype: 'cafe', tag: 'Legendary', duration: 1, price: '$$', desc: 'Famous wood-fired breads, ginger scones, croissants. Fairy tale garden seating.', zone: 'central', coords: [36.2417, -121.7750] },
    { id: 'river-inn', name: 'Big Sur River Inn', emoji: '🍺', cat: 'restaurant', subtype: 'dining', tag: 'Local Fave', duration: 1.5, price: '$$', desc: 'Chairs IN the river! Classic roadhouse vibes, good burgers. Grab a beer, sit in the creek.', zone: 'central', coords: [36.2700, -121.8200] },
    { id: 'deetjens', name: "Deetjen's Big Sur Inn", emoji: '🕯️', cat: 'restaurant', subtype: 'dining', tag: 'Historic', duration: 1.5, price: '$$$', desc: 'Romantic candlelit dining in 1930s inn. Famous breakfast pancakes. Reservations needed.', zone: 'central', coords: [36.2017, -121.7400] },
    { id: 'big-sur-taphouse', name: 'Big Sur Taphouse', emoji: '🍻', cat: 'restaurant', subtype: 'dining', tag: 'Craft Beer', duration: 1, price: '$$', desc: 'Rotating craft beers, hearty sandwiches. Local hangout spot.', zone: 'central', coords: [36.2700, -121.8200] },

    // RESTAURANTS & CAFES - Carmel
    { id: 'stationary', name: 'Stationæry', emoji: '⭐', cat: 'restaurant', subtype: 'dining', tag: 'Michelin Bib', duration: 1.5, price: '$$$', desc: 'Michelin Bib Gourmand! Best brunch in Carmel. House-made pastries, shakshuka. Reserve ahead!', zone: 'carmel', coords: [36.5550, -121.9233] },
    { id: 'carmel-belle', name: 'Carmel Belle', emoji: '🥐', cat: 'restaurant', subtype: 'cafe', tag: 'Cozy', duration: 1, price: '$$', desc: 'Farm-to-table cafe in Doud Arcade. Great pastries, sandwiches, coffee.', zone: 'carmel', coords: [36.5550, -121.9217] },
    { id: 'la-bicyclette', name: 'La Bicyclette', emoji: '🍽️', cat: 'restaurant', subtype: 'dining', tag: 'French', duration: 1.5, price: '$$$', desc: 'Rustic European charm. Wood-fired pizzas, hearty French-California cuisine.', zone: 'carmel', coords: [36.5550, -121.9233] },
    { id: 'carmel-bakery', name: 'Carmel Bakery', emoji: '🥐', cat: 'restaurant', subtype: 'cafe', tag: 'Early Open', duration: 0.5, price: '$', desc: 'Opens 7am! Coffee and pastries for early birds. Cute dog treats too.', zone: 'carmel', coords: [36.5550, -121.9217] },

    // SUNSET TAKEOUT - Carmel area (order ahead for beach picnic)
    { id: 'fifth-avenue-deli', name: '5th Avenue Deli', emoji: '🥡', cat: 'provisions', subtype: 'takeout', tag: 'Sunset Picnic', duration: 0.5, price: '$$', desc: 'Order ahead! Gourmet sandwiches, salads, and picnic provisions. Perfect for Carmel Beach sunset.', zone: 'carmel', coords: [36.5548, -121.9211] },
    { id: 'ricos-tacos', name: "Rico's Tacos & Burritos", emoji: '🌮', cat: 'provisions', subtype: 'takeout', tag: 'Sunset Picnic', duration: 0.5, price: '$', desc: 'Fresh, fast, delicious! Grab tacos and burritos for a casual sunset beach dinner.', zone: 'carmel', coords: [36.5530, -121.9200] },
    { id: 'culture-kombucha', name: 'Culture Kombucha & Deli', emoji: '🥗', cat: 'provisions', subtype: 'takeout', tag: 'Healthy', duration: 0.5, price: '$$', desc: 'Healthy bowls, salads, and wraps. Craft kombucha on tap! Light and fresh for beach sunset.', zone: 'carmel', coords: [36.5533, -121.9217] },
    { id: 'il-tegamino', name: 'Il Tegamino To-Go', emoji: '🍝', cat: 'provisions', subtype: 'takeout', tag: 'Italian', duration: 0.5, price: '$$', desc: 'Fresh pasta, meatballs, Italian specialties to-go. Order ahead for sunset beach feast!', zone: 'carmel', coords: [36.5560, -121.9225] },

    // SUPPLIES & PROVISIONS
    { id: 'big-sur-deli', name: 'Big Sur Deli', emoji: '🥪', cat: 'provisions', subtype: 'deli', tag: 'Grab & Go', duration: 0.5, price: '$', desc: 'Grab-and-go sandwiches, snacks, drinks. Perfect for trail picnics.', zone: 'central', coords: [36.2700, -121.8200] },
    { id: 'big-sur-general', name: 'Big Sur General Store', emoji: '🏪', cat: 'provisions', subtype: 'store', tag: 'Supplies', duration: 0.5, price: '$', desc: 'Groceries, camping supplies, firewood. Gas station attached (expensive!).', zone: 'central', coords: [36.2700, -121.8200] },
    { id: 'brunos', name: "Bruno's Market & Deli", emoji: '🥪', cat: 'provisions', subtype: 'deli', tag: 'Institution', duration: 0.5, price: '$', desc: 'Carmel institution since 1953. Great sandwiches, picnic supplies, wine selection.', zone: 'carmel', coords: [36.5517, -121.9183] },
    { id: 'nielsen-bros', name: 'Nielsen Bros. Market', emoji: '🧺', cat: 'provisions', subtype: 'store', tag: 'Gourmet', duration: 0.5, price: '$$', desc: 'Upscale market with great deli, wine, cheese. Perfect picnic provisions.', zone: 'carmel', coords: [36.5550, -121.9200] },

    // ROAD TRIP STOPS (between San Rafael and Big Sur)
    { id: 'devils-slide', name: "Devil's Slide Trail", emoji: '🌊', cat: 'explore', subtype: 'coastal', tag: 'Road Trip', duration: 1, desc: 'Abandoned highway turned 1.3-mile coastal trail! Dramatic cliffs, old bootlegger history. Easy walk with stunning views.', zone: 'roadtrip', coords: [37.5750, -122.5150] },
    { id: 'fitzgerald-tidepools', name: 'Fitzgerald Marine Reserve', emoji: '🦀', cat: 'explore', subtype: 'coastal', tag: 'Road Trip', duration: 1.5, desc: 'Best tide pools in CA! Giant anemones, purple sea stars, hermit crabs. Check tide charts - go at low tide. Free!', zone: 'roadtrip', coords: [37.5233, -122.5167] },
    { id: 'sams-chowder', name: "Sam's Chowder House", emoji: '🦞', cat: 'restaurant', subtype: 'roadstop', tag: 'Road Trip', duration: 1, price: '$$', desc: 'Famous lobster rolls and clam chowder with ocean views! Great outdoor patio. Worth the stop in Half Moon Bay.', zone: 'roadtrip', coords: [37.4283, -122.4367] },
    { id: 'pie-ranch', name: 'Pie Ranch Farm Stand', emoji: '🥧', cat: 'provisions', subtype: 'roadstop', tag: 'Road Trip', duration: 0.5, price: '$', desc: 'Roadside farm stand on Hwy 1 near Pescadero. Fresh seasonal pies, local produce, preserves. Non-profit farm supporting food justice.', zone: 'roadtrip', coords: [37.1083, -122.3567] },
    { id: 'pigeon-point', name: 'Pigeon Point Lighthouse', emoji: '🏠', cat: 'explore', subtype: 'scenic', tag: 'Road Trip', duration: 0.5, desc: 'One of tallest lighthouses in America! Great photo op. Hostel on-site has hot tub with ocean views (book ahead).', zone: 'roadtrip', coords: [37.1822, -122.3939] },
    { id: 'duartes-tavern', name: "Duarte's Tavern", emoji: '🍲', cat: 'restaurant', subtype: 'roadstop', tag: 'Road Trip', duration: 1, price: '$$', desc: 'James Beard Award winner since 1894! Famous artichoke soup (get it "half & half" with green chile). Also great crab cioppino.', zone: 'roadtrip', coords: [37.2553, -122.3836] },
    { id: 'ano-nuevo', name: 'Año Nuevo Elephant Seals', emoji: '🦭', cat: 'experience', subtype: 'seasonal', tag: 'Seasonal!', duration: 2.5, price: '$10', desc: 'PEAK SEASON! Massive elephant seals breeding on the beach. Guided tours required Dec-Mar. Book ahead - sells out!', zone: 'roadtrip', coords: [37.1197, -122.3375] },
    { id: 'santa-cruz-wharf', name: 'Santa Cruz Wharf', emoji: '🎡', cat: 'explore', subtype: 'scenic', tag: 'Road Trip', duration: 1, desc: 'Longest wooden wharf on West Coast! Sea lions, shops, restaurants. Boardwalk amusement park nearby. Fun detour!', zone: 'roadtrip', coords: [36.9575, -122.0172] },
    { id: 'moss-landing-kayak', name: 'Sea Otter Kayaking', emoji: '🦦', cat: 'experience', subtype: 'adventure', tag: 'Sunday Fun', duration: 3, price: '$75', desc: 'Kayak Elkhorn Slough at Moss Landing! Hundreds of sea otters, harbor seals, shore birds. No experience needed. Book ahead!', zone: 'roadtrip', coords: [36.8047, -121.7856] },
    { id: 'phil-fish-market', name: "Phil's Fish Market", emoji: '🦪', cat: 'restaurant', subtype: 'roadstop', tag: 'Road Trip', duration: 1, price: '$$', desc: 'Legendary cioppino at Moss Landing! Cash only, always packed. The fish is ridiculously fresh. Get the crab.', zone: 'roadtrip', coords: [36.8044, -121.7878] },

    // TRAVEL (special category - not shown in discovery but used in scheduling)
    { id: 'leave-san-rafael', name: 'Leave San Rafael', emoji: '🚗', cat: 'travel', subtype: 'travel', tag: 'Departure', duration: 2.5, desc: 'Start of the adventure! ~2.5 hour drive to Big Sur via Highway 1.', zone: 'home', coords: [37.9735, -122.5311], isTravel: true },
    { id: 'drive-home', name: 'Drive Home to San Rafael', emoji: '🏠', cat: 'travel', subtype: 'travel', tag: 'Return', duration: 2.5, desc: '~2.5 hour drive back. Consider stops in Carmel or Monterey!', zone: 'home', coords: [37.9735, -122.5311], isTravel: true },

    // LIFESTYLE (cabin/rest activities)
    { id: 'cozy-airbnb', name: 'Cozy Time at Cabin', emoji: '🏡', cat: 'lifestyle', subtype: 'rest', tag: 'Relax', duration: 2, desc: 'Enjoy the cabin! Hot tub, fireplace, ocean views. Make dinner, play games.', zone: 'north', coords: [36.4583, -121.9217], isLifestyle: true },
    { id: 'sleep-in', name: 'Sleep In', emoji: '😴', cat: 'lifestyle', subtype: 'rest', tag: 'Rest', duration: 1.5, desc: 'No alarm! Wake up naturally. Enjoy a slow morning.', zone: 'north', coords: [36.4583, -121.9217], isLifestyle: true },
    { id: 'early-start', name: 'Early Start', emoji: '🌅', cat: 'lifestyle', subtype: 'wakeup', tag: 'Wake Up', duration: 0.5, desc: 'Up early to maximize the day! Catch the sunrise.', zone: 'north', coords: [36.4583, -121.9217], isLifestyle: true },

    // BIGFOOT (Easter egg)
    { id: 'bigfoot', name: 'Call Bigfoot', emoji: '🦶', cat: 'explore', subtype: 'culture', tag: 'Legendary', duration: 0, desc: 'Reception spotty in redwoods. Prefers text. Last seen near Ewoldsen stealing granola.', zone: 'unknown', coords: [36.25, -121.78] },
];

// Zone-based drive times (minutes from cabin at Garrapata)
const driveTimes = {
    'north': 5,      // Garrapata area
    'central': 25,   // Big Sur Village, Nepenthe
    'south': 40,     // McWay, Ewoldsen
    'carmel': 25,    // Point Lobos, Carmel
    'roadtrip': 60,  // Pescadero, Moss Landing (en route)
    'unknown': 30
};

// ============ TEMPLATE PLANS ============
const templatePlans = {
    friday: [
        {
            id: 'friday-scenic',
            emoji: '🌅',
            name: 'Scenic Arrival',
            desc: 'Leave 1pm → Bixby sunset → Nepenthe dinner',
            story: "Leave San Rafael around 1pm for a leisurely drive down Highway 1. You'll arrive in Big Sur around 4pm with time to drop bags at the cabin. Head to iconic Bixby Bridge for golden hour photos, then drive up to Nepenthe for dinner at sunset. The views from the terrace 800 feet above the Pacific are unforgettable. End the night cozied up at the cabin!",
            fri: {
                departure: '1:00 PM',
                arrival: '~4:00 PM',
                afternoon: ['leave-san-rafael'],
                sunset: ['bixby'],
                evening: ['nepenthe', 'cozy-airbnb']
            }
        },
        {
            id: 'friday-chill',
            emoji: '🍷',
            name: 'Cozy Evening',
            desc: 'Leave 2pm → Groceries → Taphouse → Cabin',
            story: "A relaxed start - leave San Rafael around 2pm and arrive at the cabin by 5pm. Stop at the Big Sur General Store for groceries and firewood, then unwind with craft beers and hearty food at the Taphouse. Head back to the cabin for a cozy first night - fire up the hot tub, open some wine, and settle into vacation mode.",
            fri: {
                departure: '2:00 PM',
                arrival: '~5:00 PM',
                afternoon: ['leave-san-rafael'],
                sunset: ['big-sur-general'],
                evening: ['big-sur-taphouse', 'cozy-airbnb']
            }
        },
        {
            id: 'friday-explore',
            emoji: '🔍',
            name: 'Early Explorer',
            desc: 'Leave 12pm → Bluffs walk → River Inn',
            story: "Get an early jump on the weekend! Leave San Rafael by noon and arrive around 3pm. Take a short walk along the stunning Garrapata Bluffs - wildflowers, sea lions, and sweeping coastal views just minutes from your cabin. Watch sunset from the River Inn with a beer and your feet in the creek, then back to the cabin for a relaxing evening.",
            fri: {
                departure: '12:00 PM',
                arrival: '~3:00 PM',
                afternoon: ['leave-san-rafael', 'garrapata-bluffs'],
                sunset: ['river-inn'],
                evening: ['cozy-airbnb']
            }
        },
        {
            id: 'friday-stargazing',
            emoji: '🌌',
            name: 'Stargazing Night',
            desc: 'Leave 1pm → Settle in → Night sky!',
            story: "Leave San Rafael around 1pm, arriving by 4pm. Grab groceries at the General Store and spend sunset settling into your cabin - unpack, explore the property, maybe take a quick dip in the hot tub. After dark, bundle up and head outside for incredible stargazing. Big Sur has some of the darkest skies in California - perfect for spotting constellations and the Milky Way!",
            fri: {
                departure: '1:00 PM',
                arrival: '~4:00 PM',
                afternoon: ['leave-san-rafael'],
                sunset: ['big-sur-general', 'cozy-airbnb'],
                evening: ['stargaze-garrapata']
            }
        }
    ],
    saturday: [
        {
            id: 'sat-nepenthe-sunset',
            emoji: '🌄',
            name: 'Nepenthe Sunset',
            desc: 'Epic hike → Beach → Sunset dinner at Nepenthe',
            story: "Wake up early for the most rewarding hike in Big Sur - Ewoldsen Trail takes you through a magical redwood canyon up to panoramic ocean views. Afterward, catch the iconic McWay Falls overlook and spend the afternoon at Pfeiffer Beach watching the waves crash through Keyhole Rock. End the day with sunset dinner at Nepenthe, the legendary Big Sur restaurant perched 800 feet above the Pacific. Try the famous Ambrosia Burger!",
            sat: {
                morning: ['early-start', 'ewoldsen'],
                afternoon: ['mcway-falls', 'pfeiffer-beach'],
                sunset: ['nepenthe'],
                evening: ['cozy-airbnb']
            }
        },
        {
            id: 'sat-coastal-adventure',
            emoji: '🌊',
            name: 'Coastal Adventure',
            desc: 'Beach hopping & seasonal wonders',
            story: "Start the day at magical Calla Lily Valley - it's peak bloom in late January with white lilies carpeting the hillside! Then hike the lush Soberanes Canyon through redwoods. After lunch, scan the horizon for migrating gray whales (January is peak season!) and relax on the secluded Garrapata Beach. Light dinner at Cafe Kevah with the same stunning views as Nepenthe, then end with stargazing right from your cabin's backyard.",
            sat: {
                morning: ['calla-lily', 'soberanes'],
                afternoon: ['whale-watch', 'garrapata-beach'],
                sunset: ['cafe-kevah'],
                evening: ['stargaze-garrapata']
            }
        },
        {
            id: 'sat-best-hikes',
            emoji: '🥾',
            name: 'Best Hikes Day',
            desc: 'Tackle the epic trails',
            story: "For the adventurous! Start early with Ewoldsen Trail - Big Sur's most rewarding hike through a redwood canyon to ocean panoramas. In the afternoon, tackle Pfeiffer Falls through the forest up to Valley View for sweeping vistas. Refuel with legendary pastries and coffee at Big Sur Bakery (their wood-fired bread is famous). A satisfying day of trails followed by a cozy evening at the cabin.",
            sat: {
                morning: ['early-start', 'ewoldsen'],
                afternoon: ['pfeiffer-falls'],
                sunset: ['big-sur-bakery'],
                evening: ['cozy-airbnb']
            }
        },
        {
            id: 'sat-romantic',
            emoji: '💕',
            name: 'Romantic Day',
            desc: 'Scenic spots + candlelit Deetjen\'s',
            story: "Sleep in and enjoy a lazy morning at the cabin. Then visit the enchanting Calla Lily Valley in full bloom! Explore the secret Partington Cove through a 60-foot bootlegger tunnel to a hidden beach. Stop at the iconic McWay Falls overlook for photos. The evening is magical - romantic candlelit dinner at historic Deetjen's Inn (reserve ahead!), then stargazing at Pfeiffer Beach with the Milky Way framed through Keyhole Rock.",
            sat: {
                morning: ['sleep-in', 'calla-lily'],
                afternoon: ['partington-cove', 'mcway-falls'],
                sunset: ['deetjens'],
                evening: ['stargaze-pfeiffer']
            }
        },
        {
            id: 'sat-chill',
            emoji: '😌',
            name: 'Relaxed Saturday',
            desc: 'Sleep in, easy pace, great food',
            story: "No alarms! Wake up naturally and enjoy the cabin. When hunger strikes, head to Big Sur Bakery for their legendary wood-fired pastries and coffee. Take an easy stroll along the Garrapata Bluffs - stunning views with minimal effort. Spend the afternoon at purple-sand Pfeiffer Beach, then catch sunset at the River Inn with your feet in the creek and a cold beer in hand. Back to the cabin for a relaxed evening.",
            sat: {
                morning: ['sleep-in', 'big-sur-bakery'],
                afternoon: ['garrapata-bluffs', 'pfeiffer-beach'],
                sunset: ['river-inn'],
                evening: ['cozy-airbnb']
            }
        }
    ],
    sunday: [
        {
            id: 'sun-lazy',
            emoji: '😴',
            name: 'Lazy Sunday',
            desc: 'Sleep in, Point Lobos, brunch → home ~5pm',
            story: "Sleep in and enjoy a slow morning at the cabin. Around 10am, head to Point Lobos - California's most stunning state park. Spot sea otters, seals, and gorgeous tide pools on an easy coastal walk. Mid-afternoon, treat yourself to brunch at Stationæry (Michelin Bib Gourmand!) - their shakshuka and house-made pastries are incredible. Drive home relaxed, arriving around 5pm.",
            sun: {
                morning: ['sleep-in', 'point-lobos'],
                afternoon: ['stationary'],
                sunset: ['drive-home'],
                homeEta: '~5:00 PM'
            }
        },
        {
            id: 'sun-early-checkout',
            emoji: '🌅',
            name: 'Early Checkout',
            desc: '7am checkout → Calla Lily → home ~1pm',
            story: "Early birds! Check out at 7am and catch Calla Lily Valley in the soft morning light - the lilies are magical this time of year. Stop at Bixby Bridge for photos without the crowds, then grab coffee and pastries at Carmel Bakery before hitting the road. You'll be home by 1pm with the whole afternoon free!",
            sun: {
                morning: ['early-start', 'calla-lily', 'bixby'],
                afternoon: ['carmel-bakery', 'drive-home'],
                sunset: [],
                homeEta: '~1:00 PM'
            }
        },
        {
            id: 'sun-maximize',
            emoji: '🌟',
            name: 'Maximize Sunday',
            desc: 'Full day in Carmel → home ~7pm',
            story: "Make the most of your last day! Explore Point Lobos first (arrive early to beat crowds), then drive the famous 17-Mile Drive through Pebble Beach - see the Lone Cypress, Ghost Trees, and stunning coastline. Enjoy a leisurely brunch at Stationæry, grab picnic supplies at Bruno's, and head home around 4pm. You'll arrive around 7pm, tired but happy!",
            sun: {
                morning: ['point-lobos', '17-mile'],
                afternoon: ['stationary', 'brunos'],
                sunset: ['drive-home'],
                homeEta: '~7:00 PM'
            }
        },
        {
            id: 'sun-carmel-crawl',
            emoji: '🦪',
            name: 'Carmel Crawl',
            desc: 'Food tour through Carmel → home ~6pm',
            story: "A food lover's farewell! Start with pastries at Carmel Bakery (opens 7am), then explore Point Lobos while working up an appetite. Lunch at cozy Carmel Belle for farm-to-table sandwiches, then wander the charming Carmel streets. Late afternoon meal at La Bicyclette for their wood-fired pizzas before heading home around 4pm, arriving by 6pm.",
            sun: {
                morning: ['carmel-bakery', 'point-lobos'],
                afternoon: ['carmel-belle', 'la-bicyclette'],
                sunset: ['drive-home'],
                homeEta: '~6:00 PM'
            }
        },
        {
            id: 'sun-one-more-hike',
            emoji: '🥾',
            name: 'One More Hike',
            desc: 'Early Soberanes hike → home ~4pm',
            story: "One last adventure! Wake early and tackle Soberanes Canyon - a beautiful hike through lush redwoods with ocean views, right near your cabin. Finish by late morning and grab legendary sandwiches at Bruno's in Carmel for the road. You'll be back home by 4pm, leaving time to unpack and rest before the work week.",
            sun: {
                morning: ['early-start', 'soberanes'],
                afternoon: ['brunos', 'drive-home'],
                sunset: [],
                homeEta: '~4:00 PM'
            }
        },
        {
            id: 'sun-late-departure',
            emoji: '🌙',
            name: 'Stay Till Sunset',
            desc: 'Full day + dinner → home ~9pm',
            story: "Squeeze every last drop out of the weekend! Sleep in, then explore Point Lobos in the late morning. Drive the scenic 17-Mile Drive in the afternoon, stopping at Carmel Belle for lunch. End with a proper sit-down dinner at La Bicyclette - their wood-fired pizzas and French-California cuisine are the perfect farewell meal. Drive home under the stars, arriving around 9pm. Worth it!",
            sun: {
                morning: ['sleep-in', 'point-lobos'],
                afternoon: ['17-mile', 'carmel-belle'],
                sunset: ['la-bicyclette', 'drive-home'],
                homeEta: '~9:00 PM'
            }
        }
    ]
};

// Drive time between zones
const zoneToZone = {
    'north-north': 5, 'north-central': 20, 'north-south': 35, 'north-carmel': 25,
    'central-north': 20, 'central-central': 10, 'central-south': 20, 'central-carmel': 35,
    'south-north': 35, 'south-central': 20, 'south-south': 10, 'south-carmel': 55,
    'carmel-north': 25, 'carmel-central': 35, 'carmel-south': 55, 'carmel-carmel': 10
};

// ============ STATE MANAGEMENT ============
let state = {
    currentUser: null,
    users: {},
    sharedData: null,
    isViewingShared: false,
    sidebarFilter: 'all',  // For filtering available items in schedule
    currentScheduleDay: 'saturday',  // Which day is currently shown in schedule
    mapViewMode: 'all',  // 'all' or 'favorites' for discovery map
    sidebarSearch: '',  // Text search filter for sidebar
    zoneFilter: 'all'  // Zone filter: 'all', 'bigsur', 'carmel', 'roadtrip'
};

// ============ LOCAL STORAGE ============
function saveState() {
    if (!state.isViewingShared) {
        localStorage.setItem('bigSurPlanner', JSON.stringify({
            currentUser: state.currentUser,
            users: state.users
        }));
    }
    updateUrlHash();
}

function loadState() {
    const saved = localStorage.getItem('bigSurPlanner');
    if (saved) {
        const data = JSON.parse(saved);
        state.currentUser = data.currentUser;
        state.users = data.users || {};
        return true;
    }
    return false;
}

// ============ URL HASH ENCODING ============
function encodeState() {
    const user = state.users[state.currentUser];
    if (!user) return '';

    const data = {
        u: state.currentUser,
        p: user.currentPlan,
        f: user.favorites || [],
        m: user.mustDos || [],
        n: user.passed || [],
        s: user.plans[user.currentPlan] || {}
    };

    const json = JSON.stringify(data);
    return btoa(encodeURIComponent(json));
}

function decodeState(hash) {
    try {
        const json = decodeURIComponent(atob(hash));
        return JSON.parse(json);
    } catch (e) {
        console.error('Failed to decode hash', e);
        return null;
    }
}

function updateUrlHash() {
    if (!state.isViewingShared && state.currentUser) {
        const encoded = encodeState();
        history.replaceState(null, '', '#' + encoded);
    }
}

function checkUrlHash() {
    const hash = window.location.hash.slice(1);
    if (hash) {
        const data = decodeState(hash);
        if (data && data.u) {
            state.sharedData = data;
            return true;
        }
    }
    return false;
}

// ============ USER MANAGEMENT ============
function createUser(name) {
    state.users[name] = {
        favorites: [],
        mustDos: [],
        passed: [],
        plans: { 'My Trip': createEmptyPlan() },
        currentPlan: 'My Trip'
    };
    state.currentUser = name;
    saveState();
}

function createEmptyPlan() {
    return {
        'fri-afternoon': [],
        'fri-sunset': [],
        'fri-evening': [],
        'sat-morning': [],
        'sat-afternoon': [],
        'sat-sunset': [],
        'sat-evening': [],
        'sun-morning': [],
        'sun-afternoon': [],
        'sun-sunset': []
    };
}

function switchUser(name) {
    state.currentUser = name;
    saveState();
    renderAll();
}

function getCurrentUser() {
    return state.users[state.currentUser];
}

// ============ PREFERENCE MANAGEMENT ============
function setPreference(activityId, pref) {
    const user = getCurrentUser();
    if (!user) return;

    // Remove from all lists first
    user.favorites = user.favorites.filter(id => id !== activityId);
    user.mustDos = user.mustDos.filter(id => id !== activityId);
    user.passed = user.passed.filter(id => id !== activityId);

    // Add to appropriate list
    if (pref === 'star') user.favorites.push(activityId);
    else if (pref === 'heart') user.mustDos.push(activityId);
    else if (pref === 'pass') user.passed.push(activityId);

    saveState();
    renderAll();
}

function getPreference(activityId) {
    const user = getCurrentUser();
    if (!user) return null;
    if (user.mustDos.includes(activityId)) return 'heart';
    if (user.favorites.includes(activityId)) return 'star';
    if (user.passed.includes(activityId)) return 'pass';
    return null;
}

// ============ PLAN MANAGEMENT ============
function createPlan(name) {
    const user = getCurrentUser();
    if (!user) return;
    user.plans[name] = createEmptyPlan();
    user.currentPlan = name;
    saveState();
    renderAll();
}

function switchPlan(name) {
    const user = getCurrentUser();
    if (!user) return;
    user.currentPlan = name;
    saveState();
    renderSchedule();
}

function deletePlan(name) {
    const user = getCurrentUser();
    if (!user) return;
    if (Object.keys(user.plans).length <= 1) {
        showToast("Can't delete your only plan!");
        return;
    }
    delete user.plans[name];
    user.currentPlan = Object.keys(user.plans)[0];
    saveState();
    renderAll();
}

function getCurrentPlan() {
    const user = getCurrentUser();
    if (!user) return null;
    return user.plans[user.currentPlan];
}

function addToBucket(activityId, bucket) {
    const plan = getCurrentPlan();
    if (!plan) return;
    if (!plan[bucket].includes(activityId)) {
        plan[bucket].push(activityId);
        saveState();
        renderSchedule();
    }
}

function removeFromBucket(activityId, bucket) {
    const plan = getCurrentPlan();
    if (!plan) return;
    plan[bucket] = plan[bucket].filter(id => id !== activityId);
    saveState();
    renderSchedule();
}

// ============ RENDERING ============
function renderUserSelector() {
    const select = document.getElementById('userSelect');
    select.innerHTML = '';
    Object.keys(state.users).forEach(name => {
        const opt = document.createElement('option');
        opt.value = name;
        opt.textContent = name;
        if (name === state.currentUser) opt.selected = true;
        select.appendChild(opt);
    });
}

function renderPlanSelector() {
    const user = getCurrentUser();
    if (!user) return;

    const select = document.getElementById('planSelect');
    select.innerHTML = '';
    Object.keys(user.plans).forEach(name => {
        const opt = document.createElement('option');
        opt.value = name;
        opt.textContent = name;
        if (name === user.currentPlan) opt.selected = true;
        select.appendChild(opt);
    });
}

// Category titles and descriptions
const categoryInfo = {
    explore: { emoji: '🧭', title: 'Explore Big Sur', desc: 'Hikes, beaches, scenic stops, and outdoor adventures' },
    experience: { emoji: '✨', title: 'Experiences', desc: 'Seasonal highlights, stargazing, and beach activities' },
    restaurant: { emoji: '🍽️', title: 'Eat & Drink', desc: 'Restaurants, cafes, and places to grab a meal' },
    provisions: { emoji: '🏪', title: 'Supplies', desc: 'Markets and delis for picnic supplies' },
    all: { emoji: '🌊', title: 'All Activities', desc: 'Everything Big Sur has to offer' }
};

function renderActivityGrid() {
    const grid = document.getElementById('activityGrid');
    const activeFilter = document.querySelector('.cat-filter.active').dataset.cat;
    const zoneFilter = state.zoneFilter;
    const user = getCurrentUser();

    // Update category title based on both category and zone
    const titleEl = document.getElementById('categoryTitle');
    if (titleEl) {
        const info = categoryInfo[activeFilter] || categoryInfo.all;
        const zoneNames = { all: '', bigsur: ' in Big Sur', carmel: ' in Carmel', roadtrip: ' On the Way' };
        const zoneSuffix = zoneNames[zoneFilter] || '';
        titleEl.innerHTML = `
            <h3>${info.emoji} ${info.title}${zoneSuffix}</h3>
            <p class="category-desc">${info.desc}</p>
        `;
    }

    grid.innerHTML = '';

    // Filter and sort activities
    const filtered = activities.filter(act => {
        // Hide Easter egg and travel/lifestyle items from discovery
        if (act.id === 'bigfoot') return false;
        if (act.cat === 'travel') return false;
        if (act.cat === 'lifestyle') return false;

        const pref = getPreference(act.id);
        // Don't show passed items in main grid
        if (pref === 'pass') return false;

        // Filter by category
        if (activeFilter !== 'all' && act.cat !== activeFilter) return false;

        // Filter by zone
        if (zoneFilter !== 'all') {
            if (zoneFilter === 'bigsur') {
                // Big Sur = north, central, south zones
                if (!['north', 'central', 'south'].includes(act.zone)) return false;
            } else if (zoneFilter === 'carmel') {
                if (act.zone !== 'carmel') return false;
            } else if (zoneFilter === 'roadtrip') {
                if (act.zone !== 'roadtrip') return false;
            }
        }

        return true;
    });

    filtered.forEach(act => {
        const pref = getPreference(act.id);

        const card = document.createElement('div');
        card.className = 'activity-card';
        card.dataset.id = act.id;

        // Add hover handlers for map highlight (only if activity has coords)
        if (act.coords) {
            card.addEventListener('mouseenter', () => highlightMarkerOnMap(act.id));
            card.addEventListener('mouseleave', () => unhighlightMarker());
        }

        // Use subtype for tag styling if available
        const tagClass = 'tag-' + (act.subtype || act.cat);

        // Show subtype icon for explore items
        let subtypeIcon = '';
        if (act.cat === 'explore') {
            if (act.subtype === 'hike') subtypeIcon = '🥾';
            else if (act.subtype === 'beach') subtypeIcon = '🏖️';
            else if (act.subtype === 'coastal') subtypeIcon = '🌊';
            else if (act.subtype === 'scenic') subtypeIcon = '📸';
            else if (act.subtype === 'culture') subtypeIcon = '📚';
        }

        card.innerHTML = `
            <div class="card-header">
                <span class="card-emoji">${act.emoji}</span>
                <div class="card-info">
                    <div class="card-name">${act.name}</div>
                    <div class="card-meta">
                        ${subtypeIcon ? `<span class="subtype-icon">${subtypeIcon}</span>` : ''}
                        <span class="tag ${tagClass}">${act.tag}</span>
                        ${act.duration ? `<span>${act.duration}h</span>` : ''}
                        ${act.miles ? `<span>${act.miles}mi</span>` : ''}
                        ${act.price ? `<span>${act.price}</span>` : ''}
                    </div>
                </div>
            </div>
            <div class="card-desc">${act.desc}</div>
            <div class="card-actions">
                <button class="pref-btn heart ${pref === 'heart' ? 'active' : ''}" data-pref="heart">❤️ Must-Do</button>
                <button class="pref-btn star ${pref === 'star' ? 'active' : ''}" data-pref="star">⭐ Interested</button>
                <button class="pref-btn pass ${pref === 'pass' ? 'active' : ''}" data-pref="pass">🚫 Pass</button>
            </div>
        `;

        grid.appendChild(card);
    });

    // Render passed items section
    renderPassedItems();

    // Update map with favorites (filtered by current category)
    renderFavoritesMap(activeFilter);
}

function renderPassedItems() {
    const user = getCurrentUser();
    let passedSection = document.getElementById('passedSection');

    if (!user || user.passed.length === 0) {
        if (passedSection) passedSection.remove();
        return;
    }

    if (!passedSection) {
        passedSection = document.createElement('div');
        passedSection.id = 'passedSection';
        passedSection.className = 'passed-section';
        document.getElementById('activityGrid').parentNode.appendChild(passedSection);
    }

    let html = `<h3>Passed (${user.passed.length})</h3><div class="passed-grid">`;

    user.passed.forEach(id => {
        const act = activities.find(a => a.id === id);
        if (!act) return;

        html += `
            <div class="passed-item" data-id="${id}">
                <span class="item-emoji">${act.emoji}</span>
                <span class="item-name">${act.name}</span>
                <button class="undo-btn" data-id="${id}">Undo</button>
            </div>
        `;
    });

    html += '</div>';
    passedSection.innerHTML = html;

    // Add undo handlers
    passedSection.querySelectorAll('.undo-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            setPreference(btn.dataset.id, null);
        });
    });
}

function renderHighlightsSummary() {
    const user = getCurrentUser();
    const list = document.getElementById('highlightsList');

    if (!user || (user.favorites.length === 0 && user.mustDos.length === 0)) {
        list.innerHTML = '<span class="highlights-empty">Mark activities below to build your list</span>';
        return;
    }

    let html = '';

    user.mustDos.forEach(id => {
        const act = activities.find(a => a.id === id);
        if (act) html += `<span class="highlight-chip heart">❤️ ${act.name}</span>`;
    });

    user.favorites.forEach(id => {
        const act = activities.find(a => a.id === id);
        if (act) html += `<span class="highlight-chip star">⭐ ${act.name}</span>`;
    });

    list.innerHTML = html;
}

function renderPassedSummary() {
    const user = getCurrentUser();
    const container = document.getElementById('passedSummary');

    if (!user || user.passed.length === 0) {
        container.innerHTML = '';
        container.classList.add('hidden');
        return;
    }

    container.classList.remove('hidden');

    let html = `<h3>🚫 Passed (${user.passed.length})</h3><div class="passed-chips">`;

    user.passed.forEach(id => {
        const act = activities.find(a => a.id === id);
        if (act) {
            html += `<span class="passed-chip" data-id="${id}">${act.emoji} ${act.name} <span class="undo">↩</span></span>`;
        }
    });

    html += '</div>';
    container.innerHTML = html;

    // Add click handlers to undo
    container.querySelectorAll('.passed-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            setPreference(chip.dataset.id, null);
        });
    });
}

// ============ DAY TAB SWITCHING ============
function switchScheduleDay(day) {
    state.currentScheduleDay = day;

    // Update tab buttons
    document.querySelectorAll('.day-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.day === day);
    });

    // Update panels
    document.querySelectorAll('.day-panel').forEach(panel => {
        panel.classList.toggle('active', panel.dataset.day === day);
    });

    // Re-render the itinerary map for the new day
    renderItineraryMap();
}

// ============ FAVORITES MAP ============
let favoritesMap = null;
let favoritesBounds = [];
let favoritesMarkers = {}; // Store markers by activity ID for hover highlight
let highlightedMarker = null; // Track currently highlighted marker

// Cabin/Airbnb location at Garrapata
const CABIN_COORDS = [36.4583, -121.9217];

function renderFavoritesMap(categoryFilter = 'all') {
    const user = getCurrentUser();
    const mapWrapper = document.getElementById('mapWrapper');
    const mapCanvas = document.getElementById('mapCanvas');
    const mapPlaceholder = document.getElementById('mapPlaceholder');
    const mapLegend = document.getElementById('mapLegend');
    const mapTitle = document.getElementById('favoritesMapTitle');
    const viewMode = state.mapViewMode; // 'all' or 'favorites'

    if (!mapWrapper || !mapCanvas) return;

    // Update map title based on category filter
    if (mapTitle) {
        const info = categoryInfo[categoryFilter] || categoryInfo.all;
        if (categoryFilter === 'all') {
            mapTitle.textContent = '🗺️ Activities';
        } else {
            mapTitle.textContent = `🗺️ Activities (${info.title})`;
        }
    }

    // Get activities to show on map based on view mode
    const mapItems = [];
    if (user) {
        // Get all activities (excluding travel, lifestyle, bigfoot)
        const allActivities = activities.filter(act =>
            act.coords &&
            act.cat !== 'travel' &&
            act.cat !== 'lifestyle' &&
            act.id !== 'bigfoot'
        );

        allActivities.forEach(act => {
            // Apply category filter
            if (categoryFilter !== 'all' && act.cat !== categoryFilter) return;

            const pref = getPreference(act.id);

            // In "favorites" mode, only show starred/hearted items
            if (viewMode === 'favorites' && pref !== 'star' && pref !== 'heart') return;

            mapItems.push({ ...act, pref });
        });
    }

    // Always show map if we have cabin (even with no items)
    mapPlaceholder.classList.add('hidden');

    // Initialize map if not exists
    if (!favoritesMap) {
        favoritesMap = L.map(mapCanvas, {
            scrollWheelZoom: false
        }).setView([36.35, -121.85], 10);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap'
        }).addTo(favoritesMap);
    }

    // Clear existing markers and marker references
    favoritesMap.eachLayer(layer => {
        if (layer instanceof L.Marker || layer instanceof L.Polyline) {
            favoritesMap.removeLayer(layer);
        }
    });
    favoritesMarkers = {}; // Reset marker references
    highlightedMarker = null;

    // Subtype colors for explore
    const subtypeColors = {
        hike: '#2d7d5f', beach: '#0ea5e9', coastal: '#14b8a6', scenic: '#eab308',
        culture: '#8b5cf6', seasonal: '#ec4899', stargazing: '#6366f1',
        'beach-activity': '#06b6d4', dining: '#f97316', cafe: '#d97706',
        deli: '#8b5a3c', takeout: '#f472b6', store: '#78716c', roadstop: '#3b82f6', adventure: '#10b981'
    };

    // Category colors fallback
    const catColors = {
        explore: '#2d7d5f', experience: '#ec4899', restaurant: '#f97316', provisions: '#8b5a3c'
    };

    // Add markers
    const bounds = [];
    const usedSubtypes = new Set();

    // Always add cabin/home marker first
    const homeIcon = L.divIcon({
        className: 'custom-marker home-marker',
        html: '🏠',
        iconSize: [36, 36],
        iconAnchor: [18, 18]
    });
    L.marker(CABIN_COORDS, { icon: homeIcon })
        .addTo(favoritesMap)
        .bindPopup('<strong>🏠 Your Cabin</strong><br>Garrapata area - home base for the weekend!');
    bounds.push(CABIN_COORDS);

    mapItems.forEach(act => {
        const subtype = act.subtype || act.cat;
        const color = subtypeColors[subtype] || catColors[act.cat] || '#666';
        usedSubtypes.add(subtype);

        // Determine marker class based on preference
        let markerClass = '';
        if (act.pref === 'heart') markerClass = 'heart-marker';
        else if (act.pref === 'star') markerClass = 'star-marker';
        else if (act.pref === 'pass') markerClass = 'passed-marker';
        // else: no special class (neutral)

        const icon = L.divIcon({
            className: 'custom-marker ' + markerClass,
            html: act.emoji,
            iconSize: [32, 32],
            iconAnchor: [16, 16]
        });

        const marker = L.marker([act.coords[0], act.coords[1]], { icon })
            .addTo(favoritesMap)
            .bindPopup(`<strong>${act.emoji} ${act.name}</strong><br>${act.desc}`);

        // Store marker reference for hover highlighting
        favoritesMarkers[act.id] = {
            marker: marker,
            coords: [act.coords[0], act.coords[1]],
            originalClass: 'custom-marker ' + markerClass
        };

        bounds.push([act.coords[0], act.coords[1]]);
    });

    // Store bounds for refit button
    favoritesBounds = bounds;

    // Fit bounds
    if (bounds.length > 1) {
        favoritesMap.fitBounds(bounds, { padding: [30, 30] });
    } else if (bounds.length === 1) {
        favoritesMap.setView(bounds[0], 12);
    }

    // Update legend with subtypes
    const subtypeNames = {
        hike: 'Hikes', beach: 'Beaches', coastal: 'Coastal', scenic: 'Scenic',
        culture: 'Culture', seasonal: 'Seasonal', stargazing: 'Stargazing',
        'beach-activity': 'Beach Time', dining: 'Dining', cafe: 'Cafes',
        deli: 'Delis', takeout: 'Sunset Takeout', store: 'Stores'
    };
    let legendHtml = '<div class="map-legend-item"><span class="map-legend-dot home"></span>Cabin</div>';
    usedSubtypes.forEach(subtype => {
        const name = subtypeNames[subtype] || subtype.charAt(0).toUpperCase() + subtype.slice(1);
        legendHtml += `<div class="map-legend-item"><span class="map-legend-dot ${subtype}"></span>${name}</div>`;
    });
    mapLegend.innerHTML = legendHtml;
}

function refitFavoritesMap() {
    if (favoritesMap && favoritesBounds.length > 0) {
        if (favoritesBounds.length > 1) {
            favoritesMap.fitBounds(favoritesBounds, { padding: [30, 30] });
        } else {
            favoritesMap.setView(favoritesBounds[0], 12);
        }
    }
}

// Highlight marker on map when hovering over activity card
function highlightMarkerOnMap(activityId) {
    const markerInfo = favoritesMarkers[activityId];
    if (!markerInfo || !favoritesMap) return;

    // Remove previous highlight
    unhighlightMarker();

    // Store reference
    highlightedMarker = markerInfo;

    // Add highlight class to marker
    const markerElement = markerInfo.marker.getElement();
    if (markerElement) {
        markerElement.classList.add('hover-highlight');
    }

    // Smooth fly to the marker location - cinematic pan+zoom
    favoritesMap.flyTo(markerInfo.coords, 13, {
        animate: true,
        duration: 1.2,  // seconds for the animation
        easeLinearity: 0.25  // smoother curve
    });

    // Open popup after a slight delay so it appears at destination
    setTimeout(() => {
        if (highlightedMarker === markerInfo) {
            markerInfo.marker.openPopup();
        }
    }, 800);
}

function unhighlightMarker() {
    if (highlightedMarker) {
        const markerElement = highlightedMarker.marker.getElement();
        if (markerElement) {
            markerElement.classList.remove('hover-highlight');
        }
        highlightedMarker.marker.closePopup();
        highlightedMarker = null;
    }
}

// ============ ITINERARY MAP ============
let itineraryMap = null;
let routeLines = [];
let itineraryBounds = [];

function renderItineraryMap() {
    const plan = getCurrentPlan();
    const mapWrapper = document.getElementById('itineraryMapWrapper');
    const mapCanvas = document.getElementById('itineraryMapCanvas');
    const mapPlaceholder = document.getElementById('itineraryMapPlaceholder');
    const legend = document.getElementById('itineraryLegend');

    if (!mapWrapper || !mapCanvas) return;

    // Get activities for the current day
    const day = state.currentScheduleDay;
    let dayBuckets;
    if (day === 'friday') {
        dayBuckets = ['fri-afternoon', 'fri-sunset', 'fri-evening'];
    } else if (day === 'saturday') {
        dayBuckets = ['sat-morning', 'sat-afternoon', 'sat-sunset', 'sat-evening'];
    } else {
        dayBuckets = ['sun-morning', 'sun-afternoon', 'sun-sunset'];
    }

    // Collect all activities with coordinates for this day
    const stops = [];
    if (plan) {
        dayBuckets.forEach(bucket => {
            (plan[bucket] || []).forEach(id => {
                const act = activities.find(a => a.id === id);
                if (act && act.coords) {
                    stops.push(act);
                }
            });
        });
    }

    // Update the map title based on current day
    const dayNames = { friday: 'Friday', saturday: 'Saturday', sunday: 'Sunday' };
    const mapTitle = document.querySelector('#itineraryMapContainer h3');
    if (mapTitle) {
        mapTitle.textContent = `🗺️ ${dayNames[day]}'s Route`;
    }

    // Always show map with cabin even if no stops
    if (mapPlaceholder) mapPlaceholder.classList.add('hidden');

    // Initialize map if not exists
    if (!itineraryMap) {
        itineraryMap = L.map(mapCanvas, {
            scrollWheelZoom: false
        }).setView([36.35, -121.85], 10);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap'
        }).addTo(itineraryMap);
    }

    // Clear existing markers and lines
    itineraryMap.eachLayer(layer => {
        if (layer instanceof L.Marker || layer instanceof L.Polyline) {
            itineraryMap.removeLayer(layer);
        }
    });

    // Add numbered markers and route lines
    const bounds = [];
    const routeColors = ['#0ea5e9', '#f97316', '#2d7d5f', '#ec4899'];

    // Always add cabin/home marker
    const homeIcon = L.divIcon({
        className: 'custom-marker home-marker',
        html: '🏠',
        iconSize: [36, 36],
        iconAnchor: [18, 18]
    });
    L.marker(CABIN_COORDS, { icon: homeIcon })
        .addTo(itineraryMap)
        .bindPopup('<strong>🏠 Your Cabin</strong><br>Home base for the weekend!');
    bounds.push(CABIN_COORDS);

    stops.forEach((act, index) => {
        const color = routeColors[index % routeColors.length];

        // Skip adding travel items to map (San Rafael is too far)
        if (act.zone === 'home') return;

        // Create numbered marker
        const icon = L.divIcon({
            className: 'itinerary-marker',
            html: `<div class="itinerary-marker-inner" style="background:${color}">${index + 1}</div>`,
            iconSize: [28, 28],
            iconAnchor: [14, 14]
        });

        L.marker([act.coords[0], act.coords[1]], { icon })
            .addTo(itineraryMap)
            .bindPopup(`<strong>${index + 1}. ${act.emoji} ${act.name}</strong><br>${act.desc}`);

        bounds.push([act.coords[0], act.coords[1]]);

        // Draw line to next stop (skip if next is home zone)
        if (index < stops.length - 1) {
            const nextAct = stops[index + 1];
            if (nextAct.zone !== 'home') {
                L.polyline(
                    [[act.coords[0], act.coords[1]], [nextAct.coords[0], nextAct.coords[1]]],
                    { color: color, weight: 3, opacity: 0.7, dashArray: '10, 5' }
                ).addTo(itineraryMap);
            }
        }
    });

    // Store bounds for refit
    itineraryBounds = bounds;

    // Fit bounds
    if (bounds.length > 1) {
        itineraryMap.fitBounds(bounds, { padding: [40, 40] });
    } else if (bounds.length === 1) {
        itineraryMap.setView(bounds[0], 12);
    }

    // Update legend with route steps
    let legendHtml = '';
    stops.forEach((act, index) => {
        legendHtml += `
            <div class="itinerary-step">
                <span class="step-num">${index + 1}</span>
                <span>${act.emoji} ${act.name}</span>
            </div>
        `;
    });
    if (legend) legend.innerHTML = legendHtml;
}

function refitItineraryMap() {
    if (itineraryMap && itineraryBounds.length > 0) {
        if (itineraryBounds.length > 1) {
            itineraryMap.fitBounds(itineraryBounds, { padding: [40, 40] });
        } else {
            itineraryMap.setView(itineraryBounds[0], 12);
        }
    }
}

function toggleTemplates(day) {
    const picker = document.getElementById(day + 'Templates');
    if (picker) {
        picker.classList.toggle('expanded');
        // Update the Show/Hide text
        const toggleText = picker.querySelector('.toggle-text');
        if (toggleText) {
            toggleText.textContent = picker.classList.contains('expanded') ? 'Hide' : 'Show';
        }
    }
}

function renderTemplates() {
    // Render templates into each day's inline container
    ['friday', 'saturday', 'sunday'].forEach(day => {
        const container = document.querySelector(`.template-options-inline[data-day="${day}"]`);
        if (!container) return;

        const templates = templatePlans[day] || [];
        let html = '';

        templates.forEach(t => {
            // Build description for tooltip
            let desc = t.desc;
            if (t.fri?.departure) desc = `Leave ${t.fri.departure} → ${desc}`;
            if (t.sun?.homeEta) desc = `${desc} → Home ${t.sun.homeEta}`;

            html += `
                <button class="template-chip" data-template="${t.id}" data-desc="${desc}">
                    <span class="chip-emoji">${t.emoji}</span>
                    ${t.name}
                </button>
            `;
        });

        container.innerHTML = html;

        // Add click handlers
        container.querySelectorAll('.template-chip').forEach(chip => {
            chip.addEventListener('click', () => {
                applyTemplate(chip.dataset.template);
                // Collapse after applying
                const picker = chip.closest('.template-picker');
                if (picker) picker.classList.remove('expanded');
            });
        });
    });
}

function applyTemplate(templateId) {
    const user = getCurrentUser();
    if (!user) return;

    // Find the template
    let template = null;
    let templateDay = null;
    for (const day of Object.keys(templatePlans)) {
        template = templatePlans[day].find(t => t.id === templateId);
        if (template) {
            templateDay = day;
            break;
        }
    }

    if (!template) return;

    // Only populate the schedule - don't modify favorites!
    // User's favorites are their personal preferences, separate from schedule
    const plan = getCurrentPlan();

    if (template.fri) {
        plan['fri-afternoon'] = [...(template.fri.afternoon || [])];
        plan['fri-sunset'] = [...(template.fri.sunset || [])];
        plan['fri-evening'] = [...(template.fri.evening || [])];
    }
    if (template.sat) {
        plan['sat-morning'] = [...(template.sat.morning || [])];
        plan['sat-afternoon'] = [...(template.sat.afternoon || [])];
        plan['sat-sunset'] = [...(template.sat.sunset || [])];
        plan['sat-evening'] = [...(template.sat.evening || [])];
    }
    if (template.sun) {
        plan['sun-morning'] = [...(template.sun.morning || [])];
        plan['sun-afternoon'] = [...(template.sun.afternoon || [])];
        plan['sun-sunset'] = [...(template.sun.sunset || [])];
    }

    saveState();
    renderAll();

    // Show the story description if available
    if (template.story) {
        showStoryModal(template.emoji, template.name, template.story);
    } else {
        showToast(`📅 Loaded "${template.name}" schedule!`);
    }
}

function renderAvailableItems() {
    const user = getCurrentUser();
    const container = document.getElementById('availableItems');

    if (!user) {
        container.innerHTML = '<p class="bucket-empty">Create your profile first!</p>';
        return;
    }

    // Get all non-passed items (include lifestyle, exclude travel)
    const available = activities.filter(act => {
        if (act.id === 'bigfoot') return false;
        if (act.cat === 'travel') return false; // Travel items handled separately
        return !user.passed.includes(act.id);
    });

    // Filter by sidebar category
    let filtered = state.sidebarFilter === 'all'
        ? available
        : available.filter(act => act.cat === state.sidebarFilter);

    // Apply text search filter
    const searchTerm = state.sidebarSearch.toLowerCase().trim();
    if (searchTerm) {
        filtered = filtered.filter(act =>
            act.name.toLowerCase().includes(searchTerm) ||
            act.desc.toLowerCase().includes(searchTerm) ||
            (act.tag && act.tag.toLowerCase().includes(searchTerm))
        );
    }

    let html = '';

    // Add travel items at the top when showing "all"
    if (state.sidebarFilter === 'all') {
        const leaveSf = activities.find(a => a.id === 'leave-san-rafael');
        const driveHome = activities.find(a => a.id === 'drive-home');

        if (leaveSf) {
            html += `
                <div class="available-item travel-item" draggable="true" data-id="leave-san-rafael">
                    <div class="item-name">
                        <span>${leaveSf.emoji}</span>
                        ${leaveSf.name}
                    </div>
                    <div class="item-time">~2.5h drive</div>
                </div>
            `;
        }
        if (driveHome) {
            html += `
                <div class="available-item travel-item" draggable="true" data-id="drive-home">
                    <div class="item-name">
                        <span>${driveHome.emoji}</span>
                        ${driveHome.name}
                    </div>
                    <div class="item-time">~2h drive</div>
                </div>
            `;
        }
    }

    // Add lifestyle items prominently when showing "all" or "lifestyle"
    if (state.sidebarFilter === 'all' || state.sidebarFilter === 'lifestyle') {
        const lifestyleItems = activities.filter(a => a.cat === 'lifestyle');
        lifestyleItems.forEach(act => {
            html += `
                <div class="available-item lifestyle-item" draggable="true" data-id="${act.id}">
                    <div class="item-name">
                        <span>${act.emoji}</span>
                        ${act.name}
                    </div>
                    <div class="item-time">${act.duration}h • ${act.tag}</div>
                </div>
            `;
        });
    }

    // Filter out lifestyle from the main list to avoid duplicates
    const nonLifestyle = filtered.filter(act => act.cat !== 'lifestyle');

    if (nonLifestyle.length === 0 && !html) {
        container.innerHTML = '<p class="bucket-empty">No items in this category</p>';
        return;
    }

    // Sort: must-dos first, then favorites, then others
    const sorted = [...nonLifestyle].sort((a, b) => {
        const prefA = getPreference(a.id);
        const prefB = getPreference(b.id);
        const order = { heart: 0, star: 1, null: 2 };
        return (order[prefA] ?? 2) - (order[prefB] ?? 2);
    });

    sorted.forEach(act => {
        const pref = getPreference(act.id);
        const prefBadge = pref === 'heart' ? '❤️' : pref === 'star' ? '⭐' : '';

        html += `
            <div class="available-item" draggable="true" data-id="${act.id}">
                <div class="item-name">
                    <span>${act.emoji}</span>
                    ${act.name}
                    ${prefBadge ? `<span class="pref-badge">${prefBadge}</span>` : ''}
                </div>
                <div class="item-time">${act.duration}h${act.zone ? ' • ' + act.zone : ''}</div>
            </div>
        `;
    });

    container.innerHTML = html;

    // Add drag handlers
    container.querySelectorAll('.available-item').forEach(item => {
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragend', handleDragEnd);
    });
}

function renderSchedule() {
    const plan = getCurrentPlan();
    const allBuckets = [
        'fri-afternoon', 'fri-sunset', 'fri-evening',
        'sat-morning', 'sat-afternoon', 'sat-sunset', 'sat-evening',
        'sun-morning', 'sun-afternoon', 'sun-sunset'
    ];

    allBuckets.forEach(bucket => {
        const container = document.querySelector(`.bucket-items[data-bucket="${bucket}"]`);
        if (!container) return; // Skip if bucket doesn't exist in DOM

        const items = plan ? (plan[bucket] || []) : [];

        if (items.length === 0) {
            container.innerHTML = '<div class="bucket-empty">Drop activities here</div>';
            return;
        }

        let html = '';
        items.forEach(id => {
            const act = activities.find(a => a.id === id);
            if (!act) return;

            const pref = getPreference(id);
            const prefBadge = pref === 'heart' ? '❤️' : pref === 'star' ? '⭐' : '';

            html += `
                <div class="scheduled-item" draggable="true" data-id="${id}" data-bucket="${bucket}">
                    <span class="item-emoji">${act.emoji}</span>
                    <div class="item-info">
                        <div class="item-name">${prefBadge} ${act.name}</div>
                        <div class="item-duration">${act.duration}h</div>
                    </div>
                    <button class="remove-btn" data-id="${id}" data-bucket="${bucket}">×</button>
                </div>
            `;
        });

        container.innerHTML = html;

        // Add drag handlers
        container.querySelectorAll('.scheduled-item').forEach(item => {
            item.addEventListener('dragstart', handleDragStart);
            item.addEventListener('dragend', handleDragEnd);
        });

        // Add remove handlers
        container.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                removeFromBucket(btn.dataset.id, btn.dataset.bucket);
            });
        });
    });

    updateDaySummaries();
    renderItineraryMap();
}

function updateDaySummaries() {
    const plan = getCurrentPlan();
    if (!plan) return;

    // Friday
    const friItems = [
        ...(plan['fri-afternoon'] || []),
        ...(plan['fri-sunset'] || []),
        ...(plan['fri-evening'] || [])
    ];
    let friHours = 0;
    friItems.forEach(id => {
        const act = activities.find(a => a.id === id);
        if (act) friHours += act.duration || 0;
    });

    // Estimate arrival time based on departure
    const hasLeaveSf = plan['fri-afternoon']?.includes('leave-san-rafael');
    const arrivalTime = hasLeaveSf ? '~4pm' : '--';

    const friActivitiesEl = document.getElementById('friActivities');
    const friArrivalEl = document.getElementById('friArrival');
    if (friActivitiesEl) friActivitiesEl.textContent = friItems.length;
    if (friArrivalEl) friArrivalEl.textContent = arrivalTime;

    // Saturday
    const satItems = [
        ...(plan['sat-morning'] || []),
        ...(plan['sat-afternoon'] || []),
        ...(plan['sat-sunset'] || []),
        ...(plan['sat-evening'] || [])
    ];
    let satHours = 0;
    let satDrive = 0;
    let lastZone = 'north';

    satItems.forEach(id => {
        const act = activities.find(a => a.id === id);
        if (act) {
            satHours += act.duration || 0;
            if (act.zone && act.zone !== 'home') {
                const key = `${lastZone}-${act.zone}`;
                satDrive += zoneToZone[key] || 15;
                lastZone = act.zone;
            }
        }
    });

    const satActivitiesEl = document.getElementById('satActivities');
    const satHoursEl = document.getElementById('satHours');
    const satDriveEl = document.getElementById('satDrive');
    if (satActivitiesEl) satActivitiesEl.textContent = satItems.length;
    if (satHoursEl) satHoursEl.textContent = satHours.toFixed(1) + 'h';
    if (satDriveEl) satDriveEl.textContent = satDrive + 'm';

    // Sunday
    const sunItems = [
        ...(plan['sun-morning'] || []),
        ...(plan['sun-afternoon'] || []),
        ...(plan['sun-sunset'] || [])
    ];
    let sunHours = 0;
    let sunDrive = 0;
    lastZone = 'north';

    sunItems.forEach(id => {
        const act = activities.find(a => a.id === id);
        if (act) {
            sunHours += act.duration || 0;
            if (act.zone && act.zone !== 'home') {
                const key = `${lastZone}-${act.zone}`;
                sunDrive += zoneToZone[key] || 15;
                lastZone = act.zone;
            }
        }
    });

    // Calculate home ETA (checkout at 7am + activities + drive home)
    const hasDriveHome = sunItems.includes('drive-home');
    const totalTime = 7 + sunHours + (sunDrive / 60) + (hasDriveHome ? 2 : 0);
    const etaHour = Math.floor(totalTime);
    const etaDisplay = hasDriveHome ? (etaHour > 12 ? `~${etaHour - 12}pm` : `~${etaHour}am`) : '--';

    const sunActivitiesEl = document.getElementById('sunActivities');
    const sunHoursEl = document.getElementById('sunHours');
    const sunEtaEl = document.getElementById('sunEta');
    if (sunActivitiesEl) sunActivitiesEl.textContent = sunItems.length;
    if (sunHoursEl) sunHoursEl.textContent = sunHours.toFixed(1) + 'h';
    if (sunEtaEl) sunEtaEl.textContent = etaDisplay;
}

function renderAll() {
    renderUserSelector();
    renderPlanSelector();
    renderActivityGrid();
    renderHighlightsSummary();
    renderPassedSummary();
    renderTemplates();
    renderAvailableItems();
    renderSchedule();
}

// ============ DRAG AND DROP ============
let draggedItem = null;

function handleDragStart(e) {
    draggedItem = e.target;
    e.target.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', e.target.dataset.id);
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
    document.querySelectorAll('.bucket-items').forEach(b => b.classList.remove('drag-over'));
    draggedItem = null;
}

function handleDragOver(e) {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
}

function handleDragLeave(e) {
    e.currentTarget.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');

    const activityId = e.dataTransfer.getData('text/plain');
    const targetBucket = e.currentTarget.dataset.bucket;

    if (draggedItem && draggedItem.dataset.bucket) {
        removeFromBucket(activityId, draggedItem.dataset.bucket);
    }

    addToBucket(activityId, targetBucket);
}

// ============ EMOJI BURST ANIMATIONS ============
function createEmojiBurst(type, x, y) {
    const container = document.getElementById('emojiBurstContainer');
    if (!container) return;

    const emojis = {
        star: ['⭐', '✨', '🌟', '💫'],
        heart: ['❤️', '💕', '💗', '💖', '💝'],
        pass: ['🙅‍♀️', '🚫', '❌', '👋']
    };

    const particleCount = type === 'pass' ? 5 : 8;
    const emojiSet = emojis[type] || emojis.star;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = `emoji-particle ${type}`;
        particle.textContent = emojiSet[Math.floor(Math.random() * emojiSet.length)];

        // Random trajectory
        const angle = (Math.PI * 2 * i) / particleCount + Math.random() * 0.5;
        const distance = 80 + Math.random() * 60;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance - 30; // Bias upward
        const rot = (Math.random() - 0.5) * 720;

        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.setProperty('--tx', `${tx}px`);
        particle.style.setProperty('--ty', `${ty}px`);
        particle.style.setProperty('--rot', `${rot}deg`);

        container.appendChild(particle);

        // Remove after animation
        setTimeout(() => particle.remove(), 1000);
    }
}

// ============ SEA CREATURES ============
let seaCreatureTimeout = null;

function spawnSeaCreature() {
    const container = document.getElementById('seaCreatures');
    if (!container) return;

    // Random creature type
    const isWhale = Math.random() < 0.3; // 30% chance for whale
    const creature = document.createElement('div');
    creature.className = `sea-creature ${isWhale ? 'whale' : 'otter'}`;
    creature.textContent = isWhale ? '🐋' : '🦦';

    // Add click handler for explosion
    creature.addEventListener('click', (e) => {
        e.stopPropagation();
        createCreatureExplosion(isWhale ? '🐋' : '🦦', e.clientX, e.clientY, isWhale);
        creature.remove();
    });

    container.appendChild(creature);

    // Remove after animation completes
    const duration = isWhale ? 35000 : 25000;
    setTimeout(() => creature.remove(), duration);

    // Schedule next creature
    scheduleNextCreature();
}

function createCreatureExplosion(emoji, x, y, isWhale) {
    const container = document.createElement('div');
    container.className = 'creature-explosion';
    container.style.left = x + 'px';
    container.style.top = y + 'px';
    document.body.appendChild(container);

    // Create explosion particles
    const particleCount = isWhale ? 12 : 15;
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = `explosion-particle ${isWhale ? 'whale' : ''}`;
        particle.textContent = emoji;

        // Random trajectory
        const angle = (Math.PI * 2 * i) / particleCount + Math.random() * 0.5;
        const distance = 100 + Math.random() * 150;
        const ex = Math.cos(angle) * distance;
        const ey = Math.sin(angle) * distance - 50; // Bias upward
        const rot = (Math.random() - 0.5) * 720;

        particle.style.setProperty('--ex', `${ex}px`);
        particle.style.setProperty('--ey', `${ey}px`);
        particle.style.setProperty('--erot', `${rot}deg`);

        container.appendChild(particle);
    }

    // Add splash text
    const splash = document.createElement('div');
    splash.className = 'explosion-particle';
    splash.textContent = isWhale ? '🌊 SPLASH! 🌊' : '🌊 Boop! 🌊';
    splash.style.fontSize = '1.5rem';
    splash.style.whiteSpace = 'nowrap';
    splash.style.setProperty('--ex', '0px');
    splash.style.setProperty('--ey', '-80px');
    splash.style.setProperty('--erot', '0deg');
    container.appendChild(splash);

    // Remove after animation
    setTimeout(() => container.remove(), 1500);
}

function scheduleNextCreature() {
    // Random interval between 30 seconds and 1.5 minutes
    const delay = 30000 + Math.random() * 60000;
    seaCreatureTimeout = setTimeout(spawnSeaCreature, delay);
}

function startSeaCreatures() {
    // First creature after 5-15 seconds
    const initialDelay = 5000 + Math.random() * 10000;
    seaCreatureTimeout = setTimeout(spawnSeaCreature, initialDelay);
}

// ============ CLEAR DATA ============
function clearCurrentUserData() {
    const userName = state.currentUser;
    const userCount = Object.keys(state.users).length;

    if (userCount === 0) {
        showToast('No data to clear!');
        return;
    }

    // Show explanatory toast first
    showToast(`🗑️ This will clear ${userName}'s favorites, plans & selections from your browser.`);

    setTimeout(() => {
        if (confirm(`Clear all data for "${userName}"? This removes their favorites, plans, and selections from your local browser. You can start fresh!`)) {
            // Remove current user
            delete state.users[userName];

            // Check if there are other users
            const remainingUsers = Object.keys(state.users);

            if (remainingUsers.length > 0) {
                // Switch to next available user
                state.currentUser = remainingUsers[0];
                saveState();
                renderAll();
                showToast(`✓ Cleared ${userName}'s data. Now viewing ${state.currentUser}'s plan.`);
            } else {
                // No users left - clear everything and show welcome modal
                localStorage.removeItem('bigSurPlanner');
                window.location.hash = '';
                window.location.reload();
            }
        }
    }, 100);
}

// ============ SHARING ============
function shareCurrentPlan() {
    const url = window.location.origin + window.location.pathname + '#' + encodeState();
    navigator.clipboard.writeText(url).then(() => {
        showToast('📋 Link copied! Share it with your adventure buddy.');
    }).catch(() => {
        showToast('Failed to copy link');
    });
}

function importSharedPlan() {
    if (!state.sharedData) return;

    const data = state.sharedData;
    const sharedUserName = data.u;

    // Create a unique user name if one already exists
    let newUserName = sharedUserName;
    let counter = 1;
    while (state.users[newUserName]) {
        newUserName = `${sharedUserName} (${counter})`;
        counter++;
    }

    // Create a new user with the shared data
    state.users[newUserName] = {
        favorites: [...(data.f || [])],
        mustDos: [...(data.m || [])],
        passed: [...(data.n || [])],
        plans: { [data.p]: data.s || createEmptyPlan() },
        currentPlan: data.p
    };

    // Switch to the new user
    state.currentUser = newUserName;

    state.isViewingShared = false;
    state.sharedData = null;

    document.getElementById('importModal').classList.add('hidden');
    window.location.hash = '';

    saveState();
    renderAll();
    showToast(`✅ Imported as ${newUserName}!`);

    // Show bounce animation on user selector to highlight switching
    highlightUserSelector();
}

function dismissSharedView() {
    state.isViewingShared = false;
    state.sharedData = null;
    document.getElementById('importModal').classList.add('hidden');
    window.location.hash = '';
    renderAll();
}

function highlightUserSelector() {
    const userSelector = document.querySelector('.user-selector');
    if (!userSelector) return;

    // Add attention class for bounce animation
    userSelector.classList.add('attention');

    // Create and show tooltip
    const tooltip = document.createElement('div');
    tooltip.className = 'user-selector-tooltip';
    tooltip.textContent = 'Switch profiles here!';
    userSelector.appendChild(tooltip);

    // Remove after animation completes
    setTimeout(() => {
        userSelector.classList.remove('attention');
        tooltip.remove();
    }, 4000);
}

function showImportModal(data) {
    const modal = document.getElementById('importModal');
    const authorEl = document.getElementById('importAuthor');
    const nameEl = document.getElementById('importAsName');
    const previewEl = document.getElementById('importPreview');

    // Set the author info
    authorEl.textContent = `${data.u}'s ${data.p}`;
    nameEl.textContent = data.u;

    // Build preview stats
    const favCount = (data.f || []).length;
    const mustDoCount = (data.m || []).length;
    const scheduleCount = Object.values(data.s || {}).flat().length;

    previewEl.innerHTML = `
        <div class="import-preview-stats">
            ${mustDoCount > 0 ? `<div class="import-preview-stat"><span class="emoji">❤️</span> <span class="count">${mustDoCount}</span> must-dos</div>` : ''}
            ${favCount > 0 ? `<div class="import-preview-stat"><span class="emoji">⭐</span> <span class="count">${favCount}</span> favorites</div>` : ''}
            ${scheduleCount > 0 ? `<div class="import-preview-stat"><span class="emoji">📅</span> <span class="count">${scheduleCount}</span> scheduled</div>` : ''}
            ${favCount === 0 && mustDoCount === 0 && scheduleCount === 0 ? '<div class="import-preview-stat">Empty plan - start fresh!</div>' : ''}
        </div>
    `;

    modal.classList.remove('hidden');
}

// ============ TOAST ============
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

function showStoryModal(emoji, name, story) {
    // Create modal if it doesn't exist
    let modal = document.getElementById('storyModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'storyModal';
        modal.className = 'story-modal-overlay';
        modal.innerHTML = `
            <div class="story-modal">
                <div class="story-header">
                    <span class="story-emoji"></span>
                    <span class="story-title"></span>
                </div>
                <p class="story-content"></p>
                <button class="story-close-btn">Got it!</button>
            </div>
        `;
        document.body.appendChild(modal);

        // Close on button click or overlay click
        modal.querySelector('.story-close-btn').addEventListener('click', () => {
            modal.classList.remove('show');
        });
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.remove('show');
        });
    }

    // Populate and show
    modal.querySelector('.story-emoji').textContent = emoji;
    modal.querySelector('.story-title').textContent = name;
    modal.querySelector('.story-content').textContent = story;
    modal.classList.add('show');
}

// ============ EVENT LISTENERS ============
document.addEventListener('DOMContentLoaded', () => {
    const hasSharedData = checkUrlHash();
    const hasLocalState = loadState();

    if (hasSharedData && state.sharedData) {
        state.isViewingShared = true;

        if (!hasLocalState) {
            // New user - show welcome modal first, import modal after
            document.getElementById('welcomeModal').classList.remove('hidden');
        } else {
            // Existing user - show import modal immediately
            document.getElementById('welcomeModal').classList.add('hidden');
            showImportModal(state.sharedData);
            renderAll();
        }
    } else if (hasLocalState) {
        document.getElementById('welcomeModal').classList.add('hidden');
        renderAll();
    }

    // Welcome modal
    const userNameInput = document.getElementById('userName');
    const startBtn = document.getElementById('startBtn');

    userNameInput.addEventListener('input', () => {
        startBtn.disabled = !userNameInput.value.trim();
    });

    startBtn.addEventListener('click', () => {
        const name = userNameInput.value.trim();
        if (name) {
            createUser(name);
            document.getElementById('welcomeModal').classList.add('hidden');
            renderAll();

            // If there's shared data, show the import modal
            if (state.sharedData) {
                showImportModal(state.sharedData);
            }
        }
    });

    userNameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !startBtn.disabled) startBtn.click();
    });

    // Add user modal
    const newUserInput = document.getElementById('newUserName');
    const addUserBtn = document.getElementById('addUserBtn');

    newUserInput.addEventListener('input', () => {
        addUserBtn.disabled = !newUserInput.value.trim();
    });

    addUserBtn.addEventListener('click', () => {
        const name = newUserInput.value.trim();
        if (name && !state.users[name]) {
            createUser(name);
            document.getElementById('addUserModal').classList.add('hidden');
            newUserInput.value = '';
            renderAll();
        }
    });

    document.getElementById('addUserTrigger').addEventListener('click', () => {
        document.getElementById('addUserModal').classList.remove('hidden');
        newUserInput.focus();
    });

    // User selector
    document.getElementById('userSelect').addEventListener('change', (e) => {
        switchUser(e.target.value);
    });

    // New plan modal
    const newPlanInput = document.getElementById('newPlanName');
    const createPlanBtn = document.getElementById('createPlanBtn');

    newPlanInput.addEventListener('input', () => {
        createPlanBtn.disabled = !newPlanInput.value.trim();
    });

    createPlanBtn.addEventListener('click', () => {
        const name = newPlanInput.value.trim();
        if (name) {
            createPlan(name);
            document.getElementById('newPlanModal').classList.add('hidden');
            newPlanInput.value = '';
        }
    });

    document.getElementById('newPlanTrigger').addEventListener('click', () => {
        document.getElementById('newPlanModal').classList.remove('hidden');
        newPlanInput.focus();
    });

    // Plan selector
    document.getElementById('planSelect').addEventListener('change', (e) => {
        switchPlan(e.target.value);
    });

    // Delete plan
    document.getElementById('deletePlanBtn').addEventListener('click', () => {
        const user = getCurrentUser();
        if (user && confirm(`Delete plan "${user.currentPlan}"?`)) {
            deletePlan(user.currentPlan);
        }
    });

    // Category filters (discovery section)
    document.querySelectorAll('.cat-filter').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.cat-filter').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderActivityGrid();
        });
    });

    // Zone filters (discovery section location filter)
    document.querySelectorAll('.zone-filter').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.zone-filter').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.zoneFilter = btn.dataset.zone;
            renderActivityGrid();
        });
    });

    // Sidebar filters (schedule section)
    document.querySelectorAll('.sidebar-filter').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.sidebar-filter').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.sidebarFilter = btn.dataset.cat;
            renderAvailableItems();
        });
    });

    // Sidebar search input
    const searchInput = document.getElementById('sidebarSearchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            state.sidebarSearch = e.target.value;
            renderAvailableItems();
        });
    }

    // Map filter toggle (All vs Favorites)
    document.querySelectorAll('.map-filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.map-filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.mapViewMode = btn.dataset.filter;
            // Re-render map with current category filter
            const activeFilter = document.querySelector('.cat-filter.active');
            const categoryFilter = activeFilter ? activeFilter.dataset.cat : 'all';
            renderFavoritesMap(categoryFilter);
        });
    });

    // Preference buttons (delegated)
    document.getElementById('activityGrid').addEventListener('click', (e) => {
        const btn = e.target.closest('.pref-btn');
        if (!btn) return;

        const card = btn.closest('.activity-card');
        const activityId = card.dataset.id;
        const currentPref = getPreference(activityId);
        const clickedPref = btn.dataset.pref;

        // Only trigger effects if it's a new preference
        if (currentPref !== clickedPref) {
            // Emoji burst animation
            const rect = btn.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;
            createEmojiBurst(clickedPref, x, y);

            // Card animation class
            card.classList.remove('just-starred', 'just-hearted', 'just-passed');
            if (clickedPref === 'star') card.classList.add('just-starred');
            else if (clickedPref === 'heart') card.classList.add('just-hearted');
            else if (clickedPref === 'pass') card.classList.add('just-passed');

            setTimeout(() => {
                card.classList.remove('just-starred', 'just-hearted', 'just-passed');
            }, 500);
        }

        if (currentPref === clickedPref) {
            setPreference(activityId, null);
        } else {
            setPreference(activityId, clickedPref);
        }
    });

    // Drop zones
    document.querySelectorAll('.bucket-items').forEach(bucket => {
        bucket.addEventListener('dragover', handleDragOver);
        bucket.addEventListener('dragleave', handleDragLeave);
        bucket.addEventListener('drop', handleDrop);
    });

    // Share button
    document.getElementById('shareBtn').addEventListener('click', shareCurrentPlan);

    // Import buttons
    document.getElementById('importBtn').addEventListener('click', importSharedPlan);
    document.getElementById('dismissImport').addEventListener('click', dismissSharedView);

    // Day tabs for schedule
    document.querySelectorAll('.day-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            switchScheduleDay(tab.dataset.day);
        });
    });

    // Clear data button
    document.getElementById('clearDataBtn').addEventListener('click', clearCurrentUserData);

    // Start sea creatures swimming!
    startSeaCreatures();
});
