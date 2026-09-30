/**
 * VaultSync / MyPass - Automatic Company Logo Resolver & Fetcher
 * Intelligently maps company / service names (e.g. "GitHub", "Netflix", "Supabase", "ChatGPT", "HP")
 * or URLs to their official high-resolution logo via Google Favicons CDN with multi-tier fallbacks.
 */

const KNOWN_DOMAINS = {
  // Developer, Cloud & Databases
  supabase: 'supabase.com',
  supabse: 'supabase.com',
  supa: 'supabase.com',
  github: 'github.com',
  git: 'github.com',
  gitlab: 'gitlab.com',
  bitbucket: 'bitbucket.org',
  docker: 'docker.com',
  vercel: 'vercel.com',
  clerk: 'clerk.com',
  railway: 'railway.app',
  render: 'render.com',
  netlify: 'netlify.com',
  firebase: 'firebase.google.com',
  aws: 'aws.amazon.com',
  amazonwebservices: 'aws.amazon.com',
  digitalocean: 'digitalocean.com',
  cloudflare: 'cloudflare.com',
  heroku: 'heroku.com',
  mongodb: 'mongodb.com',
  mongo: 'mongodb.com',
  postgres: 'postgresql.org',
  postgresql: 'postgresql.org',
  redis: 'redis.io',
  prisma: 'prisma.io',
  postman: 'postman.com',
  sentry: 'sentry.io',
  datadog: 'datadoghq.com',
  stackoverflow: 'stackoverflow.com',
  npm: 'npmjs.com',
  huggingface: 'huggingface.co',
  replit: 'replit.com',
  codesandbox: 'codesandbox.io',
  codepen: 'codepen.io',
  kaggle: 'kaggle.com',
  grafana: 'grafana.com',

  // Hardware & Tech Manufacturers
  hp: 'hp.com',
  hewlettpackard: 'hp.com',
  dell: 'dell.com',
  lenovo: 'lenovo.com',
  asus: 'asus.com',
  acer: 'acer.com',
  intel: 'intel.com',
  amd: 'amd.com',
  nvidia: 'nvidia.com',
  cisco: 'cisco.com',
  samsung: 'samsung.com',
  sony: 'sony.com',
  lg: 'lg.com',
  logitech: 'logitech.com',

  // AI & Search
  chatgpt: 'chatgpt.com',
  openai: 'openai.com',
  claude: 'anthropic.com',
  anthropic: 'anthropic.com',
  gemini: 'gemini.google.com',
  midjourney: 'midjourney.com',
  google: 'google.com',
  gmail: 'mail.google.com',
  bing: 'bing.com',
  perplexity: 'perplexity.ai',
  deepseek: 'deepseek.com',
  copilot: 'copilot.microsoft.com',
  mistral: 'mistral.ai',
  groq: 'groq.com',

  // Social & Communication
  discord: 'discord.com',
  slack: 'slack.com',
  twitter: 'x.com',
  x: 'x.com',
  facebook: 'facebook.com',
  fb: 'facebook.com',
  meta: 'meta.com',
  instagram: 'instagram.com',
  ig: 'instagram.com',
  linkedin: 'linkedin.com',
  reddit: 'reddit.com',
  whatsapp: 'whatsapp.com',
  telegram: 'telegram.org',
  tiktok: 'tiktok.com',
  youtube: 'youtube.com',
  yt: 'youtube.com',
  pinterest: 'pinterest.com',
  snapchat: 'snapchat.com',
  twitch: 'twitch.tv',
  zoom: 'zoom.us',
  signal: 'signal.org',
  teams: 'teams.microsoft.com',
  threads: 'threads.net',
  mastodon: 'mastodon.social',

  // Productivity & Design
  notion: 'notion.so',
  figma: 'figma.com',
  canva: 'canva.com',
  miro: 'miro.com',
  trello: 'trello.com',
  asana: 'asana.com',
  jira: 'atlassian.com',
  atlassian: 'atlassian.com',
  linear: 'linear.app',
  clickup: 'clickup.com',
  airtable: 'airtable.com',
  dropbox: 'dropbox.com',
  box: 'box.com',
  evernote: 'evernote.com',
  adobe: 'adobe.com',
  microsoft: 'microsoft.com',
  office: 'office.com',
  outlook: 'outlook.com',
  onedrive: 'onedrive.live.com',
  apple: 'apple.com',
  icloud: 'icloud.com',
  grammarly: 'grammarly.com',
  loom: 'loom.com',

  // Entertainment & Streaming
  netflix: 'netflix.com',
  spotify: 'spotify.com',
  disney: 'disneyplus.com',
  disneyplus: 'disneyplus.com',
  hulu: 'hulu.com',
  primevideo: 'primevideo.com',
  prime: 'primevideo.com',
  soundcloud: 'soundcloud.com',
  hbomax: 'max.com',
  max: 'max.com',
  crunchyroll: 'crunchyroll.com',
  hotstar: 'hotstar.com',
  appletv: 'tv.apple.com',
  deezer: 'deezer.com',
  audible: 'audible.com',

  // Gaming
  steam: 'steampowered.com',
  epicgames: 'epicgames.com',
  epic: 'epicgames.com',
  roblox: 'roblox.com',
  playstation: 'playstation.com',
  psn: 'playstation.com',
  xbox: 'xbox.com',
  nintendo: 'nintendo.com',
  riot: 'riotgames.com',
  riotgames: 'riotgames.com',
  blizzard: 'blizzard.com',
  battlenet: 'battle.net',
  ubisoft: 'ubisoft.com',
  ea: 'ea.com',
  origin: 'ea.com',

  // Shopping, Food & Finance
  amazon: 'amazon.com',
  paypal: 'paypal.com',
  stripe: 'stripe.com',
  razorpay: 'razorpay.com',
  shopify: 'shopify.com',
  ebay: 'ebay.com',
  walmart: 'walmart.com',
  target: 'target.com',
  etsy: 'etsy.com',
  uber: 'uber.com',
  airbnb: 'airbnb.com',
  coinbase: 'coinbase.com',
  binance: 'binance.com',
  revolut: 'revolut.com',
  robinhood: 'robinhood.com',
  flipkart: 'flipkart.com',
  swiggy: 'swiggy.com',
  zomato: 'zomato.com',
  doordash: 'doordash.com',
  instacart: 'instacart.com'
};

/**
 * Resolve a company or service name or URL into a clean domain name
 * @param {string} input - e.g. "GitHub", "https://discord.com/app", "chatgpt", "supabase"
 * @returns {string} - e.g. "github.com", "discord.com", "supabase.com"
 */
export function resolveCompanyDomain(input) {
  if (!input || typeof input !== 'string') return 'generic.com';

  let raw = input.trim().toLowerCase();
  if (!raw) return 'generic.com';

  // 1. If it's a full URL, parse hostname
  if (raw.startsWith('http://') || raw.startsWith('https://')) {
    try {
      const url = new URL(raw);
      return url.hostname.replace(/^www\./, '');
    } catch (e) {
      // Fall through to regex
    }
  }

  // Remove protocol prefix and path
  raw = raw.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0].split('?')[0];

  // 2. Check if already has a valid TLD like .com, .org, .io, .so, .ai, .net, .co, .app, .us, .tv
  if (raw.includes('.') && !raw.endsWith('.')) {
    return raw;
  }

  // 3. Clean up non-alphanumeric chars (e.g. "OpenAI / ChatGPT" -> "openai")
  const words = raw.replace(/[^a-z0-9\s]/g, ' ').trim().split(/\s+/);
  const primaryWord = words[0] || 'generic';

  // 4. Direct dictionary lookup
  if (KNOWN_DOMAINS[primaryWord]) {
    return KNOWN_DOMAINS[primaryWord];
  }

  // Also check combined words (e.g. "primevideo", "epicgames")
  const combined = words.join('');
  if (KNOWN_DOMAINS[combined]) {
    return KNOWN_DOMAINS[combined];
  }

  // 5. Prefix/substring matching for common typing patterns
  for (const [key, domain] of Object.entries(KNOWN_DOMAINS)) {
    if (primaryWord.length >= 3 && (key.startsWith(primaryWord) || primaryWord.startsWith(key))) {
      return domain;
    }
  }

  // 6. Default fallback to .com
  return `${primaryWord}.com`;
}

/**
 * Get the Google Favicon CDN URL for a company or domain
 * @param {string} companyOrUrl - e.g. "Supabase" or "https://supabase.com"
 * @returns {string} High-resolution 128px logo URL
 */
export function getCompanyLogoUrl(companyOrUrl) {
  const domain = resolveCompanyDomain(companyOrUrl);
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128`;
}

/**
 * Secondary CDN fallback using DuckDuckGo
 */
export function getCompanyLogoUrlFallback(companyOrUrl) {
  const domain = resolveCompanyDomain(companyOrUrl);
  return `https://icons.duckduckgo.com/ip3/${encodeURIComponent(domain)}.ico`;
}

/**
 * Get brand initial fallback letter
 */
export function getCompanyInitial(name) {
  if (!name || typeof name !== 'string') return 'V';
  return name.trim().charAt(0).toUpperCase();
}
