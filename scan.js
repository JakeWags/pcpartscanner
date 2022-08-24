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

    const searchType = process.env.SEARCHTYPE;


    // user provides itemType in command line
    let itemType = process.argv[2];
    let postLimit = parseInt(process.argv[3]);
    let posts = r.getSubreddit("buildapcsales").getNew({limit:postLimit}).map((post) => {
        if (post.link_flair_text == itemType) {
            console.log(post.title);
        }
    });
}

scrapeSubreddit();
