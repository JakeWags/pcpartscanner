'use strict';

const snoowrap = require('snoowrap');

function scrapeSubreddit() {
    const r = new snoowrap({
        userAgent: 'Scans /r/buildapcsales for part',
        clientId: 'o-vxeEEDPWqWHsqTiLRbvg',
        clientSecret: 'yNO7vFlTtjUlIMYf4UgTEOMsn8151A',
        refreshToken: '24732262995-5YtQopdqHM643xfzTSZOogLe6graWw'
    });

    r.getHot().map(post => post.title).then(console.log);
}

scrapeSubreddit();