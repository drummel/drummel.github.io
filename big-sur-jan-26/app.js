// ============ ACTIVITY DATA ============
const activities = [
    // HIKES
    { id: 'ewoldsen', name: 'Ewoldsen Trail', emoji: '⛰️', cat: 'hike', tag: 'Challenging', duration: 3.5, miles: 4.5, desc: 'Epic redwood canyon to ocean panorama. The most rewarding hike in Big Sur.', zone: 'south', coords: [36.2380, -121.7850] },
    { id: 'soberanes', name: 'Soberanes Canyon', emoji: '🌲', cat: 'hike', tag: 'Moderate', duration: 2, miles: 3, desc: 'Lush redwood canyon near your stay. Whale watching from Soberanes Point!', zone: 'north', coords: [36.4467, -121.9283] },
    { id: 'garrapata-bluffs', name: 'Garrapata Bluffs', emoji: '🌊', cat: 'hike', tag: 'Easy', duration: 1, miles: 2, desc: 'Coastal cliffs, wildflowers, sea lions. Quick scenic walk by your cabin.', zone: 'north', coords: [36.4583, -121.9217] },
    { id: 'pfeiffer-falls', name: 'Pfeiffer Falls + Valley View', emoji: '💧', cat: 'hike', tag: 'Moderate', duration: 2, miles: 3.2, desc: 'Waterfall through redwood forest, then climb to sweeping valley panorama.', zone: 'central', coords: [36.2500, -121.7833] },
    { id: 'partington-cove', name: 'Partington Cove Tunnel', emoji: '🚪', cat: 'hike', tag: 'Hidden Gem', duration: 0.75, miles: 1, desc: 'Secret 60-ft bootlegger tunnel to hidden cove. Spot sea otters!', zone: 'south', coords: [36.1783, -121.7017] },
    { id: 'point-lobos', name: 'Point Lobos Reserve', emoji: '🦭', cat: 'hike', tag: 'Crown Jewel', duration: 2, miles: 3, desc: 'Best state park in CA. Sea otters, seals, tide pools. Bird Island Trail stunning. $10.', zone: 'carmel', coords: [36.5167, -121.9500] },

    // BEACHES
    { id: 'pfeiffer-beach', name: 'Pfeiffer Beach', emoji: '🌅', cat: 'beach', tag: 'Must-See', duration: 1.5, desc: 'Famous Keyhole Rock, purple sand, dramatic sunset through the arch. $15.', zone: 'central', coords: [36.2383, -121.8150] },
    { id: 'garrapata-beach', name: 'Garrapata Beach', emoji: '🐚', cat: 'beach', tag: 'Hidden', duration: 1, desc: 'Secluded sandy beach near Calla Lily Valley. Driftwood shelters, great for picnics.', zone: 'north', coords: [36.4617, -121.9267] },
    { id: 'andrew-molera', name: 'Andrew Molera Beach', emoji: '🦋', cat: 'beach', tag: 'Expansive', duration: 1.5, miles: 2, desc: 'Longest beach in Big Sur. River crossing, monarch butterflies, wild and empty.', zone: 'central', coords: [36.2850, -121.8517] },
    { id: 'carmel-river-beach', name: 'Carmel River State Beach', emoji: '🏖️', cat: 'beach', tag: 'Accessible', duration: 1, desc: 'Wide sandy beach at Carmel River mouth. Great for sunset walks, birdwatching, stargazing.', zone: 'carmel', coords: [36.5367, -121.9283] },

    // SCENIC
    { id: 'mcway-falls', name: 'McWay Falls Overlook', emoji: '🏞️', cat: 'scenic', tag: 'Iconic', duration: 0.5, desc: '80-foot waterfall onto pristine beach. THE Big Sur postcard shot.', zone: 'south', coords: [36.1583, -121.6717] },
    { id: 'bixby', name: 'Bixby Bridge', emoji: '🌉', cat: 'scenic', tag: 'Classic', duration: 0.5, desc: 'The Instagram shot. Park north of bridge, walk back. Big Little Lies fame!', zone: 'north', coords: [36.3717, -121.9017] },
    { id: '17-mile', name: '17-Mile Drive', emoji: '🌳', cat: 'scenic', tag: 'Iconic', duration: 1.5, desc: 'The Lone Cypress! Ghost Trees! Pebble Beach! $12.25 toll (refunded with $35 restaurant purchase).', zone: 'carmel', coords: [36.5700, -121.9617] },

    // SEASONAL
    { id: 'calla-lily', name: 'Calla Lily Valley', emoji: '🌺', cat: 'seasonal', tag: 'Peak Bloom!', duration: 0.75, desc: 'Hidden valley BURSTING with white calla lilies in late Jan! Gate 18 at Garrapata. Waterproof shoes!', zone: 'north', coords: [36.4650, -121.9233] },
    { id: 'whale-watch', name: 'Gray Whale Watching', emoji: '🐋', cat: 'seasonal', tag: 'Peak Migration!', duration: 0.5, desc: 'Mid-January is PEAK! Bring binoculars. Best from Soberanes Point or any overlook.', zone: 'north', coords: [36.4467, -121.9283] },

    // STARGAZING
    { id: 'stargaze-garrapata', name: 'Garrapata Stargazing', emoji: '🌌', cat: 'stargazing', tag: 'Near Cabin', duration: 1, desc: 'Dark skies right by your cabin! Minimal light pollution. Bring blankets, hot cocoa.', zone: 'north', coords: [36.4583, -121.9217] },
    { id: 'stargaze-pfeiffer', name: 'Pfeiffer Beach Night Sky', emoji: '✨', cat: 'stargazing', tag: 'Dramatic', duration: 1.5, desc: 'Stars through Keyhole Rock! Check tide times. Bortle Scale 2 - exceptional darkness.', zone: 'central', coords: [36.2383, -121.8150] },
    { id: 'stargaze-andrew-molera', name: 'Andrew Molera Stargazing', emoji: '🔭', cat: 'stargazing', tag: 'Wide Open', duration: 1.5, desc: 'Expansive beach, unobstructed views. Milky Way reflected on water. Bring telescope!', zone: 'central', coords: [36.2850, -121.8517] },
    { id: 'stargaze-carmel', name: 'Carmel River Beach Stars', emoji: '🌠', cat: 'stargazing', tag: 'Easy Access', duration: 1, desc: 'Most accessible spot. Easy parking, flat beach. Good for casual stargazing.', zone: 'carmel', coords: [36.5367, -121.9283] },

    // RESTAURANTS & CAFES - Big Sur
    { id: 'nepenthe', name: 'Nepenthe', emoji: '🌄', cat: 'restaurant', tag: 'Essential', duration: 1.5, price: '$$$', desc: 'THE Big Sur restaurant. Terrace 800ft above Pacific. Ambrosia Burger legendary. Sunset dinner!', zone: 'central', coords: [36.2217, -121.7583] },
    { id: 'cafe-kevah', name: 'Cafe Kevah', emoji: '☕', cat: 'restaurant', tag: 'Casual', duration: 1, price: '$$', desc: 'Below Nepenthe. Same views, lighter fare. Fresh smoothies, sandwiches.', zone: 'central', coords: [36.2217, -121.7583] },
    { id: 'big-sur-bakery', name: 'Big Sur Bakery', emoji: '🥐', cat: 'restaurant', tag: 'Legendary', duration: 1, price: '$$', desc: 'Famous wood-fired breads, ginger scones, croissants. Fairy tale garden seating.', zone: 'central', coords: [36.2417, -121.7750] },
    { id: 'river-inn', name: 'Big Sur River Inn', emoji: '🍺', cat: 'restaurant', tag: 'Local Fave', duration: 1.5, price: '$$', desc: 'Chairs IN the river! Classic roadhouse vibes, good burgers. Grab a beer, sit in the creek.', zone: 'central', coords: [36.2700, -121.8200] },
    { id: 'deetjens', name: "Deetjen's Big Sur Inn", emoji: '🕯️', cat: 'restaurant', tag: 'Historic', duration: 1.5, price: '$$$', desc: 'Romantic candlelit dining in 1930s inn. Famous breakfast pancakes. Reservations needed.', zone: 'central', coords: [36.2017, -121.7400] },
    { id: 'big-sur-taphouse', name: 'Big Sur Taphouse', emoji: '🍻', cat: 'restaurant', tag: 'Craft Beer', duration: 1, price: '$$', desc: 'Rotating craft beers, hearty sandwiches. Local hangout spot.', zone: 'central', coords: [36.2700, -121.8200] },

    // RESTAURANTS & CAFES - Carmel
    { id: 'stationary', name: 'Stationæry', emoji: '⭐', cat: 'restaurant', tag: 'Michelin Bib', duration: 1.5, price: '$$$', desc: 'Michelin Bib Gourmand! Best brunch in Carmel. House-made pastries, shakshuka. Reserve ahead!', zone: 'carmel', coords: [36.5550, -121.9233] },
    { id: 'carmel-belle', name: 'Carmel Belle', emoji: '🥐', cat: 'restaurant', tag: 'Cozy', duration: 1, price: '$$', desc: 'Farm-to-table cafe in Doud Arcade. Great pastries, sandwiches, coffee.', zone: 'carmel', coords: [36.5550, -121.9217] },
    { id: 'la-bicyclette', name: 'La Bicyclette', emoji: '🇫🇷', cat: 'restaurant', tag: 'French', duration: 1.5, price: '$$$', desc: 'Rustic European charm. Wood-fired pizzas, hearty French-California cuisine.', zone: 'carmel', coords: [36.5550, -121.9233] },
    { id: 'carmel-bakery', name: 'Carmel Bakery', emoji: '🍰', cat: 'restaurant', tag: 'Early Open', duration: 0.5, price: '$', desc: 'Opens 7am! Coffee and pastries for early birds. Cute dog treats too.', zone: 'carmel', coords: [36.5550, -121.9217] },

    // MARKETS & PROVISIONS - Big Sur
    { id: 'big-sur-deli', name: 'Big Sur Deli', emoji: '🥪', cat: 'provisions', tag: 'Grab & Go', duration: 0.5, price: '$', desc: 'Grab-and-go sandwiches, snacks, drinks. Perfect for trail picnics.', zone: 'central', coords: [36.2700, -121.8200] },
    { id: 'big-sur-general', name: 'Big Sur Village General Store', emoji: '🏪', cat: 'provisions', tag: 'Supplies', duration: 0.5, price: '$', desc: 'Groceries, camping supplies, firewood. Gas station attached (expensive!).', zone: 'central', coords: [36.2700, -121.8200] },

    // MARKETS & PROVISIONS - Carmel
    { id: 'brunos', name: "Bruno's Market & Deli", emoji: '🥖', cat: 'provisions', tag: 'Institution', duration: 0.5, price: '$', desc: 'Carmel institution since 1953. Great sandwiches, picnic supplies, wine selection.', zone: 'carmel', coords: [36.5517, -121.9183] },
    { id: 'nielsen-bros', name: 'Nielsen Bros. Market', emoji: '🧺', cat: 'provisions', tag: 'Gourmet', duration: 0.5, price: '$$', desc: 'Upscale market with great deli, wine, cheese. Perfect picnic provisions.', zone: 'carmel', coords: [36.5550, -121.9200] },

    // CULTURE
    { id: 'henry-miller', name: 'Henry Miller Library', emoji: '📚', cat: 'culture', tag: 'Quirky', duration: 1, desc: '"Where nothing happens." Funky bookstore/art space. RHCP played here! WiFi works.', zone: 'central', coords: [36.1883, -121.7217] },

    // TRAVEL (special category - not shown in discovery but used in scheduling)
    { id: 'leave-san-rafael', name: 'Leave San Rafael', emoji: '🚗', cat: 'travel', tag: 'Departure', duration: 0, desc: 'Start of the adventure! ~2.5 hour drive to Big Sur via Highway 1.', zone: 'home', coords: [37.9735, -122.5311], isTravel: true },
    { id: 'drive-home', name: 'Drive Home to San Rafael', emoji: '🏠', cat: 'travel', tag: 'Return', duration: 2, desc: '~2 hour drive back. Consider stops in Carmel or Monterey!', zone: 'home', coords: [37.9735, -122.5311], isTravel: true },

    // BIGFOOT (Easter egg)
    { id: 'bigfoot', name: 'Call Bigfoot', emoji: '🦶', cat: 'culture', tag: 'Legendary', duration: 0, desc: 'Reception spotty in redwoods. Prefers text. Last seen near Ewoldsen stealing granola.', zone: 'unknown', coords: [36.25, -121.78] },
];

// Zone-based drive times (minutes from cabin at Garrapata)
const driveTimes = {
    'north': 5,      // Garrapata area
    'central': 25,   // Big Sur Village, Nepenthe
    'south': 40,     // McWay, Ewoldsen
    'carmel': 25,    // Point Lobos, Carmel
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
            fri: {
                departure: '1:00 PM',
                arrival: '~4:00 PM',
                activities: ['leave-san-rafael', 'bixby', 'nepenthe']
            }
        },
        {
            id: 'friday-chill',
            emoji: '🍷',
            name: 'Cozy Evening',
            desc: 'Leave 2pm → Groceries → Taphouse',
            fri: {
                departure: '2:00 PM',
                arrival: '~5:00 PM',
                activities: ['leave-san-rafael', 'big-sur-general', 'big-sur-taphouse']
            }
        },
        {
            id: 'friday-explore',
            emoji: '🔍',
            name: 'Early Explorer',
            desc: 'Leave 12pm → Bluffs walk → River Inn',
            fri: {
                departure: '12:00 PM',
                arrival: '~3:00 PM',
                activities: ['leave-san-rafael', 'garrapata-bluffs', 'river-inn']
            }
        },
        {
            id: 'friday-stargazing',
            emoji: '🌌',
            name: 'Stargazing Night',
            desc: 'Leave 1pm → Settle in → Night sky!',
            fri: {
                departure: '1:00 PM',
                arrival: '~4:00 PM',
                activities: ['leave-san-rafael', 'big-sur-general', 'stargaze-garrapata']
            }
        }
    ],
    saturday: [
        {
            id: 'sat-nepenthe-sunset',
            emoji: '🌄',
            name: 'Nepenthe Sunset',
            desc: 'Hike + sunset dinner at Nepenthe',
            sat: {
                morning: ['ewoldsen', 'mcway-falls'],
                afternoon: ['pfeiffer-beach', 'nepenthe']
            }
        },
        {
            id: 'sat-coastal-adventure',
            emoji: '🌊',
            name: 'Coastal Adventure',
            desc: 'Beach hopping & seasonal wonders',
            sat: {
                morning: ['calla-lily', 'soberanes', 'whale-watch'],
                afternoon: ['garrapata-beach', 'cafe-kevah']
            }
        },
        {
            id: 'sat-best-hikes',
            emoji: '🥾',
            name: 'Best Hikes Day',
            desc: 'Tackle the epic trails',
            sat: {
                morning: ['ewoldsen'],
                afternoon: ['pfeiffer-falls', 'big-sur-bakery']
            }
        },
        {
            id: 'sat-romantic',
            emoji: '💕',
            name: 'Romantic Day',
            desc: 'Scenic spots + Deetjen\'s dinner',
            sat: {
                morning: ['calla-lily', 'partington-cove'],
                afternoon: ['mcway-falls', 'deetjens']
            }
        },
        {
            id: 'sat-chill',
            emoji: '😌',
            name: 'Relaxed Saturday',
            desc: 'Easy pace, great food',
            sat: {
                morning: ['garrapata-bluffs', 'big-sur-bakery'],
                afternoon: ['pfeiffer-beach', 'river-inn']
            }
        }
    ],
    sunday: [
        {
            id: 'sun-lazy',
            emoji: '😴',
            name: 'Lazy Sunday',
            desc: 'Sleep in, brunch, Point Lobos → home ~5pm',
            sun: {
                morning: ['point-lobos'],
                afternoon: ['stationary', 'drive-home'],
                homeEta: '~5:00 PM'
            }
        },
        {
            id: 'sun-early-checkout',
            emoji: '🌅',
            name: 'Early Checkout',
            desc: '7am checkout → Calla Lily → home ~1pm',
            sun: {
                morning: ['calla-lily', 'bixby', 'carmel-bakery'],
                afternoon: ['drive-home'],
                homeEta: '~1:00 PM'
            }
        },
        {
            id: 'sun-maximize',
            emoji: '🌟',
            name: 'Maximize Sunday',
            desc: 'Full day exploration → home ~7pm',
            sun: {
                morning: ['point-lobos', '17-mile'],
                afternoon: ['stationary', 'brunos', 'drive-home'],
                homeEta: '~7:00 PM'
            }
        },
        {
            id: 'sun-carmel-crawl',
            emoji: '🦪',
            name: 'Carmel Crawl',
            desc: 'Food tour through Carmel → home ~6pm',
            sun: {
                morning: ['carmel-bakery', 'point-lobos'],
                afternoon: ['carmel-belle', 'la-bicyclette', 'drive-home'],
                homeEta: '~6:00 PM'
            }
        },
        {
            id: 'sun-one-more-hike',
            emoji: '🥾',
            name: 'One More Hike',
            desc: 'Morning Soberanes hike → home ~4pm',
            sun: {
                morning: ['soberanes'],
                afternoon: ['brunos', 'drive-home'],
                homeEta: '~4:00 PM'
            }
        },
        {
            id: 'sun-late-departure',
            emoji: '🌙',
            name: 'Stay Till Sunset',
            desc: 'Full day + sunset dinner → home ~9pm',
            sun: {
                morning: ['point-lobos', 'carmel-belle'],
                afternoon: ['17-mile', 'la-bicyclette', 'drive-home'],
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
    sidebarFilter: 'all'  // For filtering available items in schedule
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
        plans: { 'My Trip': { 'sat-morning': [], 'sat-afternoon': [], 'sun-morning': [], 'sun-afternoon': [] } },
        currentPlan: 'My Trip'
    };
    state.currentUser = name;
    saveState();
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
    user.plans[name] = { 'sat-morning': [], 'sat-afternoon': [], 'sun-morning': [], 'sun-afternoon': [] };
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

function renderActivityGrid() {
    const grid = document.getElementById('activityGrid');
    const activeFilter = document.querySelector('.cat-filter.active').dataset.cat;
    const user = getCurrentUser();

    grid.innerHTML = '';

    activities.forEach(act => {
        // Hide Easter egg and travel items from discovery
        if (act.id === 'bigfoot') return;
        if (act.cat === 'travel') return;

        const pref = getPreference(act.id);

        // Don't show passed items in main grid
        if (pref === 'pass') return;

        // Filter by category
        if (activeFilter !== 'all' && act.cat !== activeFilter) return;

        const card = document.createElement('div');
        card.className = 'activity-card';
        card.dataset.id = act.id;

        const tagClass = 'tag-' + act.cat;

        card.innerHTML = `
            <div class="card-header">
                <span class="card-emoji">${act.emoji}</span>
                <div class="card-info">
                    <div class="card-name">${act.name}</div>
                    <div class="card-meta">
                        <span class="tag ${tagClass}">${act.tag}</span>
                        ${act.duration ? `<span>${act.duration}h</span>` : ''}
                        ${act.miles ? `<span>${act.miles}mi</span>` : ''}
                        ${act.price ? `<span>${act.price}</span>` : ''}
                    </div>
                </div>
            </div>
            <div class="card-desc">${act.desc}</div>
            <div class="card-actions">
                <button class="pref-btn star ${pref === 'star' ? 'active' : ''}" data-pref="star">⭐ Interested</button>
                <button class="pref-btn heart ${pref === 'heart' ? 'active' : ''}" data-pref="heart">❤️ Must-Do</button>
                <button class="pref-btn pass ${pref === 'pass' ? 'active' : ''}" data-pref="pass">🚫 Pass</button>
            </div>
        `;

        grid.appendChild(card);
    });

    // Render passed items section
    renderPassedItems();

    // Update map with favorites
    renderFavoritesMap();
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

// ============ FAVORITES MAP ============
let favoritesMap = null;

function renderFavoritesMap() {
    const user = getCurrentUser();
    const mapWrapper = document.getElementById('mapWrapper');
    const mapCanvas = document.getElementById('mapCanvas');
    const mapPlaceholder = document.getElementById('mapPlaceholder');
    const mapLegend = document.getElementById('mapLegend');

    if (!mapWrapper || !mapCanvas) return;

    // Get all favorited activities with coordinates
    const favorites = [];
    if (user) {
        [...user.favorites, ...user.mustDos].forEach(id => {
            const act = activities.find(a => a.id === id);
            if (act && act.coords && act.cat !== 'travel') {
                const pref = user.mustDos.includes(id) ? 'heart' : 'star';
                favorites.push({ ...act, pref });
            }
        });
    }

    if (favorites.length === 0) {
        mapPlaceholder.classList.remove('hidden');
        if (favoritesMap) {
            favoritesMap.remove();
            favoritesMap = null;
        }
        mapLegend.innerHTML = '';
        return;
    }

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

    // Clear existing markers
    favoritesMap.eachLayer(layer => {
        if (layer instanceof L.Marker) {
            favoritesMap.removeLayer(layer);
        }
    });

    // Category colors
    const catColors = {
        hike: '#2d7d5f',
        beach: '#0ea5e9',
        scenic: '#eab308',
        seasonal: '#ec4899',
        stargazing: '#6366f1',
        restaurant: '#f97316',
        provisions: '#8b5a3c',
        culture: '#8b5cf6'
    };

    // Add markers
    const bounds = [];
    const usedCats = new Set();

    favorites.forEach(act => {
        const color = catColors[act.cat] || '#666';
        usedCats.add(act.cat);

        const markerClass = act.pref === 'heart' ? 'heart-marker' : 'star-marker';

        const icon = L.divIcon({
            className: 'custom-marker ' + markerClass,
            html: act.emoji,
            iconSize: [32, 32],
            iconAnchor: [16, 16]
        });

        const marker = L.marker([act.coords[0], act.coords[1]], { icon })
            .addTo(favoritesMap)
            .bindPopup(`<strong>${act.emoji} ${act.name}</strong><br>${act.desc}`);

        bounds.push([act.coords[0], act.coords[1]]);
    });

    // Fit bounds
    if (bounds.length > 1) {
        favoritesMap.fitBounds(bounds, { padding: [30, 30] });
    } else if (bounds.length === 1) {
        favoritesMap.setView(bounds[0], 12);
    }

    // Update legend
    let legendHtml = '';
    usedCats.forEach(cat => {
        const catName = cat.charAt(0).toUpperCase() + cat.slice(1);
        legendHtml += `<div class="map-legend-item"><span class="map-legend-dot ${cat}"></span>${catName}</div>`;
    });
    mapLegend.innerHTML = legendHtml;
}

function renderTemplates() {
    const activeTab = document.querySelector('.template-tab.active');
    const day = activeTab ? activeTab.dataset.day : 'friday';
    const container = document.getElementById('templateOptions');
    const templates = templatePlans[day] || [];

    let html = '';

    templates.forEach(t => {
        // For Friday templates, show departure/arrival timing
        const timingHtml = t.fri ? `
            <div class="template-timing">
                <span class="timing-badge">🚗 ${t.fri.departure}</span>
                <span class="timing-badge">📍 ${t.fri.arrival}</span>
            </div>
        ` : '';

        // For Sunday templates, show home ETA
        const etaHtml = t.sun?.homeEta ? `
            <div class="template-timing">
                <span class="timing-badge">🏠 ${t.sun.homeEta}</span>
            </div>
        ` : '';

        html += `
            <div class="template-card" data-template="${t.id}">
                <div class="template-emoji">${t.emoji}</div>
                <div class="template-name">${t.name}</div>
                <div class="template-desc">${t.desc}</div>
                ${timingHtml}${etaHtml}
            </div>
        `;
    });

    container.innerHTML = html;

    // Add click handlers
    container.querySelectorAll('.template-card').forEach(card => {
        card.addEventListener('click', () => applyTemplate(card.dataset.template));
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

    // Gather all activities from the template
    const allActivities = [
        ...(template.activities || []),
        ...(template.fri?.activities || []),
        ...(template.sat?.morning || []),
        ...(template.sat?.afternoon || []),
        ...(template.sun?.morning || []),
        ...(template.sun?.afternoon || [])
    ].filter(id => id !== 'leave-san-rafael' && id !== 'drive-home'); // Don't mark travel as favorites

    // Mark activities as interested
    allActivities.forEach(id => {
        if (!user.favorites.includes(id) && !user.mustDos.includes(id) && !user.passed.includes(id)) {
            user.favorites.push(id);
        }
    });

    // Populate the schedule based on template type
    const plan = getCurrentPlan();
    if (template.sat) {
        plan['sat-morning'] = [...template.sat.morning];
        plan['sat-afternoon'] = [...template.sat.afternoon];
    }
    if (template.sun) {
        plan['sun-morning'] = [...template.sun.morning];
        plan['sun-afternoon'] = [...template.sun.afternoon];
    }

    saveState();
    renderAll();
    showToast(`✨ Applied "${template.name}" template!`);
}

function renderAvailableItems() {
    const user = getCurrentUser();
    const container = document.getElementById('availableItems');
    const filterContainer = document.getElementById('sidebarFilters');

    if (!user) {
        container.innerHTML = '<p class="bucket-empty">Create your profile first!</p>';
        return;
    }

    // Get all non-passed, non-travel items
    const available = activities.filter(act => {
        if (act.id === 'bigfoot') return false;
        if (act.cat === 'travel') return false; // Travel items handled separately
        return !user.passed.includes(act.id);
    });

    // Filter by sidebar category
    const filtered = state.sidebarFilter === 'all'
        ? available
        : available.filter(act => act.cat === state.sidebarFilter);

    let html = '';

    // Add "Drive Home" as a special item at the top
    const driveHome = activities.find(a => a.id === 'drive-home');
    if (driveHome && state.sidebarFilter === 'all') {
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

    if (filtered.length === 0 && !html) {
        container.innerHTML = '<p class="bucket-empty">No items in this category</p>';
        return;
    }

    // Sort: must-dos first, then favorites, then others
    const sorted = [...filtered].sort((a, b) => {
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
    const buckets = ['sat-morning', 'sat-afternoon', 'sun-morning', 'sun-afternoon'];

    buckets.forEach(bucket => {
        const container = document.querySelector(`.bucket-items[data-bucket="${bucket}"]`);
        const items = plan ? plan[bucket] : [];

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
}

function updateDaySummaries() {
    const plan = getCurrentPlan();
    if (!plan) return;

    // Saturday
    const satItems = [...plan['sat-morning'], ...plan['sat-afternoon']];
    let satHours = 0;
    let satDrive = 0;
    let lastZone = 'north';

    satItems.forEach(id => {
        const act = activities.find(a => a.id === id);
        if (act) {
            satHours += act.duration || 0;
            const key = `${lastZone}-${act.zone || 'central'}`;
            satDrive += zoneToZone[key] || 15;
            lastZone = act.zone || 'central';
        }
    });

    document.getElementById('satActivities').textContent = satItems.length;
    document.getElementById('satHours').textContent = satHours.toFixed(1) + 'h';
    document.getElementById('satDrive').textContent = satDrive + 'm';

    // Sunday
    const sunItems = [...plan['sun-morning'], ...plan['sun-afternoon']];
    let sunHours = 0;
    let sunDrive = 0;
    lastZone = 'north';

    sunItems.forEach(id => {
        const act = activities.find(a => a.id === id);
        if (act) {
            sunHours += act.duration || 0;
            const key = `${lastZone}-${act.zone || 'carmel'}`;
            sunDrive += zoneToZone[key] || 15;
            lastZone = act.zone || 'carmel';
        }
    });

    const totalTime = 7 + sunHours + (sunDrive / 60) + 2;
    const etaHour = Math.floor(totalTime);
    const etaDisplay = etaHour > 12 ? `~${etaHour - 12}pm` : `~${etaHour}am`;

    document.getElementById('sunActivities').textContent = sunItems.length;
    document.getElementById('sunHours').textContent = sunHours.toFixed(1) + 'h';
    document.getElementById('sunEta').textContent = etaDisplay;
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

    // Random vertical position
    const topPos = 40 + Math.random() * 40; // Between 40% and 80% from top
    creature.style.top = `${topPos}%`;

    container.appendChild(creature);

    // Remove after animation completes
    const duration = isWhale ? 30000 : 20000;
    setTimeout(() => creature.remove(), duration);

    // Schedule next creature
    scheduleNextCreature();
}

function scheduleNextCreature() {
    // Random interval between 45 seconds and 2 minutes
    const delay = 45000 + Math.random() * 75000;
    seaCreatureTimeout = setTimeout(spawnSeaCreature, delay);
}

function startSeaCreatures() {
    // First creature after 10-30 seconds
    const initialDelay = 10000 + Math.random() * 20000;
    seaCreatureTimeout = setTimeout(spawnSeaCreature, initialDelay);
}

// ============ SHARING ============
function shareCurrentPlan() {
    const url = window.location.origin + window.location.pathname + '#' + encodeState();
    navigator.clipboard.writeText(url).then(() => {
        showToast('📋 Link copied! Share it with your travel buddy.');
    }).catch(() => {
        showToast('Failed to copy link');
    });
}

function importSharedPlan() {
    if (!state.sharedData) return;

    const data = state.sharedData;
    const user = getCurrentUser();

    if (!user) return;

    user.favorites = [...new Set([...user.favorites, ...data.f])];
    user.mustDos = [...new Set([...user.mustDos, ...data.m])];

    const planName = `${data.u}'s ${data.p}`;
    user.plans[planName] = data.s;
    user.currentPlan = planName;

    state.isViewingShared = false;
    state.sharedData = null;

    document.getElementById('importBanner').classList.add('hidden');
    window.location.hash = '';

    saveState();
    renderAll();
    showToast('✅ Imported! You can now edit your copy.');
}

function dismissSharedView() {
    state.isViewingShared = false;
    state.sharedData = null;
    document.getElementById('importBanner').classList.add('hidden');
    window.location.hash = '';
    renderAll();
}

// ============ TOAST ============
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

// ============ EVENT LISTENERS ============
document.addEventListener('DOMContentLoaded', () => {
    const hasSharedData = checkUrlHash();
    const hasLocalState = loadState();

    if (hasSharedData && state.sharedData) {
        state.isViewingShared = true;
        document.getElementById('importBanner').classList.remove('hidden');
        document.getElementById('importAuthor').textContent = state.sharedData.u + "'s " + state.sharedData.p;

        if (!hasLocalState) {
            document.getElementById('welcomeModal').classList.remove('hidden');
        } else {
            document.getElementById('welcomeModal').classList.add('hidden');
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

            if (state.sharedData) {
                showToast('Click "Save a Copy" to import the shared plan!');
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

    // Sidebar filters (schedule section)
    document.querySelectorAll('.sidebar-filter').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.sidebar-filter').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.sidebarFilter = btn.dataset.cat;
            renderAvailableItems();
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

    // Template tabs
    document.querySelectorAll('.template-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.template-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            renderTemplates();
        });
    });

    // Start sea creatures swimming!
    startSeaCreatures();
});
