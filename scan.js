#!/usr/bin/env nodejs
'use strict';

require('dotenv').config();
const snoowrap = require('snoowrap');
const http = require('http');

const r = new snoowrap({
    userAgent: 'Scans /r/buildapcsales for part',
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN
});

const searchType = process.env.SEARCHTYPE;

function scrapeSubreddit() {
    // user provides itemType in command line
    let itemType = process.argv[2];
    let postLimit = parseInt(process.argv[3]);
    let retText = [];

    let posts = r.getSubreddit("buildapcsales").getNew({limit:postLimit}).map((post) => {
        if (post.link_flair_text == itemType) {
            retText.push(post.title);
            console.log(post.title);
        }
    });

    return retText;
}

http.createServer(function (request, response) {
    response.writeHead(200, {'Content-Type': 'text/plain'});
    let disString = "";
    
    let r = scrapeSubreddit();
    console.log(r);
    response.end("TEST");
}).listen(8080);

console.log("running server on 8080");
