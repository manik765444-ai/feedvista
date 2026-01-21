const express = require('express');
const parser = require('rss-parser');
const app = express();
const port = 3000;

// Initialize the RSS parser
const rssParser = new parser();

// Define the RSS feed URLs
const rssFeeds = [
  'https://www.example.com/rss',
  'https://www.example2.com/rss',
];

// Function to fetch and parse RSS feeds
async function fetchAndParseRssFeeds() {
  try {
    const feedData = await Promise.all(rssFeeds.map((feedUrl) => {
      return rssParser.parseURL(feedUrl);
    }));
    return feedData;
  } catch (error) {
    console.error('Error fetching or parsing RSS feeds:', error);
    throw error;
  }
}

// Define the route for fetching RSS feeds
app.get('/rss', async (req, res) => {
  try {
    const feedData = await fetchAndParseRssFeeds();
    res.json(feedData);
  } catch (error) {
    console.error('Error fetching or parsing RSS feeds:', error);
    res.status(500).json({ error: 'Failed to fetch or parse RSS feeds' });
  }
});

// Define the route for fetching a specific RSS feed
app.get('/rss/:feedIndex', async (req, res) => {
  try {
    const feedIndex = parseInt(req.params.feedIndex, 10);
    if (feedIndex < 0 || feedIndex >= rssFeeds.length) {
      res.status(404).json({ error: 'Invalid feed index' });
      return;
    }
    const feedData = await rssParser.parseURL(rssFeeds[feedIndex]);
    res.json(feedData);
  } catch (error) {
    console.error('Error fetching or parsing RSS feed:', error);
    res.status(500).json({ error: 'Failed to fetch or parse RSS feed' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error occurred:', err);
  res.status(500).json({ error: 'Internal server error' });
});