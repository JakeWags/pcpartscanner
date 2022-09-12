#!/usr/bin/env nodejs
'use strict';

require('dotenv').config();

const express = require('express');
const { body,validationResult } = require('express-validator');
const path = require('path');

const https = require('https');
const fs = require('fs');

const { processRequest } = require("./src/processRequest");

const app = express();

app.use(express.urlencoded({
    extended:true
}));

const searchType = process.env.SEARCHTYPE;

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'html/scan.html'));
});

app.post('/submit-scan', 
    body("type").not().contains("Select a part type"), 
    body("amount").isLength({max:3}), 
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        let processedRequest = await processRequest(req);

        res.end(processedRequest);
    });

https.createServer({
    key: fs.readFileSync(process.env.KEY),
    cert: fs.readFileSync(process.env.CERT),
    ca: fs.readFileSync(process.env.CA),
}, app).listen(443, () => {
    console.log("listening on port 443...");
});
