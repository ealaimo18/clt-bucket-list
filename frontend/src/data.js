export const ALL_ITEMS = [
  // EVENTS & ENTERTAINMENT
  { id: 1, category: "Events & Entertainment", name: "Charlotte FC Game", description: "CLT's MLS team plays at Bank of America Stadium. Energetic supporter culture — check out The Mint section. Season ends in October.", location: "Bank of America Stadium, Uptown", drive: "~15 min", visited: false, tip: "Season ends October — don't wait!" },
  { id: 2, category: "Events & Entertainment", name: "Charlotte Hornets Game", description: "NBA basketball at Spectrum Center. Great arena experience with solid midrange seat options.", location: "Spectrum Center, Uptown", drive: "~15 min", visited: false },
  { id: 3, category: "Events & Entertainment", name: "NASCAR Hall of Fame & Speedway", description: "Interactive museum downtown plus the iconic Charlotte Motor Speedway nearby for races and tours.", location: "Uptown (museum) / Concord (speedway)", drive: "Museum ~15 min / Speedway ~30 min", visited: false },
  { id: 4, category: "Events & Entertainment", name: "Critical Mass Charlotte", description: "Monthly group bike ride through the city streets — free, chaotic, fun. Usually last Friday of the month.", location: "Marshall Park, Uptown", drive: "~15 min", visited: false },
  { id: 5, category: "Events & Entertainment", name: "Mother of Dragons Board Game Café", description: "Cozy café with hundreds of board games to play. Great for a chill evening with friends.", location: "NoDa", drive: "~10 min", visited: false },
  { id: 6, category: "Events & Entertainment", name: "Don't Tell Comedy", description: "Secret stand-up comedy show in an undisclosed venue revealed day-of. Surprisingly good lineups.", location: "Rotating, Charlotte area", drive: "Varies", visited: false },

  // CAMP NORTH END
  { id: 7, category: "Camp North End", name: "Farmers Market (Thursdays 4–8pm)", description: "Outdoor market with local vendors, food, and crafts in the cool Camp NE atmosphere.", location: "Camp North End", drive: "~10 min", visited: false },
  { id: 8, category: "Camp North End", name: "Outdoor Movies (Thursdays)", description: "Free outdoor film screenings in the open-air campus. Bring a blanket.", location: "Camp North End", drive: "~10 min", visited: false },
  { id: 9, category: "Camp North End", name: "Run Club (Wednesdays)", description: "Community run club based at Camp NE — social, all paces welcome.", location: "Camp North End", drive: "~10 min", visited: false },
  { id: 10, category: "Camp North End", name: "Ice Skating (Winter)", description: "Seasonal outdoor ice rink at Camp NE — one of Charlotte's best winter activities.", location: "Camp North End", drive: "~10 min", visited: false },

  // ACTIVE & OUTDOORS
  { id: 11, category: "Active & Outdoors", name: "Inner Peak Rock Climbing", description: "Indoor climbing gym with routes for all levels. Great intro to climbing in Charlotte.", location: "South End / Concord locations", drive: "~10–20 min", visited: false },
  { id: 12, category: "Active & Outdoors", name: "NoDa Climbing", description: "Community-focused climbing gym in the NoDa arts district.", location: "NoDa", drive: "~10 min", visited: false },
  { id: 13, category: "Active & Outdoors", name: "U.S. National Whitewater Center", description: "World-class outdoor rec hub: whitewater rafting, trails, climbing walls, zip lines, and more.", location: "Whitewater Center Pkwy", drive: "~20 min", visited: false },
  { id: 14, category: "Active & Outdoors", name: "USNWC Trail Run Club", description: "Group trail runs through the Whitewater Center's extensive trail network.", location: "Whitewater Center", drive: "~20 min", visited: false },
  { id: 15, category: "Active & Outdoors", name: "USNWC River Jam", description: "Live music festival at the Whitewater Center on the river. Seasonal event.", location: "Whitewater Center", drive: "~20 min", visited: false },
  { id: 16, category: "Active & Outdoors", name: "USNWC Yoga", description: "Outdoor yoga sessions in a stunning natural setting alongside the river.", location: "Whitewater Center", drive: "~20 min", visited: false },
  { id: 17, category: "Active & Outdoors", name: "Little Sugar Creek parkrun", description: "Free 5K every Saturday at 9am — timed, social, all paces. Part of the global parkrun network.", location: "Little Sugar Creek Greenway", drive: "~15 min", visited: false },
  { id: 18, category: "Active & Outdoors", name: "Heist Brewery Run Club", description: "Monday night social run at 6:30pm based out of Heist. Good vibes, cold beer after.", location: "Heist Brewery, NoDa", drive: "~10 min", visited: false },
  { id: 19, category: "Active & Outdoors", name: "Plaza Midwood Tuesday Night Ride", description: "Weekly group bike ride starting in Plaza Midwood. Laid-back, social cycling.", location: "Plaza Midwood", drive: "~10 min", visited: false },
  { id: 20, category: "Active & Outdoors", name: "Early Bird Pickleball & Coffee", description: "Morning pickleball pickup followed by coffee — the perfect active social morning.", location: "Charlotte area", drive: "Varies", visited: false },
  { id: 21, category: "Active & Outdoors", name: "Disc Golf", description: "Charlotte has several solid disc golf courses — Renaissance Park is a local favorite.", location: "Renaissance Park (top pick)", drive: "~15 min", visited: false },
  { id: 22, category: "Active & Outdoors", name: "Jetton Park", description: "Beautiful lakefront park on Lake Norman — great for walks, picnics, and sunsets.", location: "Cornelius", drive: "~30 min", visited: false },
  { id: 23, category: "Active & Outdoors", name: "Anne Springs Close Greenway", description: "Peaceful 2,100-acre nature preserve with hiking, biking, and equestrian trails.", location: "Fort Mill, SC", drive: "~25 min", visited: false },
  { id: 24, category: "Active & Outdoors", name: "Ebenezer Park", description: "Scenic park on Lake Wylie with boat ramps, picnic spots, and wooded trails.", location: "Rock Hill, SC", drive: "~30 min", visited: false },
  { id: 25, category: "Active & Outdoors", name: "Carrigan Farms", description: "Pick-your-own farm with seasonal crops plus a popular corn maze and hayrides in fall.", location: "Mooresville", drive: "~35 min", visited: false },
  { id: 26, category: "Active & Outdoors", name: "UNC Charlotte Botanical Gardens", description: "Beautiful free gardens with native plants, tropical greenhouse, and peaceful walking paths.", location: "UNCC campus, University City", drive: "~20 min", visited: false },

  // FUN & QUIRKY
  { id: 27, category: "Fun & Quirky", name: "Stroke — Indoor Mini Golf", description: "Artsy indoor mini golf in NoDa with a bar. Unique hole designs, great date night spot.", location: "NoDa", drive: "~10 min", visited: false },
  { id: 28, category: "Fun & Quirky", name: "Plant House", description: "Stunning plant shop and event space — great for browsing or attending one of their workshops.", location: "Plaza Midwood", drive: "~10 min", visited: false },
  { id: 29, category: "Fun & Quirky", name: "Victory Lane Indoor Karting", description: "High-speed indoor go-kart racing — competitive and surprisingly intense.", location: "Charlotte", drive: "~15 min", visited: false },
  { id: 30, category: "Fun & Quirky", name: "Duke Mansions", description: "Historic 1915 estate with gorgeous gardens, walking paths, and rotating events.", location: "Myers Park", drive: "~15 min", visited: false },
  { id: 31, category: "Fun & Quirky", name: "Girls Room", description: "Eclectic, feminine-coded bar with great cocktails and a fun, expressive atmosphere.", location: "Plaza Midwood", drive: "~10 min", visited: false },
  { id: 32, category: "Fun & Quirky", name: "Julia's Books & Café", description: "Charming indie bookstore with café — great for a slow weekend morning.", location: "Charlotte", drive: "~15 min", visited: false },
  { id: 33, category: "Fun & Quirky", name: "Lovingly — Florist", description: "Beautifully curated local flower shop — worth a visit even just to look around.", location: "Charlotte", drive: "~15 min", visited: false },
  { id: 34, category: "Fun & Quirky", name: "Babaloo Coffee Shop", description: "Funky, colorful neighborhood coffee shop with character and great community energy.", location: "Charlotte", drive: "~10 min", visited: false },
  { id: 35, category: "Fun & Quirky", name: "Airport Overlook Park", description: "Unique Charlotte gem — watch planes land and take off up close from a small park.", location: "Near CLT Airport", drive: "~20 min", visited: false },

  // SHOPPING
  { id: 36, category: "Shopping", name: "Book Buyers", description: "Local used bookstore with a great selection and that perfect musty-book smell.", location: "Charlotte", drive: "~15 min", visited: false },
  { id: 37, category: "Shopping", name: "Thrift Pony", description: "Curated thrift store with good vintage finds at reasonable prices.", location: "Charlotte", drive: "~15 min", visited: false },
  { id: 38, category: "Shopping", name: "Nothing New Vintage Shop", description: "Stylish vintage clothing — good curation, worth browsing regularly as stock changes.", location: "Charlotte", drive: "~15 min", visited: false },

  // BARS & NIGHTLIFE
  { id: 39, category: "Bars & Nightlife", name: "District 57", description: "Hip cocktail bar and gathering spot with rotating events and a cool vibe.", location: "Charlotte", drive: "~15 min", visited: false },
  { id: 40, category: "Bars & Nightlife", name: "Reelectric", description: "Retro arcade bar — video games, pinball, and drinks. Perfect combo.", location: "Charlotte", drive: "~15 min", visited: false },
  { id: 41, category: "Bars & Nightlife", name: "Bitute", description: "Intimate cocktail bar known for creative, well-crafted drinks.", location: "Charlotte", drive: "~10 min", visited: false },
  { id: 42, category: "Bars & Nightlife", name: "Dolce & Amaro", description: "Italian-leaning cocktail bar with amaro focus — sophisticated and cozy.", location: "Charlotte", drive: "~10 min", visited: false },
  { id: 43, category: "Bars & Nightlife", name: "Chiefs Cocktail Bar", description: "Speakeasy-style craft cocktail bar with an impressive menu.", location: "Charlotte", drive: "~15 min", visited: false },
  { id: 44, category: "Bars & Nightlife", name: "Rosie's Wine Bar", description: "Relaxed wine bar with a thoughtful list and great small bites.", location: "Charlotte", drive: "~10 min", visited: true },
  { id: 45, category: "Bars & Nightlife", name: "Bev Prosecco Bar", description: "Bubbly-focused bar — great for celebrations or just because.", location: "South End", drive: "~15 min", visited: false },
  { id: 46, category: "Bars & Nightlife", name: "Easy Like Sunday", description: "Laid-back bar with brunch vibes that extend into the evening. Perfect low-key spot.", location: "Charlotte", drive: "~10 min", visited: false },
  { id: 47, category: "Bars & Nightlife", name: "Watkins Glen", description: "Neighborhood bar with a comfortable, unpretentious atmosphere.", location: "Plaza Midwood", drive: "~10 min", visited: false },

  // FOOD & COFFEE
  { id: 48, category: "Food & Coffee", name: "Reigning Donuts NoDa", description: "Beloved local donut shop with creative flavors and a wall mural worth seeing.", location: "NoDa", drive: "~10 min", visited: true },
  { id: 49, category: "Food & Coffee", name: "Platform Coffee", description: "Specialty coffee shop with excellent espresso and a great space for working or hanging.", location: "South End / NoDa", drive: "~10–15 min", visited: false },
  { id: 50, category: "Food & Coffee", name: "Chai Window", description: "Indian-inspired chai bar — unique to Charlotte and seriously good.", location: "Charlotte", drive: "~15 min", visited: false },
  { id: 51, category: "Food & Coffee", name: "Coquette", description: "French-inspired bistro with a lovely atmosphere and a menu that punches above its weight.", location: "Charlotte", drive: "~15 min", visited: false },
  { id: 52, category: "Food & Coffee", name: "Your Mom's", description: "Fun, irreverent comfort food spot — the name says it all.", location: "Charlotte", drive: "~10 min", visited: false },
  { id: 53, category: "Food & Coffee", name: "La Calle Plaza Midwood", description: "Authentic Mexican street food in Plaza Midwood — tacos and more.", location: "Plaza Midwood", drive: "~10 min", visited: false },
  { id: 54, category: "Food & Coffee", name: "La Lima Peruvian Sandwiches", description: "Outstanding Peruvian sandwiches — the butifarra is a must-try.", location: "Charlotte", drive: "~15 min", visited: true },
  { id: 55, category: "Food & Coffee", name: "Vicente", description: "Neighborhood gem for modern Spanish-influenced food and natural wine.", location: "Charlotte", drive: "~10 min", visited: true },
  { id: 56, category: "Food & Coffee", name: "Innesca's (Matthews)", description: "Italian neighborhood spot worth the short drive — cozy and consistent.", location: "Matthews", drive: "~20 min", visited: false },
  { id: 57, category: "Food & Coffee", name: "Dozo", description: "Japanese-inspired spot with creative, well-executed dishes.", location: "Charlotte", drive: "~15 min", visited: false },
  { id: 58, category: "Food & Coffee", name: "Menya Dura Ramen", description: "Serious ramen — rich broths, handmade noodles, and all the toppings.", location: "Charlotte", drive: "~15 min", visited: false },
  { id: 59, category: "Food & Coffee", name: "Sandwich Max", description: "Local sandwich shop doing creative, overstuffed sandwiches done right.", location: "Charlotte", drive: "~15 min", visited: false },
  { id: 60, category: "Food & Coffee", name: "Yalla Shawarma", description: "Middle Eastern shawarma spot — fast, flavorful, and great value.", location: "Charlotte", drive: "~15 min", visited: false },
  { id: 61, category: "Food & Coffee", name: "Nalan", description: "Turkish restaurant with an extensive menu and warm hospitality.", location: "Charlotte", drive: "~15 min", visited: false },
  { id: 62, category: "Food & Coffee", name: "Trevini Supermarket", description: "Italian specialty grocery — great for imported goods, cheese, and charcuterie.", location: "Charlotte", drive: "~15 min", visited: false },
  { id: 63, category: "Food & Coffee", name: "Grilled Cheese Festival", description: "Annual Charlotte festival celebrating the greatest sandwich. Check dates each year.", location: "Charlotte (varies)", drive: "~15 min", visited: false },

  // HIKES & DAY TRIPS
  { id: 64, category: "Hikes & Day Trips", name: "Mount Mitchell State Park", description: "Highest peak east of the Mississippi. Stunning panoramic views — especially in fall.", location: "Burnsville, NC", drive: "~3 hrs", visited: false },
  { id: 65, category: "Hikes & Day Trips", name: "Grandfather Mountain", description: "Iconic NC mountain with the famous Mile High Swinging Bridge and diverse trails.", location: "Linville, NC", drive: "~2 hrs", visited: false },
  { id: 66, category: "Hikes & Day Trips", name: "Chimney Rock State Park", description: "Dramatic granite monolith with sweeping valley views and waterfall hikes.", location: "Chimney Rock, NC", drive: "~1.5 hrs", visited: false },
  { id: 67, category: "Hikes & Day Trips", name: "Gorges State Park (Rainbow Falls)", description: "Lush gorge with stunning waterfalls including Rainbow Falls. Feels like a rainforest.", location: "Sapphire, NC", drive: "~2.5 hrs", visited: false },
  { id: 68, category: "Hikes & Day Trips", name: "Hanging Rock State Park", description: "Quartzite peaks with great ridge hikes and swimming holes below the falls.", location: "Danbury, NC", drive: "~2 hrs", visited: false },
  { id: 69, category: "Hikes & Day Trips", name: "Stone Mountain State Park", description: "Massive granite dome with a scenic loop trail and waterfalls.", location: "Roaring Gap, NC", drive: "~2 hrs", visited: false },
  { id: 70, category: "Hikes & Day Trips", name: "Uwharrie National Forest", description: "Ancient mountains close to Charlotte — great for backpacking and trail running.", location: "Troy, NC", drive: "~1.5 hrs", visited: false },
  { id: 71, category: "Hikes & Day Trips", name: "Devil's Fork State Park (Lake Jocassee)", description: "Crystal-clear lake in SC with beautiful waterfalls only accessible by water or long hike.", location: "Salem, SC", drive: "~2 hrs", visited: false },
  { id: 72, category: "Hikes & Day Trips", name: "Nantahala National Forest", description: "Massive forest with gorges, waterfalls, and world-class whitewater.", location: "Western NC", drive: "~2.5 hrs", visited: false },
  { id: 73, category: "Hikes & Day Trips", name: "Great Smoky Mountains", description: "America's most visited national park — Alum Cove Trail, Newfound Gap Drive, and Andrews Bald are highlights.", location: "Gatlinburg, TN area", drive: "~3.5 hrs", visited: false },
  { id: 74, category: "Hikes & Day Trips", name: "Rough Ridge, Blue Ridge Parkway", description: "Short but spectacular hike with exposed ridge views of Grandfather Mountain.", location: "Blowing Rock, NC", drive: "~2 hrs", visited: false },
  { id: 75, category: "Hikes & Day Trips", name: "Waterrock Knob, Blue Ridge Parkway", description: "One of the best sunset spots on the entire Blue Ridge Parkway. Short walk to the summit.", location: "Near Maggie Valley, NC", drive: "~2.5 hrs", visited: false },
  { id: 76, category: "Hikes & Day Trips", name: "High Falls, DuPont State Forest", description: "DuPont has multiple impressive waterfalls — High Falls is the crown jewel.", location: "Cedar Mountain, NC", drive: "~2 hrs", visited: false },
  { id: 77, category: "Hikes & Day Trips", name: "Dry Falls, Highlands", description: "Walk behind this 65-foot waterfall — literally stay dry. A unique NC experience.", location: "Highlands, NC", drive: "~2.5 hrs", visited: false },
  { id: 78, category: "Hikes & Day Trips", name: "Fryingpan Mountain Tower, Blue Ridge Parkway", description: "Historic fire lookout tower with 360° views. One of NC's best-kept secrets.", location: "Brevard, NC", drive: "~2.5 hrs", visited: false },
  { id: 79, category: "Hikes & Day Trips", name: "Fall Creek Falls, TN", description: "One of the tallest waterfalls in the eastern US — worth the longer drive.", location: "Spencer, TN", drive: "~4 hrs", visited: false },

  // WINTER
  { id: 80, category: "Winter", name: "Winterfest at Carowinds", description: "Carowinds transforms into a winter wonderland with lights, rides, and holiday cheer.", location: "Carowinds Blvd", drive: "~20 min", visited: false },
  { id: 81, category: "Winter", name: "High Seas Christmas Lights Mini Golf", description: "Festive holiday-themed mini golf with elaborate light displays.", location: "Charlotte area", drive: "~20 min", visited: false },
  { id: 82, category: "Winter", name: "Southern Christmas Show", description: "Massive holiday shopping and décor show at the Convention Center. Ends Nov 24.", location: "Convention Center, Uptown", drive: "~15 min", visited: false },
  { id: 83, category: "Winter", name: "Winter @ Whitewater Center", description: "Seasonal winter programming at USNWC — fire pits, winter hikes, and cozy vibes.", location: "Whitewater Center", drive: "~20 min", visited: false },
];

export const CATEGORIES = [...new Set(ALL_ITEMS.map(i => i.category))];

export const CATEGORY_META = {
  "Events & Entertainment": { accent: "#E65100", icon: "🎭" },
  "Camp North End":         { accent: "#2E7D32", icon: "🏕️" },
  "Active & Outdoors":      { accent: "#1565C0", icon: "🏃" },
  "Fun & Quirky":           { accent: "#6A1B9A", icon: "✨" },
  "Shopping":               { accent: "#880E4F", icon: "🛍️" },
  "Bars & Nightlife":       { accent: "#4527A0", icon: "🍸" },
  "Food & Coffee":          { accent: "#F57F17", icon: "🍴" },
  "Hikes & Day Trips":      { accent: "#00695C", icon: "🥾" },
  "Winter":                 { accent: "#283593", icon: "❄️" },
};
