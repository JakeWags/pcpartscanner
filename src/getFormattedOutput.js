'use strict';
const fs = require('fs');
const { scrapeSubreddit } = require("./scrapeSubreddit");

async function getFormattedOutput(select, amount) {
    let displayString, footer;

    fs.readFile(__dirname + "/html/snippets/results.html", (error, data) => {
        if (error) { throw error; }
        displayString = data.toString();
    });

    fs.readFile(__dirname + "/html/snippets/footer.html", (error, data) => {
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

    displayString += "</ol></div>" + footer + "</body></html>";

    return displayString;
}

exports.getFormattedOutput = getFormattedOutput;
