// Fursat panorama data: 12 real spaces (owner photos, 8 Nov 2026).
// Shared by PanoramicViewer.astro (server-rendered fallback) and panorama.js (WebGL).
// Captions describe only what is visible in the real photos. No offers, prices or claims.
// Ring order (9 Nov): Bar, Dining, Lounge and Café sit side by side so the wide window rests on all four zones,
// like the reference collage. The story then runs entrance -> bar -> dining -> lounge -> cafe -> ... -> table for two.
export const SPACES = [
{id:'entrance',k:'Arrival',t:'The Entrance',d:'A plant-lined glass corridor leading to the elephant mural: “Fursat, aur kuch nahi!”'},
{id:'bar',k:'Kitchen | Bar',t:'The Bar',d:'Backlit hexagon shelves of bottles around the glowing Fursat sign, under a mirrored ceiling.'},
{id:'dining',k:'Dining room',t:'Dining Room',d:'Blue velvet chairs at dark tables, beside screens of cane and printed fabric panels.'},
{id:'lounge',k:'Lounge',t:'The Lounge',d:'A blush sofa and houndstooth armchairs round a black table, under a white coffered ceiling.'},
{id:'garden-window',k:'Café',t:'Garden Window',d:'Cane armchairs at a tall window lined with indoor trees.'},
{id:'cafe',k:'Café',t:'The Café',d:'The green Fursat Café sign and orange elephant on a warm wall.'},
{id:'mural',k:'Café',t:'The Mural',d:'A hand-painted mural of a woman carrying a tower of flowers, beside a metro train.'},
{id:'sofa-corner',k:'Lounge',t:'Sofa Corner',d:'Soft sofas round a marble table, beside glass walls and indoor trees.'},
{id:'high-tables',k:'Dining hall',t:'High Tables',d:'Marble high tables and leather stools, with a wall of framed prints and the buffet counter behind.'},
{id:'sign-wall',k:'Dining hall',t:'The Red Wall',d:'The glowing Fursat sign on a red wall, framed by travel posters and red banquettes.'},
{id:'booths',k:'Booth seating',t:'The Booths',d:'Red banquettes, bold framed art and a black-and-white geometric floor.'},
{id:'table-for-two',k:'Dining room',t:'Table for Two',d:'A round table with gold-trimmed chairs, set against the cane and fabric screens.'}
];
// The four zones shown in the header row, the thumbnails and the pins (reference layout, 9 Nov).
// `spaces` are in ring order; `pin` is the space the pin and thumbnail point at; `fy` = thumbnail crop height (%); `py` = pin height on the photo (staggered like the reference). The Entrance opens the tour (no zone).
export const ZONES = [
 {id:'bar', py:0.05, fy:38, name:'The Bar', line:'Signature sips & vibes', icon:'spark', spaces:['bar'], pin:'bar'},
 {id:'dining', py:0.15, fy:55, name:'Dining', line:'A feast for every mood', icon:'diamond', spaces:['dining','high-tables','sign-wall','booths','table-for-two'], pin:'dining'},
 {id:'lounge', py:-0.01, fy:78, name:'Lounge', line:'Settle into the vibe', icon:'spark', spaces:['lounge','sofa-corner'], pin:'lounge'},
 {id:'cafe', py:0.16, fy:50, name:'Café', line:'Your everyday escape', icon:'gem', spaces:['garden-window','cafe','mural'], pin:'garden-window'},
];
export const IMGS = {
 "entrance": "/assets/tour/img/entrance.webp",
 "bar": "/assets/tour/img/bar.webp",
 "high-tables": "/assets/tour/img/high-tables.webp",
 "sign-wall": "/assets/tour/img/sign-wall.webp",
 "booths": "/assets/tour/img/booths.webp",
 "dining": "/assets/tour/img/dining.webp",
 "table-for-two": "/assets/tour/img/table-for-two.webp",
 "lounge": "/assets/tour/img/lounge.webp",
 "sofa-corner": "/assets/tour/img/sofa-corner.webp",
 "garden-window": "/assets/tour/img/garden-window.webp",
 "cafe": "/assets/tour/img/cafe.webp",
 "mural": "/assets/tour/img/mural.webp"
};
// Small textures for phones: same file name under img/sm/
export const smallImg = (src) => src.replace('/img/', '/img/sm/');
// Emission masks for real neon signs (derived from the photos, background erased only)
export const EMI = {
 "entrance": "/assets/tour/emi/entrance.webp",
 "bar": "/assets/tour/emi/bar.webp",
 "sign-wall": "/assets/tour/emi/sign-wall.webp",
 "cafe": "/assets/tour/emi/cafe.webp"
};
// Living photos: real clips cut from the Inside Fursat and Veg Combo reels
export const CLIPS = {'entrance':{src:'/assets/tour/clips/entrance.mp4',tag:'The building at Capital Park'},'bar':{src:'/assets/tour/clips/bar.mp4',tag:'The bar sign, on video'},'high-tables':{src:'/assets/tour/clips/high-tables.mp4',tag:'The dining hall, on video'},'cafe':{src:'/assets/tour/clips/cafe.mp4',tag:'Coffee and dessert at the café'},'table-for-two':{src:'/assets/tour/clips/table-for-two.mp4',tag:'From the Fursat kitchen'}};
// Elephant hunt hotspots (uv in the photo, r = radius)
export const HOT = [{s:'entrance',x:.55,y:.53,r:.10},{s:'entrance',x:.665,y:.395,r:.055},{s:'bar',x:.38,y:.535,r:.075},{s:'bar',x:.39,y:.345,r:.065},{s:'sign-wall',x:.545,y:.455,r:.075},{s:'cafe',x:.52,y:.2,r:.15}];
// Auto colour per photo (sampled from each photo)
export const PAL = {"entrance":{"fp":[0.55,0.45],"bg1":[0.1087,0.0696,0.0412],"bg2":[0.0508,0.0325,0.0193],"glowB":[0.5223,0.3108,0.1577],"glowT":[0.2835,0.2144,0.1365],"gold":[0.907,0.6799,0.446],"tint":[0.863,0.7539,0.645],"fa":[0.098,0.0655,0.042],"fb":[0.0392,0.0262,0.0168],"back":[0.0607,0.0425,0.0292]},"bar":{"fp":[0.4,0.48],"bg1":[0.058,0.0644,0.092],"bg2":[0.027,0.0301,0.043],"glowB":[0.51,0.3128,0.17],"glowT":[0.1365,0.1644,0.2835],"gold":[0.898,0.6813,0.455],"tint":[0.863,0.7539,0.645],"fa":[0.0541,0.0601,0.0859],"fb":[0.0216,0.0241,0.0344],"back":[0.0348,0.0387,0.0552]},"high-tables":{"fp":[0.55,0.5],"bg1":[0.0619,0.0747,0.0881],"bg2":[0.0289,0.0349,0.0411],"glowB":[0.51,0.3128,0.17],"glowT":[0.3045,0.1949,0.1155],"gold":[0.8939,0.682,0.4592],"tint":[0.863,0.7539,0.645],"fa":[0.0578,0.0697,0.0822],"fb":[0.0231,0.0279,0.0329],"back":[0.0371,0.0448,0.0529]},"sign-wall":{"fp":[0.53,0.55],"bg1":[0.1087,0.0696,0.0412],"bg2":[0.0508,0.0325,0.0193],"glowB":[0.51,0.2297,0.17],"glowT":[0.3465,0.1882,0.0735],"gold":[0.9168,0.6783,0.4362],"tint":[0.863,0.7231,0.645],"fa":[0.098,0.0655,0.042],"fb":[0.0392,0.0262,0.0168],"back":[0.0607,0.0425,0.0292]},"booths":{"fp":[0.6,0.55],"bg1":[0.0652,0.0753,0.0848],"bg2":[0.0304,0.0351,0.0396],"glowB":[0.51,0.1739,0.17],"glowT":[0.2835,0.1789,0.1365],"gold":[0.8939,0.682,0.4592],"tint":[0.863,0.7024,0.645],"fa":[0.0608,0.0703,0.0792],"fb":[0.0243,0.0281,0.0317],"back":[0.0391,0.0452,0.0509]},"dining":{"fp":[0.6,0.4],"bg1":[0.0455,0.0691,0.1045],"bg2":[0.0212,0.0322,0.0488],"glowB":[0.17,0.2698,0.51],"glowT":[0.1275,0.1934,0.2925],"gold":[0.8939,0.682,0.4592],"tint":[0.7719,0.7524,0.7361],"fa":[0.0425,0.0645,0.0975],"fb":[0.017,0.0258,0.039],"back":[0.0292,0.0418,0.0607]},"table-for-two":{"fp":[0.45,0.38],"bg1":[0.1087,0.0696,0.0412],"bg2":[0.0508,0.0325,0.0193],"glowB":[0.51,0.3724,0.17],"glowT":[0.2835,0.2281,0.1365],"gold":[0.7581,0.6953,0.5949],"tint":[0.8514,0.7738,0.6566],"fa":[0.098,0.0655,0.042],"fb":[0.0392,0.0262,0.0168],"back":[0.0607,0.0425,0.0292]},"lounge":{"fp":[0.5,0.28],"bg1":[0.1087,0.0696,0.0412],"bg2":[0.0508,0.0325,0.0193],"glowB":[0.543,0.3903,0.137],"glowT":[0.2954,0.1891,0.1246],"gold":[0.9164,0.7157,0.4366],"tint":[0.863,0.7796,0.645],"fa":[0.098,0.0655,0.042],"fb":[0.0392,0.0262,0.0168],"back":[0.0607,0.0425,0.0292]},"sofa-corner":{"fp":[0.45,0.3],"bg1":[0.1087,0.0696,0.0412],"bg2":[0.0508,0.0325,0.0193],"glowB":[0.51,0.3216,0.17],"glowT":[0.1365,0.246,0.2835],"gold":[0.9007,0.6848,0.4523],"tint":[0.863,0.7572,0.645],"fa":[0.098,0.0655,0.042],"fb":[0.0392,0.0262,0.0168],"back":[0.0607,0.0425,0.0292]},"garden-window":{"fp":[0.55,0.42],"bg1":[0.0882,0.078,0.0618],"bg2":[0.0412,0.0364,0.0288],"glowB":[0.51,0.3128,0.17],"glowT":[0.2835,0.2041,0.1365],"gold":[0.8939,0.682,0.4592],"tint":[0.863,0.7539,0.645],"fa":[0.0823,0.0728,0.0577],"fb":[0.0329,0.0291,0.0231],"back":[0.0529,0.0468,0.0371]},"cafe":{"fp":[0.5,0.55],"bg1":[0.1087,0.0696,0.0412],"bg2":[0.0508,0.0325,0.0193],"glowB":[0.51,0.3126,0.17],"glowT":[0.2835,0.2022,0.1365],"gold":[0.8664,0.6847,0.4866],"tint":[0.8572,0.7548,0.6508],"fa":[0.098,0.0655,0.042],"fb":[0.0392,0.0262,0.0168],"back":[0.0607,0.0425,0.0292]},"mural":{"fp":[0.5,0.6],"bg1":[0.1087,0.081,0.0412],"bg2":[0.0508,0.0378,0.0193],"glowB":[0.5153,0.371,0.1647],"glowT":[0.2835,0.2096,0.1365],"gold":[0.8665,0.6966,0.4865],"tint":[0.863,0.7751,0.645],"fa":[0.098,0.075,0.042],"fb":[0.0392,0.03,0.0168],"back":[0.0607,0.0478,0.0292]}};
// Background music for the panorama: 60 s seamless loop cut from 0:38-1:40 of the owner-supplied track (256 kbps)
// (Ratchagan BGM, Dark Techno x Opera edit). Off until the visitor taps Sound. LICENCE NEEDED before launch.
export const MUSIC = '/assets/tour/audio/panorama-loop.mp3';
// POV walk-through script
// POV steps name the space by id, so reordering the ring never breaks the script.
export const POV = [{s:'entrance',l:['POV:',"it's Friday,",'9 pm.']},{s:'bar',l:['First stop:','the bar.']},{s:'sign-wall',l:['Neon on.','Glasses up.']},{s:'table-for-two',l:['And this table','could be yours.']}];
