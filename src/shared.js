import { useState, useEffect } from "react";

export const ACCENTS = [
  { name: "magenta", from: "#FF2D78", to: "#FF6B9D", ink: "#3D0420" },
  { name: "violet",  from: "#7C3AED", to: "#A78BFA", ink: "#21063F" },
  { name: "cyan",    from: "#06B6D4", to: "#38E0F0", ink: "#022C36" },
  { name: "lime",    from: "#84CC16", to: "#BEF264", ink: "#1A2E03" },
  { name: "amber",   from: "#F59E0B", to: "#FBBF24", ink: "#3A2503" },
  { name: "coral",   from: "#FB5607", to: "#FF8E53", ink: "#3A1402" },
  { name: "indigo",  from: "#4361EE", to: "#7B93FF", ink: "#06103A" },
  { name: "teal",    from: "#14B8A6", to: "#5EEAD4", ink: "#04302B" },
];

export const PRIORITIES = {
  high:   { label: "High",   rank: 0, color: "#FF2D78" },
  medium: { label: "Medium", rank: 1, color: "#F59E0B" },
  low:    { label: "Low",    rank: 2, color: "#38BDF8" },
};

export const STATUSES = {
  active:  { label: "Active",  dot: "#22D3EE" },
  waiting: { label: "Waiting", dot: "#FBBF24" },
  done:    { label: "Done",    dot: "#4ADE80" },
};

export const EFFORT = {
  quick: { label: "Quick", color: "#4ADE80", icon: "⚡" },
  big:   { label: "Big",   color: "#A78BFA", icon: "◆" },
};

export const uid = (p = "t") => p + "_" + Math.random().toString(36).slice(2, 9);

// ---- viewport hook ----------------------------------------------
export function useIsMobile(bp = 680) {
  const [m, setM] = useState(typeof window !== "undefined" ? window.innerWidth <= bp : false);
  useEffect(() => {
    const on = () => setM(window.innerWidth <= bp);
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, [bp]);
  return m;
}

// ---- date helpers ------------------------------------------------
export const startOfToday = () => { const d = new Date(); d.setHours(0,0,0,0); return d; };
export const parseDate = (s) => { if (!s) return null; const d = new Date(s + "T00:00:00"); return isNaN(d) ? null : d; };
export const fmtDate = (s) => {
  const d = parseDate(s); if (!d) return "";
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
};
export const dayDelta = (s) => {
  const d = parseDate(s); if (!d) return null;
  return Math.round((d - startOfToday()) / 86400000);
};
export const dueMeta = (s) => {
  const n = dayDelta(s);
  if (n === null) return null;
  if (n < 0)  return { text: `${Math.abs(n)}d overdue`, tone: "#FF2D78" };
  if (n === 0) return { text: "Today", tone: "#FB5607" };
  if (n === 1) return { text: "Tomorrow", tone: "#F59E0B" };
  if (n <= 7) return { text: `${n}d`, tone: "#FBBF24" };
  return { text: fmtDate(s), tone: "#94A3B8" };
};

// ---- week/calendar helpers --------------------------------------
export const ymd = (d) => {
  const x = new Date(d); x.setHours(0,0,0,0);
  return `${x.getFullYear()}-${String(x.getMonth()+1).padStart(2,"0")}-${String(x.getDate()).padStart(2,"0")}`;
};
export const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate()+n); x.setHours(0,0,0,0); return x; };
// Monday as start of week
export const startOfWeek = (d) => {
  const x = new Date(d); x.setHours(0,0,0,0);
  const day = (x.getDay() + 6) % 7; // Mon=0 ... Sun=6
  return addDays(x, -day);
};
export const DOW = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
export const fmtTime = (t) => {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  const am = h < 12; const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}${m ? ":" + String(m).padStart(2,"0") : ""}${am ? "am" : "pm"}`;
};

// ---- shopping categories ----------------------------------------
// A free, offline keyword map. Order matters: the first category whose
// keyword appears in the item name wins, so list more specific terms first.
// Matching is substring-based and case-insensitive, so "yoghurts",
// "greek yoghurt" and "yog" all match "yog".
export const SHOP_CATEGORIES = [
  { key: "fruitveg", label: "Fruit & veg", keywords: [
    "apple","banana","orange","lemon","lime","grape","berry","berries","strawberr","raspberr","blueberr","melon","pineapple","mango","peach","pear","plum","kiwi","avocado","tomato","potato","onion","garlic","carrot","broccoli","cauliflower","spinach","lettuce","salad","cucumber","pepper","courgette","aubergine","mushroom","celery","leek","cabbage","sprout","bean","pea","corn","sweetcorn","squash","pumpkin","ginger","herb","basil","coriander","parsley","mint","veg","fruit","banan" ] },
  { key: "dairy", label: "Dairy & eggs", keywords: [
    "milk","cheese","yog","yoghurt","yogurt","butter","cream","creme","custard","egg","margarine","brie","cheddar","mozzarella","parmesan","feta","halloumi","quark","kefir","oatly","almond milk","soy milk" ] },
  { key: "meatfish", label: "Meat & fish", keywords: [
    "chicken","beef","mince","pork","lamb","bacon","sausage","ham","turkey","steak","fish","salmon","tuna","cod","haddock","prawn","shrimp","mackerel","sardine","duck","gammon","chorizo","salami","pepperoni","meat" ] },
  { key: "bakery", label: "Bakery", keywords: [
    "bread","loaf","roll","bagel","baguette","sourdough","croissant","bun","wrap","tortilla","pitta","naan","muffin","cake","crumpet","brioche","pastry","scone","doughnut","donut" ] },
  { key: "frozen", label: "Frozen", keywords: [
    "frozen","ice cream","ice-cream","lolly","peas frozen","chips","fish finger","waffle" ] },
  { key: "pantry", label: "Cupboard & dry", keywords: [
    "pasta","rice","noodle","flour","sugar","salt","oil","vinegar","sauce","ketchup","mayo","mustard","beans","lentil","chickpea","tin","tinned","can ","soup","stock","spice","seasoning","cereal","oats","porridge","granola","honey","jam","peanut butter","nutella","spread","biscuit","cracker","crisp","snack","nut","raisin","chocolate","sweet","crackers","tea","coffee","cocoa","gravy","curry","couscous","quinoa","tomato paste","passata","coconut milk" ] },
  { key: "drinks", label: "Drinks", keywords: [
    "water","juice","squash","cordial","fizzy","cola","coke","lemonade","soda","beer","wine","lager","cider","gin","vodka","whisky","spirit","drink","smoothie","kombucha","tonic" ] },
  { key: "household", label: "Household", keywords: [
    "bin bag","bin liner","kitchen roll","toilet roll","loo roll","tissue","washing","detergent","fabric","softener","cleaner","bleach","spray","sponge","cloth","foil","clingfilm","cling film","baking paper","battery","batteries","bulb","candle","matches","washing up","dishwasher","tablet" ] },
  { key: "toiletries", label: "Toiletries & health", keywords: [
    "shampoo","conditioner","soap","shower gel","toothpaste","toothbrush","deodorant","razor","shaving","moisturiser","sun cream","suncream","plaster","paracetamol","ibuprofen","vitamin","tampon","sanitary","nappy","nappies","wipe","cotton","floss","mouthwash","tissues" ] },
  { key: "baby", label: "Baby & kids", keywords: [
    "formula","baby food","puree","rusk" ] },
];

export function categorise(name) {
  const n = (name || "").toLowerCase();
  for (const cat of SHOP_CATEGORIES) {
    if (cat.keywords.some((k) => n.includes(k))) return cat;
  }
  return { key: "other", label: "Other", keywords: [] };
}

// Category display order (matches SHOP_CATEGORIES, with Other always last).
export const SHOP_CATEGORY_ORDER = [
  ...SHOP_CATEGORIES.map((c) => c.key),
  "other",
];
