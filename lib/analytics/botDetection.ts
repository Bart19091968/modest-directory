type BotResult = { isBot: false } | { isBot: true; botName: string }

const BOT_PATTERNS: { pattern: RegExp; name: string }[] = [
  // Search engines
  { pattern: /Googlebot/i,           name: 'Googlebot' },
  { pattern: /Bingbot/i,             name: 'Bingbot' },
  { pattern: /Slurp/i,               name: 'Yahoo Slurp' },
  { pattern: /DuckDuckBot/i,         name: 'DuckDuckBot' },
  { pattern: /Baiduspider/i,         name: 'Baiduspider' },
  { pattern: /YandexBot/i,           name: 'YandexBot' },
  { pattern: /Sogou/i,               name: 'Sogoubot' },
  { pattern: /Exabot/i,              name: 'Exabot' },
  { pattern: /facebookexternalhit/i, name: 'Facebook' },
  { pattern: /Twitterbot/i,          name: 'Twitterbot' },
  { pattern: /LinkedInBot/i,         name: 'LinkedInBot' },
  { pattern: /Pinterest/i,           name: 'Pinterest' },
  // SEO tools
  { pattern: /AhrefsBot/i,           name: 'AhrefsBot' },
  { pattern: /SemrushBot/i,          name: 'SemrushBot' },
  { pattern: /MJ12bot/i,             name: 'MJ12bot' },
  { pattern: /DotBot/i,              name: 'DotBot' },
  { pattern: /MajesticSEO/i,         name: 'MajesticSEO' },
  { pattern: /ScreamingFrog/i,       name: 'Screaming Frog' },
  { pattern: /rogerbot/i,            name: 'Rogerbot' },
  { pattern: /Screaming Frog/i,      name: 'Screaming Frog' },
  // Archivers
  { pattern: /ia_archiver/i,         name: 'Wayback Machine' },
  { pattern: /archive\.org_bot/i,    name: 'Archive.org' },
  // AI crawlers
  { pattern: /GPTBot/i,              name: 'GPTBot' },
  { pattern: /ChatGPT-User/i,        name: 'ChatGPT' },
  { pattern: /CCBot/i,               name: 'CCBot' },
  { pattern: /anthropic-ai/i,        name: 'Anthropic' },
  { pattern: /Claude-Web/i,          name: 'Claude' },
  { pattern: /PerplexityBot/i,       name: 'PerplexityBot' },
  // Generic signals
  { pattern: /\bbot\b/i,             name: 'Bot' },
  { pattern: /\bcrawler\b/i,         name: 'Crawler' },
  { pattern: /\bspider\b/i,          name: 'Spider' },
  { pattern: /\bscraper\b/i,         name: 'Scraper' },
  { pattern: /python-requests/i,     name: 'Python' },
  { pattern: /\bScrapy\b/i,          name: 'Scrapy' },
  { pattern: /\bcurl\b/i,            name: 'curl' },
  { pattern: /\bwget\b/i,            name: 'wget' },
  { pattern: /libwww-perl/i,         name: 'libwww' },
  { pattern: /Go-http-client/i,      name: 'Go HTTP' },
]

export function detectBot(userAgent: string): BotResult {
  if (!userAgent) return { isBot: true, botName: 'Unknown' }

  for (const { pattern, name } of BOT_PATTERNS) {
    if (pattern.test(userAgent)) {
      return { isBot: true, botName: name }
    }
  }

  return { isBot: false }
}
