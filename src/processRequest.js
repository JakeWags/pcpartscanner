'use strict';
const { getFormattedOutput } = require("./getFormattedOutput");


async function processRequest(req) {
    const select = req.body.type;
    const amount = parseInt(req.body.amount);

    let formattedData = await getFormattedOutput(select, amount);

    return formattedData;
}

exports.processRequest = processRequest;
