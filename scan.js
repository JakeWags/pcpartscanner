#!/usr/bin/env nodejs
'use strict';

require('dotenv').config();
const snoowrap = require('snoowrap');

const express = require('express');
const { body,validationResult } = require('express-validator');
const path = require('path');
const https = require('https');
const fs = require('fs');
const { ChainCondition } = require('express-validator/src/context-items');

const app = express();
const port = 8080;

app.use(express.urlencoded({
    extended:true
}));

const r = new snoowrap({
    userAgent: 'Scans /r/buildapcsales for parts',
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN
});

const searchType = process.env.SEARCHTYPE;

async function scrapeSubreddit(type, amount) {
    // user provides itemType in command line
    let retText = [];
    console.log(`Scraping /r/buildapcsales most recent ${amount} posts for ${type}s...`);

    let posts = await r.getSubreddit("buildapcsales").getNew({limit:amount}).map((post) => {
        if (post.link_flair_text == type) {
            retText.push(post);
        }
    });


    return Promise.resolve(retText);
}

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'scan.html'));
});

app.post('/submit-scan', body("type").not().contains("Select a part type"), body("amount").isLength({max:3}), async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const select = req.body.type;
    const amount = parseInt(req.body.amount);

    let displayString = `<html><head><meta charset="UTF-8"><title>Scan Results</title><link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous"><style>body { padding-top: 50px; }</style></head><body class="mb-4"><div class="container"><div class="jumbotron"><h1>Results</h1><p>Please note: all of these results are pulled from <a class="link-primary" target="_blank" href="https://www.reddit.com/r/buildapcsales">www.reddit.com/r/buildapcsales</a> and so are not in any way published by me. Please view at your own discetion.</p></div></div><div class="container"><ol class="list-group">`;
    let resultCount = 0;    

    let r = await scrapeSubreddit(select, amount).then((p) => {
        p.forEach(post => {
		displayString += `<li class="list-group-item align-middle">${post.title}<a class="btn btn-outline-primary float-right" target="_blank" href="${post.url}">LINK</a></li>`;
		resultCount++;
	})
    	
    });
    if (resultCount == 0) {
    	displayString += `<li class="list-group-item align-middle">No results found...</li>`;
    }
    displayString += "</ol></div></body></html>";
        
    res.end(displayString);
});


// app.listen(port);
https.createServer({
    key: fs.readFileSync(process.env.KEY),
    cert: fs.readFileSync(process.env.CERT),
    ca: fs.readFileSync(process.env.CA),
}, app).listen(443, () => {
    console.log("listening on port 443...");
});
