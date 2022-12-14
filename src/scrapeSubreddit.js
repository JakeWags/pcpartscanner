'use strict';
require('dotenv').config();
const snoowrap = require('snoowrap');

const r = new snoowrap({
    userAgent: 'Scans /r/buildapcsales for parts',
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN
});

async function scrapeSubreddit(type, amount) {
    // user provides itemType in command line
    let retText = [];
    console.log(`Scraping /r/buildapcsales most recent ${amount} posts for ${type}s...`);

    let posts = await r.getSubreddit("buildapcsales").getNew({ limit: amount }).map((post) => {
        if (post.link_flair_text == type) {
            retText.push(post);
        }
    });


    return Promise.resolve(retText);
}

exports.scrapeSubreddit = scrapeSubreddit;