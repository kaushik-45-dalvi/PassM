/**
 * VaultSync / MyPass - Automatic Company Logo Resolver & Fetcher
 * Intelligently maps company / service names (e.g. "GitHub", "Netflix", "Discord", "ChatGPT")
 * or URLs to their official high-resolution logo via Google Favicons CDN.
 */

const KNOWN_DOMAINS = {
  // Developer & Tech
  github: 'github.com',
  gitlab: 'gitlab.com',
  bitbucket: 'bitbucket.org',
  docker: 'docker.com',
  vercel: 'vercel.com',
  supabase: 'supabase.com',
  firebase: 'firebase.google.com',
  aws: 'aws.amazon.com',
  digitalocean: 'digitalocean.com',
  cloudflare: 'cloudflare.com',
  heroku: 'heroku.com',
  stackoverflow: 'stackoverflow.com',
  npm: 'npmjs.com',
  huggingface: 'huggingface.co',

  // AI & Search
  chatgpt: 'chatgpt.com',
  openai: 'openai.com',
  claude: 'anthropic.com',
  anthropic: 'anthropic.com',
  midjourney: 'midjourney.com',
  google: 'google.com',
  gmail: 'mail.google.com',
  bing: 'bing.com',
  perplexity: 'perplexity.ai',

  // Social & Communication
  discord: 'discord.com',
  slack: 'slack.com',
  twitter: 'x.com',
  x: 'x.com',
  facebook: 'facebook.com',
  meta: 'meta.com',
  instagram: 'instagram.com',
  linkedin: 'linkedin.com',
  reddit: 'reddit.com',
  whatsapp: 'whatsapp.com',
  telegram: 'telegram.org',
  tiktok: 'tiktok.com',
  youtube: 'youtube.com',
  pinterest: 'pinterest.com',
  snapchat: 'snapchat.com',
  twitch: 'twitch.tv',
  zoom: 'zoom.us',

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
  apple: 'apple.com',

  // Entertainment & Streaming
  netflix: 'netflix.com',
  spotify: 'spotify.com',
  disney: 'disneyplus.com',
  hulu: 'hulu.com',
  primevideo: 'primevideo.com',
  soundcloud: 'soundcloud.com',
  hbomax: 'max.com',
  max: 'max.com',
  crunchyroll: 'crunchyroll.com',

  // Gaming
  steam: 'steampowered.com',
  epicgames: 'epicgames.com',
  epic: 'epicgames.com',
  roblox: 'roblox.com',
  playstation: 'playstation.com',
  xbox: 'xbox.com',
  nintendo: 'nintendo.com',
  riot: 'riotgames.com',

  // Shopping & Finance
  amazon: 'amazon.com',
  paypal: 'paypal.com',
  stripe: 'stripe.com',
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
  robinhood: 'robinhood.com'
};

/**
 * Resolve a company or service name or URL into a clean domain name
 * @param {string} input - e.g. "GitHub", "https://discord.com/app", "chatgpt"
 * @returns {string} - e.g. "github.com", "discord.com", "chatgpt.com"
 */
export function resolveCompanyDomain(input) {
  if (!input || typeof input !== 'string') return 'generic.com';

  let raw = input.trim().toLowerCase();

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

  // 4. Look up known domains
  if (KNOWN_DOMAINS[primaryWord]) {
    return KNOWN_DOMAINS[primaryWord];
  }

  // Also check combined words (e.g. "primevideo", "epicgames")
  const combined = words.join('');
  if (KNOWN_DOMAINS[combined]) {
    return KNOWN_DOMAINS[combined];
  }

  // 5. Default fallback to .com
  return `${primaryWord}.com`;
}

/**
 * Get the Google Favicon CDN URL for a company
 * @param {string} companyOrUrl - e.g. "GitHub" or "github.com"
 * @returns {string} High-resolution 128px logo URL
 */
export function getCompanyLogoUrl(companyOrUrl) {
  const domain = resolveCompanyDomain(companyOrUrl);
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128`;
}

/**
 * Get brand initial fallback letter
 */
export function getCompanyInitial(name) {
  if (!name || typeof name !== 'string') return 'V';
  return name.trim().charAt(0).toUpperCase();
}
