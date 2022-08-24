'use strict';

require('dotenv').config();
const snoowrap = require('snoowrap');

function scrapeSubreddit() {
    const r = new snoowrap({
        userAgent: 'Scans /r/buildapcsales for part',
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN
    });

    r.getHot().map(post => post.title).then(console.log);
}

scrapeSubreddit();
