#!/usr/bin/env nodejs
'use strict';

require('dotenv').config();
const snoowrap = require('snoowrap');
const http = require('http');
const { resolve } = require('path');

const r = new snoowrap({
    userAgent: 'Scans /r/buildapcsales for part',
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN
});

const searchType = process.env.SEARCHTYPE;

async function scrapeSubreddit() {
    // user provides itemType in command line
    let itemType = process.argv[2];
    let postLimit = parseInt(process.argv[3]);
    let retText = [];

    let posts = await r.getSubreddit("buildapcsales").getNew({limit:postLimit}).map((post) => {
        if (post.link_flair_text == itemType) {
            retText.push(post);
        }
    });

    return Promise.resolve(retText);
}

http.createServer(async function (request, response) {
    response.writeHead(200, {'Content-Type': 'text/plain'});
    let disString = "";
    
    let r = await scrapeSubreddit().then((p) => {
        p.forEach(post => {disString += post.title + " : " + post.url + "\n";})
    });

    response.end(disString);
      
 }).listen(8080);

console.log("running server on 8080");
