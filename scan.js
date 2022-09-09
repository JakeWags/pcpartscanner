#!/usr/bin/env nodejs
'use strict';

require('dotenv').config();
const snoowrap = require('snoowrap');

const express = require('express');
const { body,validationResult } = require('express-validator');
const path = require('path');
const https = require('https');
const fs = require('fs');

const app = express();

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

async function getFormattedOutput(select, amount) {
    let displayString, footer;

    fs.readFile(__dirname + "/html/results.html", (error, data) => {
        if (error) { throw error; }
        displayString = data.toString();
    });

    fs.readFile(__dirname + "/html/footer.html", (error, data) => {
        if (error) { throw error; }
        footer = data.toString();
    });

 
    let resultCount = 0;

    await scrapeSubreddit(select, amount).then((p) => {
        p.forEach(post => {
		    displayString += 
                `<li class="list-group-item align-middle">
                    <a class="link" target="_blank" href="https://www.reddit.com${post.permalink}">${post.title}</a>
                    <a class="btn btn-outline-primary float-right" target="_blank" href="${post.url}">LINK</a>
                </li>`;

		    resultCount++;
	    });
    });

    if (resultCount == 0) {
    	displayString += `<li class="list-group-item align-middle">No results found...</li>`;
    }

    displayString += "</ol></div>"

    displayString += footer;

    displayString += "</body></html>";

    return displayString;
}

async function processRequest(req) {
    const select = req.body.type;
    const amount = parseInt(req.body.amount);

    let formattedData = await getFormattedOutput(select, amount);

    return formattedData;
}

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'html/scan.html'));
});

app.post('/submit-scan', body("type").not().contains("Select a part type"), body("amount").isLength({max:3}), async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    let processedRequest = await processRequest(req);

    res.end(processedRequest);
});


// app.listen(port);
https.createServer({
    key: fs.readFileSync(process.env.KEY),
    cert: fs.readFileSync(process.env.CERT),
    ca: fs.readFileSync(process.env.CA),
}, app).listen(443, () => {
    console.log("listening on port 443...");
});
