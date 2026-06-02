// Seed the database with the full Charlotte bucket list
// Run once: node src/db/seed.js

import { getDb, initDb } from './schema.js';

const ITEMS = [
  // ── EVENTS & ENTERTAINMENT ──────────────────────────────────────────
  { name: "Charlotte FC Game", category: "Events & Entertainment", description: "CLT's MLS team plays at Bank of America Stadium. Energetic supporter culture. Season ends in October.", address: "800 S Mint St, Charlotte, NC 28202", neighborhood: "Uptown", lat: 35.2258, lng: -80.8528, drive_time: "~15 min", time_of_day: "evening", ticket_required: 1, remind_days_before: 14, external_url: "https://www.charlottefc.com" },
  { name: "Charlotte Hornets Game", category: "Events & Entertainment", description: "NBA basketball at Spectrum Center. Great arena with solid midrange seat options.", address: "333 E Trade St, Charlotte, NC 28202", neighborhood: "Uptown", lat: 35.2251, lng: -80.8393, drive_time: "~15 min", time_of_day: "evening", ticket_required: 1, remind_days_before: 7 },
  { name: "NASCAR Hall of Fame", category: "Events & Entertainment", description: "Interactive museum downtown. Iconic Charlotte Motor Speedway nearby for races and tours.", address: "400 E Martin Luther King Jr Blvd, Charlotte, NC 28202", neighborhood: "Uptown", lat: 35.2197, lng: -80.8343, drive_time: "~15 min", time_of_day: "any" },
  { name: "Don't Tell Comedy", category: "Events & Entertainment", description: "Secret stand-up comedy show — venue revealed day-of. Surprisingly good lineups.", address: null, neighborhood: "Charlotte", lat: 35.2271, lng: -80.8431, drive_time: "Varies", time_of_day: "evening", ticket_required: 1 },
  { name: "Outdoor Movies at Camp NE", category: "Events & Entertainment", description: "Free outdoor film screenings at Camp North End. Bring a blanket.", address: "1801 N Graham St, Charlotte, NC 28206", neighborhood: "Camp North End", lat: 35.2499, lng: -80.8488, drive_time: "~10 min", time_of_day: "evening", day_of_week: "thursday", recurrence: "weekly" },
  { name: "Grilled Cheese Festival", category: "Events & Entertainment", description: "Annual Charlotte festival celebrating the greatest sandwich. Check dates each year.", address: null, neighborhood: "Charlotte", lat: 35.2271, lng: -80.8431, drive_time: "~15 min", time_of_day: "any", recurrence: "annual" },

  // ── ACTIVE & OUTDOORS ────────────────────────────────────────────────
  { name: "Little Sugar Creek parkrun", category: "Active & Outdoors", description: "Free 5K every Saturday at 9am — timed, social, all paces. Part of the global parkrun network.", address: "3300 Canopy Oaks Dr, Charlotte, NC 28211", neighborhood: "South Charlotte", lat: 35.1638, lng: -80.8182, drive_time: "~15 min", time_of_day: "morning", day_of_week: "saturday", recurrence: "weekly", external_url: "https://www.parkrun.us/littlesugarcreek" },
  { name: "Heist Brewery Run Club", category: "Active & Outdoors", description: "Monday night social run at 6:30pm from Heist. Good vibes, cold beer after.", address: "2909 N Davidson St, Charlotte, NC 28205", neighborhood: "NoDa", lat: 35.2352, lng: -80.8101, drive_time: "~10 min", time_of_day: "evening", day_of_week: "monday", recurrence: "weekly" },
  { name: "Camp NE Run Club", category: "Active & Outdoors", description: "Community run club based at Camp North End. Social, all paces welcome.", address: "1801 N Graham St, Charlotte, NC 28206", neighborhood: "Camp North End", lat: 35.2499, lng: -80.8488, drive_time: "~10 min", time_of_day: "evening", day_of_week: "wednesday", recurrence: "weekly" },
  { name: "Plaza Midwood Tuesday Night Ride", category: "Active & Outdoors", description: "Weekly group bike ride starting in Plaza Midwood. Laid-back, social cycling.", address: "Plaza Midwood, Charlotte, NC 28205", neighborhood: "Plaza Midwood", lat: 35.2160, lng: -80.8043, drive_time: "~10 min", time_of_day: "evening", day_of_week: "tuesday", recurrence: "weekly" },
  { name: "Critical Mass Charlotte", category: "Active & Outdoors", description: "Monthly group bike ride through city streets — free, chaotic, fun. Last Friday of the month.", address: "800 E 3rd St, Charlotte, NC 28202", neighborhood: "Uptown", lat: 35.2219, lng: -80.8369, drive_time: "~15 min", time_of_day: "evening", day_of_week: "friday", recurrence: "monthly" },
  { name: "Early Bird Pickleball & Coffee", category: "Active & Outdoors", description: "Morning pickleball pickup followed by coffee — the perfect active social morning.", address: null, neighborhood: "Charlotte", lat: 35.2271, lng: -80.8431, drive_time: "Varies", time_of_day: "morning" },
  { name: "Disc Golf", category: "Active & Outdoors", description: "Charlotte has several solid disc golf courses — Renaissance Park is the local favorite.", address: "1200 W Tyvola Rd, Charlotte, NC 28217", neighborhood: "Southwest Charlotte", lat: 35.1748, lng: -80.8934, drive_time: "~15 min", time_of_day: "any" },
  { name: "Inner Peak Rock Climbing", category: "Active & Outdoors", description: "Indoor climbing gym with routes for all levels. Multiple Charlotte locations.", address: "4320 Rhea Town Rd, Concord, NC 28025", neighborhood: "South End", lat: 35.2076, lng: -80.8523, drive_time: "~10–20 min", time_of_day: "any" },
  { name: "NoDa Climbing", category: "Active & Outdoors", description: "Community-focused climbing gym in the NoDa arts district.", address: "3210 N Davidson St, Charlotte, NC 28205", neighborhood: "NoDa", lat: 35.2386, lng: -80.8084, drive_time: "~10 min", time_of_day: "any" },
  { name: "U.S. National Whitewater Center", category: "Active & Outdoors", description: "World-class outdoor rec hub: whitewater rafting, trails, climbing walls, zip lines, and more.", address: "5000 Whitewater Center Pkwy, Charlotte, NC 28214", neighborhood: "West Charlotte", lat: 35.2935, lng: -80.9901, drive_time: "~20 min", time_of_day: "any", external_url: "https://www.usnwc.org" },
  { name: "USNWC Trail Run Club", category: "Active & Outdoors", description: "Group trail runs through the Whitewater Center's extensive network.", address: "5000 Whitewater Center Pkwy, Charlotte, NC 28214", neighborhood: "West Charlotte", lat: 35.2935, lng: -80.9901, drive_time: "~20 min", time_of_day: "morning", recurrence: "weekly" },
  { name: "USNWC River Jam", category: "Active & Outdoors", description: "Live music festival at the Whitewater Center on the river. Seasonal.", address: "5000 Whitewater Center Pkwy, Charlotte, NC 28214", neighborhood: "West Charlotte", lat: 35.2935, lng: -80.9901, drive_time: "~20 min", time_of_day: "evening", recurrence: "annual" },
  { name: "USNWC Yoga", category: "Active & Outdoors", description: "Outdoor yoga in a stunning natural setting alongside the river.", address: "5000 Whitewater Center Pkwy, Charlotte, NC 28214", neighborhood: "West Charlotte", lat: 35.2935, lng: -80.9901, drive_time: "~20 min", time_of_day: "morning" },
  { name: "Jetton Park", category: "Active & Outdoors", description: "Beautiful lakefront park on Lake Norman — great for walks, picnics, and sunsets.", address: "19000 Jetton Rd, Cornelius, NC 28031", neighborhood: "Lake Norman", lat: 35.4877, lng: -80.8780, drive_time: "~30 min", time_of_day: "any" },
  { name: "Anne Springs Close Greenway", category: "Active & Outdoors", description: "2,100-acre nature preserve with hiking, biking, and equestrian trails.", address: "698 N White St, Fort Mill, SC 29715", neighborhood: "Fort Mill", lat: 35.0073, lng: -80.9454, drive_time: "~25 min", time_of_day: "any" },
  { name: "Ebenezer Park", category: "Active & Outdoors", description: "Scenic park on Lake Wylie with boat ramps, picnic spots, and wooded trails.", address: "4312 Boatshore Rd, Rock Hill, SC 29732", neighborhood: "Rock Hill", lat: 35.0041, lng: -81.0396, drive_time: "~30 min", time_of_day: "any" },
  { name: "Carrigan Farms", category: "Active & Outdoors", description: "Pick-your-own farm with seasonal crops, corn maze, and hayrides in fall.", address: "1826 Oak Ridge Farm Hwy, Mooresville, NC 28115", neighborhood: "Mooresville", lat: 35.5645, lng: -80.8513, drive_time: "~35 min", time_of_day: "any" },
  { name: "UNC Charlotte Botanical Gardens", category: "Active & Outdoors", description: "Free gardens with native plants, tropical greenhouse, and peaceful walking paths.", address: "9105 University City Blvd, Charlotte, NC 28223", neighborhood: "University City", lat: 35.3056, lng: -80.7334, drive_time: "~20 min", time_of_day: "any" },
  { name: "Airport Overlook Park", category: "Active & Outdoors", description: "Watch planes land and take off up close from a small park near CLT.", address: "3550 W W T Harris Blvd, Charlotte, NC 28208", neighborhood: "West Charlotte", lat: 35.2158, lng: -80.9533, drive_time: "~20 min", time_of_day: "any" },

  // ── FUN & QUIRKY ─────────────────────────────────────────────────────
  { name: "Stroke — Indoor Mini Golf", category: "Fun & Quirky", description: "Artsy indoor mini golf in NoDa with a bar. Great date night spot.", address: "3116 N Davidson St, Charlotte, NC 28205", neighborhood: "NoDa", lat: 35.2374, lng: -80.8091, drive_time: "~10 min", time_of_day: "evening" },
  { name: "Plant House", category: "Fun & Quirky", description: "Stunning plant shop and event space — browse or attend one of their workshops.", address: "1440 S Tryon St, Charlotte, NC 28203", neighborhood: "South End", lat: 35.2082, lng: -80.8573, drive_time: "~10 min", time_of_day: "any" },
  { name: "Victory Lane Indoor Karting", category: "Fun & Quirky", description: "High-speed indoor go-kart racing — competitive and surprisingly intense.", address: "9427 Sam Furr Rd, Huntersville, NC 28078", neighborhood: "Huntersville", lat: 35.4037, lng: -80.8730, drive_time: "~25 min", time_of_day: "any" },
  { name: "Duke Mansions", category: "Fun & Quirky", description: "Historic 1915 estate with gorgeous gardens, walking paths, and rotating events.", address: "400 Hermitage Rd, Charlotte, NC 28207", neighborhood: "Myers Park", lat: 35.2043, lng: -80.8238, drive_time: "~15 min", time_of_day: "any" },
  { name: "Girls Room", category: "Fun & Quirky", description: "Eclectic bar with great cocktails and a fun, expressive atmosphere.", address: "1440 S Tryon St, Charlotte, NC 28203", neighborhood: "Plaza Midwood", lat: 35.2160, lng: -80.8043, drive_time: "~10 min", time_of_day: "evening" },
  { name: "Lovingly — Florist", category: "Fun & Quirky", description: "Beautifully curated local flower shop — worth a visit just to look around.", address: "2435 Crescent Ave, Charlotte, NC 28207", neighborhood: "Myers Park", lat: 35.2019, lng: -80.8223, drive_time: "~15 min", time_of_day: "any" },
  { name: "Julia's Books & Café", category: "Fun & Quirky", description: "Charming indie bookstore with café — great for a slow weekend morning.", address: "701 E Blvd, Charlotte, NC 28203", neighborhood: "Dilworth", lat: 35.2073, lng: -80.8420, drive_time: "~15 min", time_of_day: "morning" },
  { name: "Babaloo Coffee Shop", category: "Fun & Quirky", description: "Funky, colorful neighborhood coffee shop with character and great community energy.", address: "4301 Park Rd, Charlotte, NC 28209", neighborhood: "Park Road", lat: 35.1798, lng: -80.8578, drive_time: "~15 min", time_of_day: "morning" },
  { name: "Mother of Dragons Board Game Café", category: "Fun & Quirky", description: "Cozy café with hundreds of board games. Great for a chill evening with friends.", address: "3106 N Davidson St, Charlotte, NC 28205", neighborhood: "NoDa", lat: 35.2368, lng: -80.8094, drive_time: "~10 min", time_of_day: "evening" },

  // ── SHOPPING ──────────────────────────────────────────────────────────
  { name: "Book Buyers", category: "Shopping", description: "Local used bookstore with a great selection and that perfect musty-book smell.", address: "3128 Monroe Rd, Charlotte, NC 28205", neighborhood: "Plaza Midwood", lat: 35.2093, lng: -80.8002, drive_time: "~15 min", time_of_day: "any" },
  { name: "Thrift Pony", category: "Shopping", description: "Curated thrift store with good vintage finds at reasonable prices.", address: "3205 N Davidson St, Charlotte, NC 28205", neighborhood: "NoDa", lat: 35.2381, lng: -80.8087, drive_time: "~10 min", time_of_day: "any" },
  { name: "Nothing New Vintage Shop", category: "Shopping", description: "Stylish vintage clothing — good curation, worth browsing regularly as stock changes.", address: "3206 N Davidson St, Charlotte, NC 28205", neighborhood: "NoDa", lat: 35.2383, lng: -80.8086, drive_time: "~10 min", time_of_day: "any" },

  // ── BARS & NIGHTLIFE ──────────────────────────────────────────────────
  { name: "District 57", category: "Bars & Nightlife", description: "Hip cocktail bar and gathering spot with rotating events.", address: "1400 Central Ave, Charlotte, NC 28205", neighborhood: "Plaza Midwood", lat: 35.2168, lng: -80.8012, drive_time: "~10 min", time_of_day: "evening" },
  { name: "Reelectric", category: "Bars & Nightlife", description: "Retro arcade bar — video games, pinball, and drinks. Perfect combo.", address: "3217 N Davidson St, Charlotte, NC 28205", neighborhood: "NoDa", lat: 35.2387, lng: -80.8085, drive_time: "~10 min", time_of_day: "evening" },
  { name: "Bitute", category: "Bars & Nightlife", description: "Intimate cocktail bar known for creative, well-crafted drinks.", address: "1524 Central Ave, Charlotte, NC 28205", neighborhood: "Plaza Midwood", lat: 35.2176, lng: -80.8001, drive_time: "~10 min", time_of_day: "evening" },
  { name: "Dolce & Amaro", category: "Bars & Nightlife", description: "Italian-leaning cocktail bar with amaro focus — sophisticated and cozy.", address: "820 Hamilton St, Charlotte, NC 28206", neighborhood: "Villa Heights", lat: 35.2331, lng: -80.8261, drive_time: "~10 min", time_of_day: "evening" },
  { name: "Chiefs Cocktail Bar", category: "Bars & Nightlife", description: "Speakeasy-style craft cocktail bar with an impressive menu.", address: "121 W Trade St, Charlotte, NC 28202", neighborhood: "Uptown", lat: 35.2271, lng: -80.8469, drive_time: "~15 min", time_of_day: "evening" },
  { name: "Rosie's Wine Bar", category: "Bars & Nightlife", description: "Relaxed wine bar with a thoughtful list and great small bites.", address: "1920 South Blvd, Charlotte, NC 28203", neighborhood: "South End", lat: 35.2042, lng: -80.8614, drive_time: "~10 min", time_of_day: "evening", visited: 1, visited_by: "manue" },
  { name: "Bev Prosecco Bar", category: "Bars & Nightlife", description: "Bubbly-focused bar — great for celebrations or just because.", address: "210 E Trade St, Charlotte, NC 28202", neighborhood: "South End", lat: 35.2251, lng: -80.8382, drive_time: "~15 min", time_of_day: "evening" },
  { name: "Easy Like Sunday", category: "Bars & Nightlife", description: "Laid-back bar with brunch vibes that extend into the evening.", address: "1522 Central Ave, Charlotte, NC 28205", neighborhood: "Plaza Midwood", lat: 35.2175, lng: -80.8002, drive_time: "~10 min", time_of_day: "evening" },
  { name: "Watkins Glen", category: "Bars & Nightlife", description: "Neighborhood bar with a comfortable, unpretentious atmosphere.", address: "1820 Plaza Rd, Charlotte, NC 28205", neighborhood: "Plaza Midwood", lat: 35.2172, lng: -80.7991, drive_time: "~10 min", time_of_day: "evening" },

  // ── COFFEE & CAFÉS ────────────────────────────────────────────────────
  { name: "Platform Coffee", category: "Coffee & Cafés", description: "Specialty coffee shop with excellent espresso and a great space for working.", address: "1300 S Tryon St, Charlotte, NC 28203", neighborhood: "South End", lat: 35.2108, lng: -80.8584, drive_time: "~10 min", time_of_day: "morning" },
  { name: "Chai Window", category: "Coffee & Cafés", description: "Indian-inspired chai bar — unique to Charlotte and seriously good.", address: "1427 S Tryon St, Charlotte, NC 28203", neighborhood: "South End", lat: 35.2090, lng: -80.8578, drive_time: "~15 min", time_of_day: "morning" },

  // ── FOOD — BREAKFAST & BRUNCH ─────────────────────────────────────────
  { name: "Reigning Donuts NoDa", category: "Food — Breakfast & Brunch", description: "Beloved local donut shop with creative flavors and a wall mural worth seeing.", address: "3208 N Davidson St, Charlotte, NC 28205", neighborhood: "NoDa", lat: 35.2382, lng: -80.8089, drive_time: "~10 min", time_of_day: "morning", visited: 1, visited_by: "manue" },
  { name: "Camp NE Farmers Market", category: "Food — Breakfast & Brunch", description: "Outdoor market with local vendors, fresh produce, food, and crafts.", address: "1801 N Graham St, Charlotte, NC 28206", neighborhood: "Camp North End", lat: 35.2499, lng: -80.8488, drive_time: "~10 min", time_of_day: "afternoon", day_of_week: "thursday", recurrence: "weekly" },

  // ── FOOD — LUNCH & DINNER ─────────────────────────────────────────────
  { name: "Coquette", category: "Food — Lunch & Dinner", description: "French-inspired bistro with a lovely atmosphere and a menu that punches above its weight.", address: "201 W Worthington Ave, Charlotte, NC 28203", neighborhood: "Dilworth", lat: 35.2038, lng: -80.8436, drive_time: "~15 min", time_of_day: "evening" },
  { name: "Your Mom's", category: "Food — Lunch & Dinner", description: "Fun, irreverent comfort food spot — the name says it all.", address: "1330 S Mint St, Charlotte, NC 28203", neighborhood: "South End", lat: 35.2123, lng: -80.8570, drive_time: "~10 min", time_of_day: "any" },
  { name: "La Calle Plaza Midwood", category: "Food — Lunch & Dinner", description: "Authentic Mexican street food in Plaza Midwood — tacos and more.", address: "1515 Central Ave, Charlotte, NC 28205", neighborhood: "Plaza Midwood", lat: 35.2173, lng: -80.8007, drive_time: "~10 min", time_of_day: "any" },
  { name: "La Lima Peruvian Sandwiches", category: "Food — Lunch & Dinner", description: "Outstanding Peruvian sandwiches — the butifarra is a must-try.", address: "1514 Central Ave, Charlotte, NC 28205", neighborhood: "Plaza Midwood", lat: 35.2172, lng: -80.8008, drive_time: "~15 min", time_of_day: "any", visited: 1, visited_by: "manue" },
  { name: "Vicente", category: "Food — Lunch & Dinner", description: "Neighborhood gem for modern Spanish-influenced food and natural wine.", address: "1523 Elizabeth Ave, Charlotte, NC 28204", neighborhood: "Elizabeth", lat: 35.2123, lng: -80.8178, drive_time: "~10 min", time_of_day: "evening", visited: 1, visited_by: "manue" },
  { name: "Innesca's (Matthews)", category: "Food — Lunch & Dinner", description: "Italian neighborhood spot worth the short drive — cozy and consistent.", address: "105 Matthews Station St, Matthews, NC 28105", neighborhood: "Matthews", lat: 35.1178, lng: -80.7246, drive_time: "~20 min", time_of_day: "evening" },
  { name: "Dozo", category: "Food — Lunch & Dinner", description: "Japanese-inspired spot with creative, well-executed dishes.", address: "300 S Tryon St, Charlotte, NC 28202", neighborhood: "Uptown", lat: 35.2224, lng: -80.8462, drive_time: "~15 min", time_of_day: "evening" },
  { name: "Menya Dura Ramen", category: "Food — Lunch & Dinner", description: "Serious ramen — rich broths, handmade noodles, and all the toppings.", address: "210 E Trade St, Charlotte, NC 28202", neighborhood: "Uptown", lat: 35.2251, lng: -80.8382, drive_time: "~15 min", time_of_day: "any" },
  { name: "Sandwich Max", category: "Food — Lunch & Dinner", description: "Local sandwich shop doing creative, overstuffed sandwiches done right.", address: "1532 Central Ave, Charlotte, NC 28205", neighborhood: "Plaza Midwood", lat: 35.2177, lng: -80.8000, drive_time: "~15 min", time_of_day: "any" },
  { name: "Yalla Shawarma", category: "Food — Lunch & Dinner", description: "Middle Eastern shawarma spot — fast, flavorful, and great value.", address: "1225 S Tryon St, Charlotte, NC 28203", neighborhood: "South End", lat: 35.2118, lng: -80.8579, drive_time: "~15 min", time_of_day: "any" },
  { name: "Nalan", category: "Food — Lunch & Dinner", description: "Turkish restaurant with an extensive menu and warm hospitality.", address: "4620 Randolph Rd, Charlotte, NC 28211", neighborhood: "SouthPark", lat: 35.1877, lng: -80.8052, drive_time: "~15 min", time_of_day: "evening" },
  { name: "Trevini Supermarket", category: "Food — Lunch & Dinner", description: "Italian specialty grocery — great for imported goods, cheese, and charcuterie.", address: "6401 Morrison Blvd, Charlotte, NC 28211", neighborhood: "SouthPark", lat: 35.1590, lng: -80.8248, drive_time: "~15 min", time_of_day: "any" },

  // ── HIKES & DAY TRIPS ─────────────────────────────────────────────────
  { name: "Chimney Rock State Park", category: "Hikes & Day Trips", description: "Dramatic granite monolith with sweeping valley views and waterfall hikes.", address: "431 Main St, Chimney Rock, NC 28720", neighborhood: "Chimney Rock", lat: 35.4384, lng: -82.2471, drive_time: "~1.5 hrs", time_of_day: "any" },
  { name: "High Falls, DuPont State Forest", category: "Hikes & Day Trips", description: "DuPont has multiple impressive waterfalls — High Falls is the crown jewel.", address: "89 Buck Forest Rd, Cedar Mountain, NC 28718", neighborhood: "DuPont", lat: 35.1976, lng: -82.6212, drive_time: "~2 hrs", time_of_day: "any" },
  { name: "Hanging Rock State Park", category: "Hikes & Day Trips", description: "Quartzite peaks with great ridge hikes and swimming holes below the falls.", address: "1790 Hanging Rock Park Rd, Danbury, NC 27016", neighborhood: "Danbury", lat: 36.3946, lng: -80.2668, drive_time: "~2 hrs", time_of_day: "any" },
  { name: "Grandfather Mountain", category: "Hikes & Day Trips", description: "Iconic NC mountain with the famous Mile High Swinging Bridge and diverse trails.", address: "2050 Blowing Rock Hwy, Linville, NC 28646", neighborhood: "Linville", lat: 36.0987, lng: -81.8151, drive_time: "~2 hrs", time_of_day: "any", ticket_required: 1 },
  { name: "Rough Ridge, Blue Ridge Parkway", category: "Hikes & Day Trips", description: "Short but spectacular hike with exposed ridge views of Grandfather Mountain.", address: "Blue Ridge Pkwy, Blowing Rock, NC 28605", neighborhood: "Blowing Rock", lat: 36.1246, lng: -81.7868, drive_time: "~2 hrs", time_of_day: "any" },
  { name: "Devil's Fork State Park (Lake Jocassee)", category: "Hikes & Day Trips", description: "Crystal-clear lake in SC with beautiful waterfalls — only accessible by water or long hike.", address: "161 Holcombe Circle, Salem, SC 29676", neighborhood: "Salem, SC", lat: 34.9602, lng: -82.9480, drive_time: "~2 hrs", time_of_day: "any" },
  { name: "Gorges State Park (Rainbow Falls)", category: "Hikes & Day Trips", description: "Lush gorge with stunning waterfalls including Rainbow Falls. Feels like a rainforest.", address: "976 Grassy Ridge Rd, Sapphire, NC 28774", neighborhood: "Sapphire", lat: 35.0932, lng: -82.9498, drive_time: "~2.5 hrs", time_of_day: "any" },
  { name: "Waterrock Knob, Blue Ridge Parkway", category: "Hikes & Day Trips", description: "One of the best sunset spots on the entire Blue Ridge Parkway. Short walk to summit.", address: "Blue Ridge Pkwy MM 451.2, NC", neighborhood: "Maggie Valley", lat: 35.4612, lng: -83.1369, drive_time: "~2.5 hrs", time_of_day: "any" },
  { name: "Dry Falls, Highlands", category: "Hikes & Day Trips", description: "Walk behind this 65-foot waterfall — literally stay dry. A unique NC experience.", address: "US-64, Highlands, NC 28741", neighborhood: "Highlands", lat: 35.0521, lng: -83.1836, drive_time: "~2.5 hrs", time_of_day: "any" },
  { name: "Fryingpan Mountain Tower", category: "Hikes & Day Trips", description: "Historic fire lookout tower with 360° views. One of NC's best-kept secrets.", address: "Blue Ridge Pkwy, Brevard, NC 28712", neighborhood: "Brevard", lat: 35.3490, lng: -82.7804, drive_time: "~2.5 hrs", time_of_day: "any" },
  { name: "Nantahala National Forest", category: "Hikes & Day Trips", description: "Massive forest with gorges, waterfalls, and world-class whitewater.", address: "90 Sloan Rd, Franklin, NC 28734", neighborhood: "Western NC", lat: 35.2709, lng: -83.6218, drive_time: "~2.5 hrs", time_of_day: "any" },
  { name: "Mount Mitchell State Park", category: "Hikes & Day Trips", description: "Highest peak east of the Mississippi. Stunning panoramic views — especially in fall.", address: "2388 State Hwy 128, Burnsville, NC 28714", neighborhood: "Burnsville", lat: 35.7649, lng: -82.2651, drive_time: "~3 hrs", time_of_day: "any" },
  { name: "Great Smoky Mountains", category: "Hikes & Day Trips", description: "America's most visited national park — Alum Cove Trail, Newfound Gap Drive, Andrews Bald.", address: "107 Park Headquarters Rd, Gatlinburg, TN 37738", neighborhood: "Gatlinburg, TN", lat: 35.6117, lng: -83.4895, drive_time: "~3.5 hrs", time_of_day: "any" },
  { name: "Stone Mountain State Park", category: "Hikes & Day Trips", description: "Massive granite dome with a scenic loop trail and waterfalls.", address: "3042 Frank Pkwy, Roaring Gap, NC 28668", neighborhood: "Roaring Gap", lat: 36.3796, lng: -81.0419, drive_time: "~2 hrs", time_of_day: "any" },
  { name: "Uwharrie National Forest", category: "Hikes & Day Trips", description: "Ancient mountains close to Charlotte — great for backpacking and trail running.", address: "789 NC-24, Troy, NC 27371", neighborhood: "Troy, NC", lat: 35.4132, lng: -80.0537, drive_time: "~1.5 hrs", time_of_day: "any" },
  { name: "Fall Creek Falls, TN", category: "Hikes & Day Trips", description: "One of the tallest waterfalls in the eastern US — worth the longer drive.", address: "2009 Village Camp Rd, Spencer, TN 38585", neighborhood: "Spencer, TN", lat: 35.6567, lng: -85.3427, drive_time: "~4 hrs", time_of_day: "any" },
  { name: "Jetton Park", category: "Hikes & Day Trips", description: "Beautiful lakefront park on Lake Norman — great for walks, picnics, and sunsets.", address: "19000 Jetton Rd, Cornelius, NC 28031", neighborhood: "Lake Norman", lat: 35.4877, lng: -80.8780, drive_time: "~30 min", time_of_day: "any" },
  { name: "Ebenezer Park", category: "Hikes & Day Trips", description: "Scenic park on Lake Wylie with boat ramps, picnic spots, and wooded trails.", address: "4312 Boatshore Rd, Rock Hill, SC 29732", neighborhood: "Rock Hill", lat: 35.0041, lng: -81.0396, drive_time: "~30 min", time_of_day: "any" },
  { name: "Anne Springs Close Greenway", category: "Hikes & Day Trips", description: "2,100-acre nature preserve with hiking, biking, and equestrian trails.", address: "698 N White St, Fort Mill, SC 29715", neighborhood: "Fort Mill", lat: 35.0073, lng: -80.9454, drive_time: "~25 min", time_of_day: "any" },
  { name: "Carrigan Farms", category: "Hikes & Day Trips", description: "Pick-your-own farm with seasonal crops, corn maze and hayrides in fall.", address: "1826 Oak Ridge Farm Hwy, Mooresville, NC 28115", neighborhood: "Mooresville", lat: 35.5645, lng: -80.8513, drive_time: "~35 min", time_of_day: "any" },

  // ── WINTER ────────────────────────────────────────────────────────────
  { name: "Ice Skating at Camp North End", category: "Winter", description: "Seasonal outdoor ice rink at Camp NE — one of Charlotte's best winter activities.", address: "1801 N Graham St, Charlotte, NC 28206", neighborhood: "Camp North End", lat: 35.2499, lng: -80.8488, drive_time: "~10 min", time_of_day: "evening", recurrence: "annual" },
  { name: "Winterfest at Carowinds", category: "Winter", description: "Carowinds transforms into a winter wonderland with lights, rides, and holiday cheer.", address: "14523 Carowinds Blvd, Charlotte, NC 28273", neighborhood: "Southwest Charlotte", lat: 35.1020, lng: -80.9394, drive_time: "~20 min", time_of_day: "evening", ticket_required: 1, recurrence: "annual" },
  { name: "High Seas Christmas Lights Mini Golf", category: "Winter", description: "Festive holiday-themed mini golf with elaborate light displays.", address: "10008 Perimeter Pkwy, Charlotte, NC 28216", neighborhood: "West Charlotte", lat: 35.3053, lng: -80.9118, drive_time: "~20 min", time_of_day: "evening", recurrence: "annual" },
  { name: "Southern Christmas Show", category: "Winter", description: "Massive holiday shopping and décor show at the Convention Center. Ends Nov 24.", address: "501 S College St, Charlotte, NC 28202", neighborhood: "Uptown", lat: 35.2196, lng: -80.8430, drive_time: "~15 min", time_of_day: "any", ticket_required: 1, recurrence: "annual" },
  { name: "Winter @ Whitewater Center", category: "Winter", description: "Seasonal winter programming — fire pits, winter hikes, and cozy vibes.", address: "5000 Whitewater Center Pkwy, Charlotte, NC 28214", neighborhood: "West Charlotte", lat: 35.2935, lng: -80.9901, drive_time: "~20 min", time_of_day: "any", recurrence: "annual" },
];

export function seedDb() {
  const db = getDb();
  const existing = db.prepare('SELECT COUNT(*) as count FROM items').get();
  if (existing.count > 0) {
    console.log(`✓ Database already has ${existing.count} items — skipping seed`);
    return;
  }

  const insert = db.prepare(`
    INSERT INTO items (
      name, category, subcategory, description,
      address, neighborhood, lat, lng, drive_time,
      time_of_day, day_of_week, recurrence, event_date,
      ticket_required, remind_days_before,
      visited, visited_by, source, external_url
    ) VALUES (
      @name, @category, @subcategory, @description,
      @address, @neighborhood, @lat, @lng, @drive_time,
      @time_of_day, @day_of_week, @recurrence, @event_date,
      @ticket_required, @remind_days_before,
      @visited, @visited_by, @source, @external_url
    )
  `);

  const insertMany = db.transaction((items) => {
    for (const item of items) {
      insert.run({
        subcategory: null,
        event_date: null,
        ticket_required: 0,
        remind_days_before: 0,
        visited: 0,
        visited_by: null,
        source: 'manual',
        external_url: null,
        day_of_week: null,
        recurrence: null,
        ...item,
      });
    }
  });

  insertMany(ITEMS);
  console.log(`✓ Seeded ${ITEMS.length} items`);
}
