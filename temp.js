const express = require("express");
const puppeteer = require("puppeteer");
const path = require('path');

module.exports = async function pdf(url, req) {
    const filename = `public/temp/Performance Reports.pdf`;
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto('https://node-and-mysql-mbegg.c9users.io/clients/'+req.params.id+'/reports/monthlyreport/'+req.params.marketplace+'/'+req.params.month, {waitUntil: 'networkidle2'});
    await page.pdf({path: filename, format: 'A4', landscape: true, printBackground: true});

    await browser.close();
    return filename;
}

///Print PDF route
router.get("/clients/:id/reports/monthlyreport/:marketplace/:month/pdf", async function(req, res) {
    var url = "/clients/"+req.params.id+"/reports/monthlyreport/"+req.params.marketplace+"/"+req.params.month

    const filename = await pdf(url, req);
    res.contentType("application/pdf");
    res.sendFile(path.join(__dirname, filename)); // if 'public/temp/...' path is not relative to cur dir, make relevant change here.
});