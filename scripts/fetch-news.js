const Parser = require('rss-parser');
const fs = require('fs');
const path = require('path');

const parser = new Parser();

const FEEDS = [
    'https://feeds.ign.com/ign/news',
    'https://www.gamespot.com/feeds/news/',
    'https://www.polygon.com/rss/index.xml',
    'https://www.eurogamer.net/?format=rss&type=news'
];

const DATA_DIR = path.join(__dirname, '../data');
const RAW_NEWS_FILE = path.join(DATA_DIR, 'raw-news.json');
const PROCESSED_FILE = path.join(DATA_DIR, 'processed-urls.json');

async function fetchNews() {
    // Ensure data dir exists
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    let processedUrls = [];
    if (fs.existsSync(PROCESSED_FILE)) {
        try {
            processedUrls = JSON.parse(fs.readFileSync(PROCESSED_FILE, 'utf8'));
        } catch (e) {
            processedUrls = [];
        }
    }

    let allItems = [];

    for (const feedUrl of FEEDS) {
        try {
            console.log(`Fetching ${feedUrl}...`);
            const feed = await parser.parseURL(feedUrl);
            console.log(`Found ${feed.items.length} items in ${feed.title}`);

            feed.items.forEach(item => {
                // Basic filtering
                if (!item.link || !item.title) return;

                // Check if already processed
                if (processedUrls.includes(item.link)) return;

                // Add source info
                item.source = feed.title;
                allItems.push(item);
            });
        } catch (error) {
            console.error(`Error fetching ${feedUrl}:`, error.message);
        }
    }

    // Sort by date (newest first)
    allItems.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

    // Take top 20 candidates
    const candidates = allItems.slice(0, 20);

    console.log(`Total new candidates: ${candidates.length}`);

    fs.writeFileSync(RAW_NEWS_FILE, JSON.stringify(candidates, null, 2));
    console.log(`Saved candidates to ${RAW_NEWS_FILE}`);
}

fetchNews();
