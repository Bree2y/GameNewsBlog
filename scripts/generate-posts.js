const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');

// Initialize OpenAI
// Note: In a real environment, ensure LLM_API_KEY is set.
const openai = new OpenAI({
    apiKey: process.env.LLM_API_KEY || 'mock-key',
    dangerouslyAllowBrowser: true // Not needed for node but good practice to know
});

const DATA_DIR = path.join(__dirname, '../data');
const RAW_NEWS_FILE = path.join(DATA_DIR, 'raw-news.json');
const PROCESSED_FILE = path.join(DATA_DIR, 'processed-urls.json');
const POSTS_DIR = path.join(__dirname, '../content/posts');

if (!fs.existsSync(POSTS_DIR)) {
    fs.mkdirSync(POSTS_DIR, { recursive: true });
}

async function generatePosts() {
    if (!fs.existsSync(RAW_NEWS_FILE)) {
        console.log('No raw news to process.');
        return;
    }

    const rawNews = JSON.parse(fs.readFileSync(RAW_NEWS_FILE, 'utf8'));
    let processedUrls = [];
    if (fs.existsSync(PROCESSED_FILE)) {
        try {
            processedUrls = JSON.parse(fs.readFileSync(PROCESSED_FILE, 'utf8'));
        } catch (e) {
            processedUrls = [];
        }
    }

    // Process top 10 that haven't been processed
    let count = 0;
    for (const item of rawNews) {
        if (count >= 10) break;
        if (processedUrls.includes(item.link)) continue;

        console.log(`Processing: ${item.title}`);

        let content = '';

        if (process.env.LLM_API_KEY) {
            try {
                const completion = await openai.chat.completions.create({
                    messages: [{ role: "system", content: "You are a professional gaming journalist. Rewrite the following news snippet into an engaging, exciting blog post. Add a catchy title. Use Markdown formatting." },
                    { role: "user", content: `Title: ${item.title}\nSource: ${item.source}\nSnippet: ${item.contentSnippet || item.content}\n\nWrite a blog post about this.` }],
                    model: "gpt-4o",
                });
                content = completion.choices[0].message.content;
            } catch (e) {
                console.error("LLM Error (using fallback):", e.message);
                // Fallback
                content = `## ${item.title}\n\n*Source: ${item.source}*\n\n${item.contentSnippet}\n\n[Read more](${item.link})`;
            }
        } else {
            // Mock content for when no API key is present
            content = `## ${item.title}\n\n*Source: ${item.source}*\n\n> **Note:** This is a placeholder because no \`LLM_API_KEY\` was found in the environment. In production, this would be rewritten by AI.\n\n${item.contentSnippet || item.content}\n\n[Read original article](${item.link})`;
        }

        // Create frontmatter
        // Sanitize slug
        const slug = item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '').substring(0, 100);
        const date = new Date().toISOString();

        // Try to find an image
        let imageUrl = 'https://placehold.co/600x400/1a1a1a/00ff9d?text=Game+News';
        if (item.enclosure && item.enclosure.url) {
            imageUrl = item.enclosure.url;
        } else if (item.content && item.content.match(/src=["'](https?:\/\/[^"']+\.(jpg|png|jpeg|webp))/i)) {
            imageUrl = item.content.match(/src=["'](https?:\/\/[^"']+\.(jpg|png|jpeg|webp))/i)[1];
        }

        const fileContent = `---
title: "${item.title.replace(/"/g, '\\"')}"
date: "${date}"
image: "${imageUrl}"
excerpt: "${(item.contentSnippet || '').slice(0, 150).replace(/"/g, '\\"').replace(/\n/g, ' ')}..."
source: "${item.source}"
originalLink: "${item.link}"
---

${content}
`;

        fs.writeFileSync(path.join(POSTS_DIR, `${slug}.md`), fileContent);
        processedUrls.push(item.link);
        count++;
    }

    fs.writeFileSync(PROCESSED_FILE, JSON.stringify(processedUrls, null, 2));
    console.log(`Generated ${count} posts.`);
}

generatePosts();
