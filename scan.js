#!/usr/bin/env nodejs
'use strict';

require('dotenv').config();
const snoowrap = require('snoowrap');
// const http = require('http');
// const fs = require('fs');
const express = require('express');
const { body,validationResult } = require('express-validator');
const path = require('path');

const app = express();
const port = 8080;

app.use(express.urlencoded({
    extended:true
}));

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

// http.createServer(async function (request, response) {
//     // response.writeHead(200, {'Content-Type': 'text/plain'});
//     // let disString = "";
    
//     // let r = await scrapeSubreddit().then((p) => {
//     //     p.forEach(post => {disString += post.title + " : " + post.url + "\n";})
//     // });

//     // response.end(disString);
      
//     response.writeHead(200, {
//         'Content-Type': 'type/plain'
//     });
//     fs.readFile('./scan.html', null, function (error, data) {
//         if (error) {
//             response.writeHead(404);
//             response.write("Error: File not found.");
//         }
//         else {
//             response.write(data);
//         }
//         response.end();
//     })
//  }).listen(8080);


app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'scan.html'));
});

app.post('/submit-scan', body("type").not().contains("Select a part type"), body("amount").isLength({max:3}), (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const select = req.body.type;
    const amount = req.body.amount;
    console.log(select);
    console.log(amount);
    

    // do snoowrap api calls here and populate /submit-scan with editted html?

    res.end(select + " " + amount);
})


app.listen(port);

console.log("running server on 8080");
