import Parser from 'rss-parser'
import axios from 'axios'
import * as cheerio from 'cheerio'

const parser = new Parser({
  customFields: {
    item: ['description', 'content', 'content:encoded', 'pubDate', 'dc:creator']
  }
})

interface RSSFeed {
  url: string
  name: string
  country?: string
  category?: string
}

const rssFeeds: RSSFeed[] = [
  {
    url: 'https://rss.nytimes.com/services/xml/rss/nyt/World.xml',
    name: 'NYTimes World',
    country: 'US',
    category: 'world'
  },
  {
    url: 'https://feeds.bbci.co.uk/news/world/rss.xml',
    name: 'BBC World',
    country: 'UK',
    category: 'world'
  },
  {
    url: 'https://www.aljazeera.com/xml/rss/all.xml',
    name: 'Al Jazeera',
    country: 'QA',
    category: 'world'
  },
  {
    url: 'https://feeds.reuters.com/reuters/worldNews',
    name: 'Reuters World',
    country: 'US',
    category: 'world'
  },
  {
    url: 'https://rss.nytimes.com/services/xml/rss/nyt/MiddleEast.xml',
    name: 'NYTimes Middle East',
    country: 'US',
    category: 'conflict'
  },
  {
    url: 'https://feeds.bbci.co.uk/news/world/asia/rss.xml',
    name: 'BBC Asia',
    country: 'UK',
    category: 'asia'
  },
  {
    url: 'https://rss.nytimes.com/services/xml/rss/nyt/Europe.xml',
    name: 'NYTimes Europe',
    country: 'US',
    category: 'europe'
  },
  {
    url: 'https://www.theguardian.com/world/rss',
    name: 'Guardian World',
    country: 'UK',
    category: 'world'
  },
  {
    url: 'https://rss.nytimes.com/services/xml/rss/nyt/Politics.xml',
    name: 'NYTimes Politics',
    country: 'US',
    category: 'politics'
  },
  {
    url: 'https://feeds.reuters.com/Reuters/world',
    name: 'Reuters World News',
    country: 'US',
    category: 'world'
  }
]

export interface NewsItem {
  id: string
  source: string
  author: string
  title: string
  description: string
  url: string
  image_url: string
  published_at: string
  country: string
  category: string
  sentiment: number
}

export async function fetchRSSNews(): Promise<NewsItem[]> {
  const newsItems: NewsItem[] = []
  
  for (const feed of rssFeeds) {
    try {
      const response = await axios.get(feed.url, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      })
      
      const feedData = await parser.parseString(response.data)
      
      if (feedData.items) {
        for (const item of feedData.items.slice(0, 10)) {
          try {
            const newsItem: NewsItem = {
              id: item.guid || item.link || `RSS_${Date.now()}_${Math.random()}`,
              source: feed.name,
              author: item.creator || item.author || '',
              title: item.title || '',
              description: cleanDescription(item.contentSnippet || item.description || ''),
              url: item.link || '',
              image_url: extractImage(item.content || item.contentSnippet || '') || '',
              published_at: item.pubDate || new Date().toISOString(),
              country: feed.country || '',
              category: feed.category || 'general',
              sentiment: 0
            }
            
            if (newsItem.title && newsItem.url) {
              newsItems.push(newsItem)
            }
          } catch (err) {
            console.error(`Error processing ${feed.name} item:`, err)
          }
        }
      }
      
      console.log(`Fetched ${feedData.items?.length || 0} items from ${feed.name}`)
    } catch (error: any) {
      console.error(`Failed to fetch ${feed.name}:`, error.message)
    }
  }
  
  return newsItems
}

function cleanDescription(text: string): string {
  return text
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, 500)
}

function extractImage(content: string): string | null {
  const imgRegex = /<img[^>]+src="([^"]+)"/
  const match = content.match(imgRegex)
  return match ? match[1] : null
}

export async function scrapeNewsWebsite(url: string, selector: string): Promise<NewsItem[]> {
  try {
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    })
    
    const $ = cheerio.load(response.data)
    const newsItems: NewsItem[] = []
    
    $(selector).each((_, element) => {
      try {
        const title = $(element).find('h3, h2, .title').first().text().trim()
        const link = $(element).find('a').first().attr('href')
        const description = $(element).find('p, .summary').first().text().trim()
        const pubDate = $(element).find('time').first().attr('datetime') || new Date().toISOString()
        const image = $(element).find('img').first().attr('src')
        
        if (title && link) {
          newsItems.push({
            id: `SCRAPED_${Date.now()}_${Math.random()}`,
            source: 'Web Scraped',
            author: '',
            title,
            description: description.substring(0, 500),
            url: link.startsWith('http') ? link : `https://example.com${link}`,
            image_url: image || '',
            published_at: pubDate,
            country: '',
            category: 'general',
            sentiment: 0
          })
        }
      } catch (err) {
        console.error('Error scraping item:', err)
      }
    })
    
    return newsItems
  } catch (error: any) {
    console.error(`Failed to scrape ${url}:`, error.message)
    return []
  }
}
