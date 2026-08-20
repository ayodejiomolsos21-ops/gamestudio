import fs from 'fs';

// Read sitemap from inspect_sitemap_games.mjs or definition
const sitemapContent = fs.readFileSync('./scripts/inspect_sitemap_games.mjs', 'utf-8');
const locMatches = [...sitemapContent.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);

const ignored = ['ads.txt', 'MyFileList.txt', 'paths.txt', 'cloak.html', 'about-us', 'updates', 'select', 'anime', 'articles', 'index.html'];
const rawGameUrls = locMatches.filter(u => {
  if (ignored.some(ig => u.includes(ig))) return false;
  if (u.endsWith('.co.uk/') || u.endsWith('/Resources/')) return false;
  return true;
});

console.log(`Processing ${rawGameUrls.length} raw game URLs...`);

const iconPool = [
  'Gamepad2', 'Flame', 'Sparkles', 'Zap', 'Target', 'Trophy', 'Crosshair',
  'Shield', 'Swords', 'Compass', 'Rocket', 'Activity', 'Award', 'Cpu', 'Layers'
];

const gradientPool = [
  'from-cyan-500 via-blue-700 to-slate-950',
  'from-purple-500 via-indigo-700 to-slate-950',
  'from-pink-500 via-rose-700 to-slate-950',
  'from-emerald-500 via-teal-700 to-slate-950',
  'from-amber-500 via-orange-700 to-slate-950',
  'from-violet-500 via-fuchsia-700 to-slate-950',
  'from-red-500 via-rose-800 to-slate-950',
  'from-blue-500 via-sky-700 to-slate-950',
  'from-lime-500 via-green-700 to-slate-950'
];

function assignCategory(name) {
  const n = name.toLowerCase();
  if (n.includes('drive') || n.includes('car') || n.includes('racing') || n.includes('kart') || n.includes('bike') || n.includes('moto') || n.includes('parking') || n.includes('drift') || n.includes('highway') || n.includes('truck') || n.includes('road') || n.includes('racer')) return 'Driving';
  if (n.includes('gun') || n.includes('shoot') || n.includes('sniper') || n.includes('fps') || n.includes('strike') || n.includes('war') || n.includes('combat') || n.includes('bullet') || n.includes('zombie') || n.includes('1v1') || n.includes('call of duty') || n.includes('doom') || n.includes('mayhem') || n.includes('tank')) return 'Shooter';
  if (n.includes('chess') || n.includes('puzzle') || n.includes('2048') || n.includes('sudoku') || n.includes('match') || n.includes('connect') || n.includes('tetris') || n.includes('block') || n.includes('maze') || n.includes('wordle') || n.includes('physics') || n.includes('brain') || n.includes('cut the rope') || n.includes('water') || n.includes('circlo') || n.includes('factory')) return 'Puzzle';
  if (n.includes('soccer') || n.includes('football') || n.includes('basketball') || n.includes('baseball') || n.includes('tennis') || n.includes('golf') || n.includes('bowl') || n.includes('skate') || n.includes('hockey') || n.includes('fifa') || n.includes('nba') || n.includes('ping pong') || n.includes('unicycle')) return 'Sports';
  if (n.includes('multiplayer') || n.includes('.io') || n.includes('online') || n.includes('agar') || n.includes('slither') || n.includes('smash') || n.includes('party') || n.includes('duo') || n.includes('brawl') || n.includes('tag')) return 'Multiplayer';
  if (n.includes('mario') || n.includes('sonic') || n.includes('pokemon') || n.includes('zelda') || n.includes('rpg') || n.includes('craft') || n.includes('adventure') || n.includes('story') || n.includes('dungeon') || n.includes('quest') || n.includes('fnaf') || n.includes('freddy') || n.includes('undertale') || n.includes('granny') || n.includes('dadish') || n.includes('earthbound')) return 'RPG';
  if (n.includes('retro') || n.includes('pacman') || n.includes('galaga') || n.includes('donkey kong') || n.includes('emulator') || n.includes('nes') || n.includes('snes') || n.includes('gba') || n.includes('genesis') || n.includes('n64') || n.includes('ds') || n.includes('space invaders') || n.includes('asteroids')) return 'Retro';
  if (n.includes('tower') || n.includes('defense') || n.includes('kingdom') || n.includes('strategy') || n.includes('clash') || n.includes('tactics') || n.includes('civilization') || n.includes('age of') || n.includes('btd') || n.includes('bloons') || n.includes('state')) return 'Strategy';
  if (n.includes('run') || n.includes('jump') || n.includes('fight') || n.includes('ninja') || n.includes('stickman') || n.includes('action') || n.includes('survive') || n.includes('dash') || n.includes('slope') || n.includes('parkour') || n.includes('subway') || n.includes('vex') || n.includes('superhot') || n.includes('ovo')) return 'Action';
  if (n.includes('clicker') || n.includes('idle') || n.includes('flappy') || n.includes('casual') || n.includes('cat') || n.includes('dog') || n.includes('candy') || n.includes('cookie') || n.includes('capybara') || n.includes('popcat') || n.includes('dino') || n.includes('duck life')) return 'Casual';
  return 'Arcade';
}

function cleanTitle(rawSegment) {
  let seg = decodeURIComponent(rawSegment.replace(/\.html?$/i, ''));
  // Special title maps
  const nameMap = {
    '1.12-u2-wasm': 'Eaglercraft 1.12 (Minecraft WASM)',
    '10-minutes-till-dawn': '10 Minutes Till Dawn',
    '100ng': '100 Player Pong',
    '10minutestilldawn': '10 Minutes Till Dawn: WebGL',
    '12minibattles': '12 Mini Battles',
    '1on1soccer': '1 on 1 Soccer',
    '1on1tennis': '1 on 1 Tennis',
    '1v1lol': '1v1.LOL',
    '1v1space': '1v1 Space',
    '2020-game': '2020 Game',
    '2048-multitask': '2048 Multitask',
    '2048cupcakes': '2048 Cupcakes',
    '3Dflightsimulator': '3D Flight Simulator',
    '8ball': '8 Ball Pool',
    '8ball-billards-classic': '8 Ball Billiards Classic',
    '8ballclassic': '8 Ball Classic',
    '9007199254740992': '9007199254740992 (Infinite 2048)',
    'adarkroom': 'A Dark Room',
    'adrenalinechallenge': 'Adrenaline Challenge',
    'agariolite': 'Agar.io Lite',
    'age-of-war': 'Age of War',
    'ageofwar2': 'Age of War 2',
    'ages-of-conflict': 'Ages of Conflict',
    'agesofconflict': 'Ages of Conflict World War Simulator',
    'alien-invaders-io': 'Alien Invaders.io',
    'alienhominid': 'Alien Hominid',
    'align-4': 'Align 4 (Connect 4)',
    'Amanda the Adventurer': 'Amanda the Adventurer',
    'amongus': 'Among Us Single Player',
    'angrybirds': 'Angry Birds',
    'angrybirdsshowdown': 'Angry Birds Showdown',
    'angrybirdsspace': 'Angry Birds Space',
    'anti-terrorist-rush': 'Anti-Terrorist Rush',
    'arcade-wizard': 'Arcade Wizard',
    'asciispace': 'ASCII Space Invaders',
    'aspiring-artist': 'Aspiring Artist',
    'astrawasm': 'Astra Client WASM',
    'awesome-tanks-2': 'Awesome Tanks 2',
    'awesometanks': 'Awesome Tanks',
    'awesometanks2': 'Awesome Tanks 2 HD',
    'backcountry': 'Backcountry Skiing',
    'backflip-dive-3d': 'Backflip Dive 3D',
    'baconmaydie': 'Bacon May Die',
    'bad-ice-cream-2': 'Bad Ice Cream 2',
    'bad-ice-cream-3': 'Bad Ice Cream 3',
    'badicecream2': 'Bad Ice Cream 2 Deluxe',
    'badicecream3': 'Bad Ice Cream 3 Deluxe',
    'badparenting': 'Bad Parenting: Mr. Red Face',
    'badpiggies': 'Bad Piggies',
    'baseballbros': 'Baseball Bros',
    'basket-bros-io': 'Basket Bros.io',
    'basketball-io': 'Basketball.io',
    'basketball-legends-2020': 'Basketball Legends 2020',
    'basketballlegends': 'Basketball Legends',
    'basketbros': 'Basket Bros',
    'basketrandom': 'Basket Random',
    'battleforgondor': 'Battle for Gondor (LOTR)',
    'Beta_1.3': 'Minecraft Beta 1.3 WASM',
    'bigredbutton': 'Don’t Press The Red Button',
    'binding-of-isaac': 'The Binding of Isaac',
    'bitplanes': 'Bit Planes Retro Dogfight',
    'blacholesquare': 'Black Hole Square',
    'blackholesquare': 'Black Hole Square 2',
    'blackknight': 'The Black Knight: Get Medieval',
    'blocky-snakes': 'Blocky Snakes 3D',
    'blockysnakes': 'Blocky Snakes',
    'bloonstd2': 'Bloons Tower Defense 2',
    'bloonsTD2': 'Bloons TD 2 Classic',
    'bloonsTD3': 'Bloons TD 3',
    'bloonstd4': 'Bloons Tower Defense 4',
    'bloonsTD4': 'Bloons TD 4 Expansion',
    'bloonsTD5': 'Bloons TD 5 Web',
    'bloxors': 'Bloxorz Original',
    'bloxorz': 'Bloxorz 3D Puzzle',
    'blumgiracers': 'Blumgi Racers',
    'blumgirocket': 'Blumgi Rocket',
    'bobtherobber': 'Bob the Robber',
    'bobtherobber2': 'Bob the Robber 2',
    'bobtherobber5': 'Bob the Robber 5: Temple Adventure',
    'bounceback': 'Bounce Back',
    'bouncymotors': 'Bouncy Motors',
    'bowmasters': 'Bowmasters Arena',
    'boxel-rebound': 'Boxel Rebound',
    'boxhead2play': 'Boxhead: 2Play Rooms',
    'boxingrandom': 'Boxing Random',
    'brave-explorers': 'Brave Explorers',
    'breakingthebank': 'Breaking the Bank (Henry Stickmin)',
    'breaklock': 'BreakLock (Android Pattern Master)',
    'Buckshot Roulette': 'Buckshot Roulette Web Edition',
    'burning-man-2': 'Burning Man 2',
    'candycrush': 'Candy Crush Web',
    'cannon-basketball-4': 'Cannon Basketball 4',
    'canyondefense': 'Canyon Defense',
    'captaincallisto': 'Captain Callisto',
    'capybaraclicker': 'Capybara Clicker',
    'cardrawing': 'Draw The Car 3D',
    'carkingarena': 'Car King Arena',
    'cars-simulator': 'Cars Simulator 3D',
    'cell-machine': 'Cell Machine',
    'championarcher': 'Champion Archer',
    'chill-radio': 'Lofi Chill Radio Synth',
    'choppyorc': 'Choppy Orc',
    'chromaincident': 'Chroma Incident',
    'circlo': 'circlO: Physics Ball',
    'circloO': 'circlO',
    'circloO2': 'circlO 2',
    'city-blocks-2': 'City Blocks 2',
    'clashofvikings': 'Clash of Vikings',
    'clean-up-io': 'Clean Up.io',
    'cleanupio': 'Clean Up 3D',
    'cluster-rush': 'Cluster Rush',
    'clusterrush': 'Cluster Rush 3D',
    'color-switch-2-challenges': 'Color Switch 2 Challenges',
    'connect3': 'Connect 3 Classic',
    'core-ball': 'Core Ball',
    'craftmine': 'Craftmine (2D Minecraft Survival)',
    'crazycars': 'Crazy Cars',
    'crazycattle3D': 'Crazy Cattle 3D',
    'crazycrashlanding': 'Crazy Crash Landing',
    'crazymotorcycle': 'Crazy Motorcycle',
    'creativekillchamber': 'Creative Kill Chamber',
    'crowd city 2': 'Crowd City 2',
    'csgo-clicker': 'CS:GO Case Clicker',
    'ctr': 'Cut The Rope Original',
    'ctr-holiday': 'Cut The Rope: Holiday Gift',
    'ctr-tr': 'Cut The Rope: Time Travel',
    'cuttherope2': 'Cut the Rope 2',
    'cuttheropeholiday': 'Cut the Rope Holiday Gift',
    'dadish': 'Dadish',
    'dadish2': 'Dadish 2',
    'dadish3': 'Dadish 3',
    'dante': 'Dante Inferno Quest',
    'deal-or-no-deal': 'Deal or No Deal',
    'death-run-3d': 'Death Run 3D',
    'death-soul': 'Death Soul',
    'deathchase': 'Death Chase',
    'deathrun3D': 'Death Run 3D Neon',
    'defend-the-tank': 'Defend the Tank',
    'demolitionderbycrashracing': 'Demolition Derby Crash Racing',
    'doctor-acorn2': 'Doctor Acorn 2',
    'doctor-acorn3': 'Doctor Acorn 3',
    'dodge': 'Dodge Ball Neon',
    'doge-miner-2': 'Doge Miner 2: Back to the Moon',
    'doge2048': 'Doge 2048',
    'dogeminer': 'Doge Miner',
    'dont-drop-the-white-ball-2': "Don't Drop The White Ball 2",
    'doublewires': 'Double Wires Spider Swinger',
    'douchebag-workout-2': 'Douchebag Workout 2',
    'dragon-vs-bricks': 'Dragon vs Bricks',
    'draw-the-hill': 'Draw the Hill',
    'drawclimber': 'Draw Climber 3D',
    'dreadheadparkour': 'Dreadhead Parkour',
    'duck-life-treasurehunt': 'Duck Life: Treasure Hunt',
    'ducklife2': 'Duck Life 2: World Champion',
    'ducklife3': 'Duck Life 3: Evolution',
    'ducklife4': 'Duck Life 4',
    'ducklife5': 'Duck Life 5: Treasure Hunt',
    'ducklingsio': 'Ducklings.io',
    'duke-dashington-remastered': 'Duke Dashington Remastered',
    'dungeon-craft': 'Dungeon Craft',
    'eagleride': 'Eagle Ride 3D',
    'earntodie': 'Earn to Die',
    'earntodie2': 'Earn to Die 2',
    'edge-surf': 'Microsoft Edge Surf Game',
    'edgenotfound': 'Edge 404 Runner',
    'eggycar': 'Eggy Car',
    'elastic-face': 'Elastic Face Simulation',
    'elasticface': 'Elastic Face',
    'elasticman': 'Elastic Man 3D Morty',
    'elasticmorty': 'Elastic Morty Face',
    'emulator-js': 'EmulatorJS Multi-Console',
    'endlesswar3': 'Endless War 3',
    'escaperoad': 'Escape Road Police Chase',
    'escaperoad2': 'Escape Road 2',
    'escapingtheprison': 'Escaping The Prison',
    'evil-glitch': 'Evil Glitch',
    'evilglitch': 'Evil Glitch Dimensions',
    'evolution': 'Human Evolution Clicker',
    'exo': 'EXO Orbital Defense',
    'factory-balls-forever': 'Factory Balls Forever',
    'factoryballs': 'Factory Balls',
    'factoryballsforever': 'Factory Balls Forever HD',
    'fake-virus': 'Retro Terminal Hacker Screen',
    'fancypantsadventure': 'Fancy Pants Adventures World 1',
    'fancypantsadventure2': 'Fancy Pants Adventures World 2',
    'fancypantsadventures': 'Fancy Pants Adventures',
    'fbwg': 'Fireboy & Watergirl: In The Forest Temple',
    'finns-fantastic-food-machine': "Finn's Fantastic Food Machine",
    'fireboy-and-watergirl-1': 'Fireboy & Watergirl 1: Forest Temple',
    'fireboy-and-watergirl-2': 'Fireboy & Watergirl 2: Light Temple',
    'fireboy-and-watergirl-3': 'Fireboy & Watergirl 3: Ice Temple',
    'fireboy-and-watergirl-4': 'Fireboy & Watergirl 4: Crystal Temple',
    'fireboyandwatergirl2': 'Fireboy & Watergirl 2: Light Temple HD',
    'fireboyandwatergirl3': 'Fireboy & Watergirl 3: Ice Temple HD',
    'fireboyandwatergirl4': 'Fireboy & Watergirl 4: Crystal Temple HD',
    'fireboywatergirlforesttemple': 'Fireboy & Watergirl Forest Temple',
    'fireice': 'Fire & Ice Duo Runner',
    'firewater': 'Fire & Water Island Quest',
    "Five Nights at Freddy's 2": "Five Nights at Freddy's 2",
    "Five Nights at Freddy's 3": "Five Nights at Freddy's 3",
    "Five Nights at Freddy's 4": "Five Nights at Freddy's 4",
    "Five Nights at Freddy's 4_ Halloween": "Five Nights at Freddy's 4: Halloween Edition",
    "Five Nights at Freddy's_ World": "FNAF World RPG",
    'flappy-defense': 'Flappy Defense',
    'flashtetris': 'Flash Tetris Classic',
    'flippy-fish': 'Flippy Fish',
    'flood-runner-2': 'Flood Runner 2',
    'floodrunner2': 'Flood Runner 2 Armageddon',
    'floodrunner3': 'Flood Runner 3',
    'floodrunner4': 'Flood Runner 4',
    'fnaf2': "Five Nights at Freddy's 2 Web",
    'fnaf3': "Five Nights at Freddy's 3 Web",
    'fnaf4': "Five Nights at Freddy's 4 Web",
    'footballbros': 'Football Bros',
    'footballlegends': 'Football Legends 2021',
    'freerider3': 'Free Rider 3 Canvas',
    'friendlyfire': 'Friendly Fire Tank Battle',
    'froggys-battle': "Froggy's Battle",
    'frying-nemo': 'Frying Nemo',
    'FullScreenMario': 'Full Screen Super Mario Bros',
    'funnybattle': 'Funny Battle Simulator',
    'funnybattle2': 'Funny Battle Simulator 2',
    'funnymadracing': 'Funny Mad Racing',
    'funnyshooter2': 'Funny Shooter 2: Survival FPS',
    'game-inside': 'A Game Inside A Game',
    'generic-fishing-game': 'Generic Fishing Game',
    'geodash': 'Geometry Dash Arcade',
    'geodash-2': 'Geometry Dash Meltdown',
    'geodash-subzero': 'Geometry Dash SubZero',
    'geolite': 'Geometry Dash Lite Web',
    'geometrydashlite': 'Geometry Dash Lite',
    'geometryvibes': 'Geometry Vibes Neon Rush',
    'geometry_jump_sketchy': 'Geometry Jump Sketch Edition',
    'georgeandtheprinter': 'George and the Haunted Printer',
    'getawayshootout': 'Getaway Shootout 2 Player',
    'getontop': 'Get On Top Physics Duel',
    'getting-over-it': 'Getting Over It with Bennett Foddy Web',
    'gimme-the-airpod': 'Gimme The Airpod',
    'gladihoppers': 'Gladihoppers Arena Combat',
    'glass-city': 'Glass City 3D Driver',
    'go-ball': 'Go Ball Rolling Maze',
    'goodnight': 'Good Night Dream Journey',
    'google-feud': 'Google Feud Quiz',
    'googlebaseball': 'Google Baseball Doodle',
    'googledino': 'Google Chrome Dino T-Rex 3D',
    'gopher': 'Gopher Hole Excavator',
    'granny': 'Granny Chapter One Web',
    'granny2': 'Granny Chapter Two Web',
    'gravity-soccer': 'Gravity Soccer Physics',
    'greybox': 'Grey Box Testing Chamber',
    'greyboxtesting': 'Grey Box Advanced Physics',
    'grindcraft': 'GrindCraft Clicker (Minecraft Style)',
    'grow-in-the-hole': 'Grow in the Hole Golf',
    'guesstheiranswer': 'Guess Their Answer Quiz',
    'gun-mayhem': 'Gun Mayhem',
    'gun-mayhem-2': 'Gun Mayhem 2: More Mayhem',
    'gun-mayhem-redux': 'Gun Mayhem Redux',
    'gunspin': 'GunSpin Physics Revolver',
    'hackertype': 'HackerTyper Pro Terminal',
    'hanger2': 'Hanger 2 Ragdoll Rope Swing',
    'happy-hop': 'Happy Hop: Kawaii Jump',
    'hba': 'HBA Basketball Association',
    'helicopter': 'Helicopter Classic Game',
    'helios': 'Helios Space Flight',
    'helixjump': 'Helix Jump 3D',
    'hexempire': 'Hex Empire World Dominance',
    'HexGL': 'HexGL Futuristic Cyber Racer',
    'highwaytraffic': 'Highway Traffic Speedster',
    'hillclimbracinglite': 'Hill Climb Racing Lite',
    'holeio': 'Hole.io City Devourer',
    'house-of-hazards': 'House of Hazards Multiplayer',
    'hoverracerdrive': 'Hover Racer Drive 3D',
    'icypurplehead2': 'Icy Purple Head 2',
    'icypurplehead3': 'Icy Purple Head 3: Super Slide',
    'icys-purple-head': "Icy's Purple Head",
    'idle-shark': 'Idle Shark Tycoon',
    'impossiblequiz': 'The Impossible Quiz Classic',
    'Indev': 'Minecraft Indev Version WASM',
    'ironsnout': 'Iron Snout: Pig vs Wolves',
    'iscribble-io': 'iScribble.io Drawing & Guessing',
    'jelly-truck': 'Jelly Truck Soft Physics',
    'jimothy-piggerton': 'Jimothy Piggerton',
    'johnnytrigger': 'Johnny Trigger Action FPS',
    'jumpingshell': 'Jumping Shell Thinking Puzzle',
    'just-one-boss': 'Just One Boss Dungeon Fight',
    'justfall': 'Just Fall.LOL Hexagon',
    'karatebros': 'Karate Bros Martial Arts',
    'kart-fight-io': 'Kart Fight.io Crash Arena',
    'kartbros': 'Kart Bros Multiplayer Racing',
    'kirka': 'Kirka.io FPS Multiplayer',
    'kitchen-gun-game': 'Kitchen Gun Game',
    'kittencannon': 'Kitten Cannon Launch',
    'klocki': 'Klocki Minimalist Puzzle',
    'konnekt': 'Konnekt Cyber Grid',
    'krunker': 'Krunker.io Pixel FPS',
    'learntofly2': 'Learn to Fly 2 Penguin Launch',
    'learntofly3': 'Learn to Fly 3 Space Mission',
    'learntoflyidle': 'Learn to Fly Idle Simulator',
    'leveldevil': 'Level Devil: Troll Platformer',
    'line-rider': 'Line Rider 6.2 Drawing Canvas',
    'linquest': 'Linquest Pixel Adventure',
    'madalin-stunt-cars-2': 'Madalin Stunt Cars 2',
    'madalin-stunt-cars-3': 'Madalin Stunt Cars 3',
    'makeitmeme': 'Make It Meme Party Game',
    'marvinspectrum': "Marvin's Spectrum Color Switch",
    'matrixrampage': 'Matrix Rampage Agent Combat',
    'meat-boy': 'Super Meat Boy Classic Flash',
    'melonplayground': 'Melon Playground Sandbox Simulator',
    'meme2048': 'Meme 2048',
    'mergeroundracers': 'Merge Round Racers Tycoon',
    'mini-stilts': 'Mini Stilts Balancing Jumper',
    'miniputt': 'Mini Putt Classic Golf 18 Holes',
    'missiles': 'Missiles! Jet Dogfight Evasion',
    'monkeymart': 'Monkey Mart Store Manager',
    'monstertracks': 'Monster Tracks Big Wheels',
    'moto-x3m': 'Moto X3M Bike Race',
    'moto-x3m-2': 'Moto X3M 2',
    'moto-x3m-pool-party': 'Moto X3M 5: Pool Party',
    'moto-x3m-spooky-land': 'Moto X3M 6: Spooky Land',
    'moto-x3m-winter': 'Moto X3M 4: Winter',
    'my-friend-pedro': 'My Friend Pedro: Blood Bullets Bananas',
    'ninjavsevilcorp': 'Ninja vs Evilcorp',
    'noobminer': 'Noob Miner: Jailbreak Craft',
    'ns-shaft': 'NS-Shaft Downward Fall',
    'OfflineParadise': 'Offline Paradise Burnout Driver',
    'om-bounce': 'Om Bounce Cut The Rope',
    'one-screen-run': 'One Screen Run',
    'one-screen-run-2': 'One Screen Run 2',
    'oppositeday': 'Opposite Day Reversible Platformer',
    'osu': 'osu! Web Rhythm Mania',
    'ovo': 'OvO Speedrun Parkour',
    'ovo2': 'OvO 2 Parkour Dimensions',
    'ovo3dimensions': 'OvO Dimensions',
    'packabunchas': 'Pack a Bunchas Animal Puzzle',
    'pacman-fps': 'Pac-Man First Person 3D FPS',
    'pandemic2': 'Pandemic 2 Evolution Virus',
    'papa-louie': 'Papa Louie 1: When Pizzas Attack!',
    'papascheeseria': "Papa's Cheeseria",
    'papascupcakeria': "Papa's Cupcakeria",
    'paperio2': 'Paper.io 2 Territory Conquest',
    'papery-planes': 'Papery Planes Wind Navigator',
    'parkingfury': 'Parking Fury Night City',
    'parkingfury2': 'Parking Fury 2',
    'parkingfury3': 'Parking Fury 3',
    'particle-clicker': 'Particle Clicker CERN Simulator',
    'path-finder': 'Path Finder 3D',
    'pe-noire': 'PE Noire Detective Noir',
    'physicsplayground': 'Physics Playground 2D Sandbox',
    'picosschool': "Pico's School Classic",
    'pikwip': 'Pikwip Tethered Duo',
    'pingpongchaos': 'Ping Pong Chaos 2 Player',
    'pixel-cave': 'Pixel Cave Dungeon Delver',
    'pixelspeedrun': 'Pixel Speedrun Timer',
    'pizzeria-simulator': 'Freddy Fazbear’s Pizzeria Simulator',
    'plonky': 'Plonky The Physics Blob',
    'polybranch': 'Polybranch Endless 3D Run',
    'polytrack': 'PolyTrack Low-Poly Time Trial Racing',
    'poorbunny': 'Poor Bunny Carrot Eater',
    'popcat-classic': 'PopCat Classic Clicker',
    'portalflash': 'Portal: The Flash Version',
    'pou': 'Pou Virtual Alien Pet',
    'ppsspp-web-wasm': 'PPSSPP Web Emulator (Sony PSP)',
    'precision-client': 'Precision Client Eaglercraft',
    'protektor': 'Protektor Colony Defense',
    'push-the-square': 'Push The Square Sokoban',
    'push-your-luck': 'Push Your Luck Dice Roller',
    'pushback': 'Pushback Physics Sumo',
    'puzzle-ball': 'Puzzle Ball Slide Maze',
    'pvz-2': 'Plants vs. Zombies 2 Web Clone',
    'q1k3': 'Q1K3 (Quake 1K JavaScript Engine)',
    'rabbit-samurai': 'Rabbit Samurai Grapple Hero',
    'rabbit-samurai2': 'Rabbit Samurai 2 Grappling Quest',
    'racer': 'Racer Retro Neon Highway',
    'radiusraid': 'Radius Raid Space Arena Shooter',
    'ragdollarchers': 'Ragdoll Archers Bow Duel',
    'ragdollhit': 'Ragdoll Hit Physics Fighter',
    'ragdollsoccer': 'Ragdoll Soccer 2 Player',
    'redball4vol1': 'Red Ball 4: Volume 1',
    'redball4vol2': 'Red Ball 4: Volume 2',
    'redball4vol3': 'Red Ball 4: Volume 3',
    'ResentClient5.1': 'Resent Client 5.1 Eaglercraft',
    'retrobowlcollege': 'Retro Bowl College Edition',
    'retrohaunt': 'Retro Haunt Spooky 8-Bit Quest',
    'retrohighway': 'Retro Highway Motorcycle Rush',
    'retropingpong': 'Retro Ping Pong Arcade',
    'riddleschool2': 'Riddle School 2',
    'riddleschool3': 'Riddle School 3',
    'riddletransfer': 'Riddle Transfer 1',
    'riddletransfer2': 'Riddle Transfer 2',
    'rise-of-neon-square': 'Rise of Neon Square',
    'roadblocks': 'Roadblocks 3D Obstacle Runner',
    'rocketsoccerderby': 'Rocket Soccer Derby (Rocket League 3D)',
    'rocking-sky-trip': 'Rocking Sky Trip Ball Roll',
    'rolling-forests': 'Rolling Forests Nature Slope',
    'rolly-vortex': 'Rolly Vortex High-Speed Tunnel',
    'rooftop-snipers': 'Rooftop Snipers Duel',
    'rooftopsniper': 'Rooftop Snipers Classic',
    'rooftopsnipers2': 'Rooftop Snipers 2',
    'run-3': 'Run 3 Outer Space Tunnel',
    'run': 'Run 1 Space Tunnel',
    'run2': 'Run 2 Skater & Runner',
    'run3': 'Run 3 Galaxy Explorer',
    'sandgame': 'Sand Game Powder Physics',
    'scrambled-eggs': 'Scrambled Eggs Kitchen Cooking',
    'scrapmetal': 'Scrap Metal 3D Realistic Stunt Sandbox',
    'senya-and-oscar-2': 'Senya and Oscar 2',
    'sg': 'Space Gladiators Arena',
    'shadow-world-adventure': 'Shadow World Adventure',
    'shards': 'Shards Brick Breaker Neon',
    'shift-flash': 'Shift 1 Monochrome Inversion',
    'shift-flash-2': 'Shift 2 Double Inversion',
    'short-life-2': 'Short Life 2 Ragdoll Survival',
    'short-ride': 'Short Ride Bicycle Survival',
    'shortlife': 'Short Life Ragdoll Obstacles',
    'shuttledeck': 'Shuttledeck Starship Navigation',
    'skyblock': 'Skyblock 2D Survival Island',
    'sleepingbeauty': 'Sleeping Beauty Fairy Tale Quest',
    'slice-of-sasha': 'Slice of Sasha Pizza Ninja',
    'slither': 'Slither Snake IO Classic',
    'slither snake': 'Slither Snake Neon Arena',
    'slitherio': 'Slither.io Snake Battle',
    'slope-ball': 'Slope Ball Neon Geometry',
    'slope2': 'Slope 2 Cyber Tunnel',
    'slope2player': 'Slope 2 Player Split-Screen',
    'slope3': 'Slope 3 Infinite Speed Run',
    'slowroads': 'Slow Roads Procedural Scenic Driving',
    'sm63': 'Super Mario 63 Flash Full Game',
    'sm64': 'Super Mario 64 N64 Web Engine',
    'smashkarts': 'Smash Karts 3D Battle Royale',
    'smokingbarrels': 'Smoking Barrels Wild West Gunslinger',
    'snake': 'Classic Retro Nokia Snake',
    'snes': 'Super Nintendo (SNES) Emulator Hub',
    'snowballio': 'Snowball.io Polar Bumper Arena',
    'snowbattle': 'Snow Battle io Blizzard Brawl',
    'snowrider': 'Snow Rider 3D Sledding Rush',
    'snowroad': 'Snow Road 3D Alpine Descent',
    'soccerbros': 'Soccer Bros Multiplayer Pitch',
    'soccerrandom': 'Soccer Random 2 Player',
    'soldier-legend': 'Soldier Legend Alien Defense',
    'sonic-the-hedgehog': 'Sonic the Hedgehog Genesis Remaster',
    'soundboard': 'Meme & Sound Effects Soundboard',
    'spacebarclicker': 'Spacebar Clicker Speed Test',
    'spacegarden': 'Space Garden Cosmic Flora',
    'spacehuggers': 'Space Huggers Retro Pixel Shooter',
    'spaceinvaders': 'Space Invaders 1978 Arcade',
    'spaceiskey': 'Space is Key One-Button Jump',
    'spaceiskey2': 'Space is Key 2 Extreme',
    'spacewaves': 'Space Waves Neon Geometry Rhythm',
    'speedstars': 'Speed Stars Olympic Track Sprint',
    'spelunky': 'Spelunky Classic HTML5 Roguelike',
    'sprunki': 'Sprunki Incredibox Horror Edition',
    'Squid Gun Fest': 'Squid Gun Fest Runner',
    'ssf': 'Super Smash Flash 1',
    'stack-bump-3d': 'Stack Bump 3D Helix Ball',
    'stacktower': 'Stack Tower Precision Builder',
    'stacktris': 'Stacktris Physics Tetris',
    'stateio': 'State.io Territory War Strategy',
    'station-141': 'Station 141 Deep Space Sci-Fi',
    'stealingthediamond': 'Stealing the Diamond (Henry Stickmin)',
    'stick-archers-battle': 'Stick Archers Battle 2 Player',
    'stickarchersbattle': 'Stick Archers Battle',
    'stickclimb': 'Stick Climb Cliffhanger',
    'stickfighter': 'Stick Fighter Karate Brawler',
    'stickman': 'Stickman Ragdoll Parkour',
    'stickman-boost': 'Stickman Boost Epic Jump',
    'stickman-dismount': 'Stickman Dismount Crash Physics',
    'stickman-epic-battle': 'Stickman Epic Battle Simulator',
    'stickman-golf': 'Stickman Golf 2D Course',
    'Stickman-Survival': 'Stickman Survival Bullet Hell',
    'stickmerge': 'Stick Merge Gun Fusion & Defense',
    'stormthehouse2': 'Storm the House 2 Bunker Defense',
    'subway-surfers-san-francisco': 'Subway Surfers: San Francisco',
    'subwaysurfersbeijing': 'Subway Surfers: Beijing Tour',
    'subwaysurfershavana': 'Subway Surfers: Havana Tour',
    'subwaysurferssanfrancisco': 'Subway Surfers: San Francisco Edition',
    'super-mario-maker-online': 'Super Mario Maker Online Web',
    'super-puffer-fish-3d': 'Super Puffer Fish 3D',
    'superbikethechampion': 'Superbike the Champion Moto GP',
    'superhero-io': 'Superhero.io Marvel Battle Arena',
    'superhot': 'SUPERHOT Time Moves When You Move',
    'superliquidsoccer': 'Super Liquid Soccer 3D',
    'superstarcar': 'Super Star Car Formula 1',
    'survivio': 'Surviv.io 2D Battle Royale',
    'swerve': 'Swerve Highway Drift',
    'synesthesia': 'Synesthesia Audio-Visual Rhythm',
    'tabletennisworldtour': 'Table Tennis World Tour 3D',
    'tactical-weapon-pack-2': 'Tactical Weapon Pack 2 Armory',
    'tacticalassasin2': 'Tactical Assassin 2 Sniper Contract',
    'tag': 'Tag! 4-Player Split Keyboard Tag',
    'tail-of-the-dragon': 'Tail of the Dragon Pixel RPG',
    'tam-indian-truck-simulator-3d': 'Indian Truck Simulator 3D Heavy Cargo',
    'tank-trouble-2': 'Tank Trouble 2 Maze Duel',
    'tanuki-sunset': 'Tanuki Sunset Longboard Skate',
    'taproad': 'Tap Road Neon Rolling Rush',
    'temple-run-2': 'Temple Run 2 Jungle Escape',
    'templeofboom': 'Temple of Boom Gun Platformer',
    'templerun': 'Temple Run Classic Relic Runner',
    'templerun2': 'Temple Run 2 Endless Odyssey',
    'territorialio': 'Territorial.io World Map Strategy',
    'the-final-earth': 'The Final Earth Space Colony',
    'the-final-earth-2': 'The Final Earth 2 Sci-Fi Builder',
    'the-impossible-quiz-2': 'The Impossible Quiz 2',
    'the-little-giant': 'The Little Giant Micro Platformer',
    'thebattle': 'The Battle of Ancient Legions',
    'theimpossiblequiz': 'The Impossible Quiz 1 Full',
    'theimpossiblequiz2': 'The Impossible Quiz 2 Full',
    'themazeofspacegoblins': 'The Maze of Space Goblins',
    'thereisnog': 'There Is No Game: Not A Game',
    'theyarecoming': 'They Are Coming Zombie Defense',
    'thisistheonlyleveltoo': 'This is the Only Level TOO (Part 2)',
    'time-shooter-3': 'Time Shooter 3: SWAT Slow-Mo',
    'timeshooter2': 'Time Shooter 2 SWAT Slow-Mo',
    'timeshooter3': 'Time Shooter 3 SWAT Special Ops',
    'tiny-fragments': 'Tiny Fragments Puzzle',
    'tiny-islands': 'Tiny Islands Procedural Board',
    'tombofthemask': 'Tomb of the Mask Retro Maze',
    'topple-adventure': 'Topple Adventure Physics Balance',
    'tosstheturtle': 'Toss the Turtle Cannon Blast',
    'tough-growth': 'Tough Growth Minimalist Dodging',
    'towermaster': 'Tower Master Precision Stacking',
    'townscaper': 'Townscaper Web Canvas Procedural Town',
    'trapthecat': 'Trap The Cat Hexagonal Grid',
    'trimps': 'Trimps Incremental Civilization RPG',
    'triviacrack': 'Trivia Crack Knowledge Duel',
    'tube-jumpers': 'Tube Jumpers Waves & Obstacles',
    'tubejumpers': 'Tube Jumpers 2 Player Duel',
    'tunnelz': 'Tunnelz Hyperspace Warp',
    'tv-static': 'TV Static White Noise Synth',
    'twitch-tetris': 'Twitch Tetris Grandmaster Edition',
    'underrun': 'Underrun 13K Cyberpunk Roguelike',
    'Undertale Yellow': 'Undertale Yellow (Fan Prequel Game)',
    'Undertale': 'Undertale Complete Browser Edition',
    'unfold-2': 'Unfold 2 Paper Folding Puzzle',
    'unicyclehero': 'Unicycle Hero Olympic Ragdoll',
    'up-left-out': 'Up Left Out Minimalist Logic',
    'veloce': 'Veloce High Velocity 3D Driving',
    'vex3': 'Vex 3 Platformer',
    'vex7': 'Vex 7 Deadly Parkour',
    'vex8': 'Vex 8 Extreme Obstacles',
    'vexx3m': 'Vex X3M Motorcycle Parkour',
    'vexx3m2': 'Vex X3M 2 Stunt Moto',
    'volleyrandom': 'Volley Random 2 Player',
    'wartheknights': 'War of the Knights Castle Siege',
    'webretro': 'WebRetro Multi-Core Emulator System',
    'wheeliebike': 'Wheelie Bike Balancing Challenge',
    'wheely': 'Wheely 1 Little Car Adventure',
    'wheely2': 'Wheely 2 Love Quest',
    'wheely3': 'Wheely 3 Catch the Wheel',
    'wheely4': 'Wheely 4 Time Travel',
    'wheely5': 'Wheely 5 Armageddon',
    'wheely6': 'Wheely 6 Fairytale',
    'wheely7': 'Wheely 7 Detective',
    'wheely8': 'Wheely 8 Aliens',
    'winter-falling-price': 'Winter Falling: Battle Tactics',
    'wipo': 'Wipo Cute 2D Adventure',
    'wolf3d': 'Wolfenstein 3D 1992 ID Software FPS',
    'wordleunlimited': 'Wordle Unlimited Daily Challenge',
    'worldshardestgame2': "The World's Hardest Game 2",
    'worldshardestgame3': "The World's Hardest Game 3",
    'wrestlebros': 'Wrestle Bros 2 Player Wrestling',
    'x-trial-racing': 'X-Trial Racing Mountain Moto',
    'xx142-b2exe': 'XX142-B2.exe Cyber Anomaly',
    'yoshifabrication': "Yoshi's Island Fabrication",
    'you-are-bezos': 'You Are Jeff Bezos Wealth Simulator',
    'zig-zag': 'Zig Zag Neon Endless Ball',
    'zombierush': 'Zombie Rush Survival Wave',
    'zombocalypse': 'Zombocalypse Apocalyptic Survival',
    'zombs-royale': 'Zombs Royale.io Battle Royale 2D'
  };

  if (nameMap[seg]) return nameMap[seg];

  // Title formatting: camelCase, kebab-case, snake_case -> Title Case
  let title = seg
    .replace(/[-_]/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .trim();

  return title.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

// Load existing games
const existing = JSON.parse(fs.readFileSync('./public/games.json', 'utf-8'));
const existingTitles = new Set(existing.map(g => g.title.toLowerCase().replace(/[^a-z0-9]/g, '')));
const existingIds = new Set(existing.map(g => g.id.toLowerCase()));

let added = 0;
const merged = [...existing];

for (let i = 0; i < rawGameUrls.length; i++) {
  const url = rawGameUrls[i];
  const segment = url.split('/').pop();
  const title = cleanTitle(segment);
  const normalizedTitle = title.toLowerCase().replace(/[^a-z0-9]/g, '');

  if (existingTitles.has(normalizedTitle)) {
    // If existing game has empty iframeSrc, or needs an update, enrich it
    const found = merged.find(g => g.title.toLowerCase().replace(/[^a-z0-9]/g, '') === normalizedTitle);
    if (found && (!found.iframeSrc || found.iframeSrc === 'internal://' + found.id)) {
      found.iframeSrc = url;
    }
    continue;
  }

  let slug = segment.toLowerCase().replace(/\.html?$/i, '').replace(/[^a-z0-9]/g, '-');
  if (existingIds.has(slug)) {
    slug = `${slug}-pg-${i}`;
  }

  const category = assignCategory(title);
  const iconName = iconPool[i % iconPool.length];
  const thumbnailGradient = gradientPool[i % gradientPool.length];

  merged.push({
    id: slug,
    title: title,
    category: category,
    description: `Play ${title} unblocked. Fast, responsive, full-screen gameplay directly in your browser.`,
    controls: '[WASD / Arrow Keys] Move & Navigate, [Space / Click / Enter] Action, [Esc] Pause',
    iframeSrc: url,
    thumbnail: '',
    thumbnailGradient: thumbnailGradient,
    iconName: iconName,
    featured: added < 20 || title.includes('Mario') || title.includes('Minecraft') || title.includes('FNAF') || title.includes('Zombies') || title.includes('Slope'),
    rating: Number((4.6 + ((i % 4) * 0.1)).toFixed(1)),
    plays: 25000 + ((i * 1234) % 350000),
    source: 'PastPaperGenie'
  });

  existingTitles.add(normalizedTitle);
  existingIds.add(slug);
  added++;
}

console.log(`Added ${added} new unique games! Total library size: ${merged.length}`);

// Write to public/games.json
fs.writeFileSync('./public/games.json', JSON.stringify(merged, null, 2));

// Generate src/data/defaultGames.js with full list
const defaultGamesContent = `import { standaloneGameHtml, createDataUri, generatePlayableGameHtml } from './gameTemplates';

// Consolidated unblocked games dataset - Total: ${merged.length} games
export const defaultGamesList = ${JSON.stringify(merged, null, 2)};

export function resolveGameUrl(game) {
  if (!game) return '';

  // 1. If explicit iframeSrc is provided
  if (game.iframeSrc) {
    // Direct match in standaloneGameHtml by game.id
    if (standaloneGameHtml[game.id]) {
      return createDataUri(standaloneGameHtml[game.id]);
    }

    // Direct match in standaloneGameHtml by iframeSrc
    const cleanSrc = game.iframeSrc.replace('.html', '').replace('internal://', '');
    if (standaloneGameHtml[cleanSrc]) {
      return createDataUri(standaloneGameHtml[cleanSrc]);
    }

    // If iframeSrc is an external web URL (http:// or https://) or data URI
    if (game.iframeSrc.startsWith('http://') || game.iframeSrc.startsWith('https://') || game.iframeSrc.startsWith('data:')) {
      return game.iframeSrc;
    }
  }

  // 2. Direct match in standaloneGameHtml by game.id
  if (standaloneGameHtml[game.id]) {
    return createDataUri(standaloneGameHtml[game.id]);
  }

  // 3. If iframeHtml contains an external url or valid script/markup
  if (game.iframeHtml) {
    const srcMatch = game.iframeHtml.match(/src=["']([^"']+)["']/i);
    if (srcMatch && srcMatch[1]) {
      const extractedSrc = srcMatch[1];
      if (extractedSrc.startsWith('http://') || extractedSrc.startsWith('https://') || extractedSrc.startsWith('data:')) {
        return extractedSrc;
      }
    }
    if (game.iframeHtml.includes('<script') || game.iframeHtml.includes('<canvas') || game.iframeHtml.includes('<!DOCTYPE') || game.iframeHtml.includes('<link')) {
      return createDataUri(game.iframeHtml);
    }
  }

  // 4. Generate dynamic custom playable game engine HTML
  return createDataUri(generatePlayableGameHtml(game));
}
`;

fs.writeFileSync('./src/data/defaultGames.js', defaultGamesContent);
console.log('Successfully saved to public/games.json and src/data/defaultGames.js!');
