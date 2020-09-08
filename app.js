const express=require("express");
const puppeteer = require("puppeteer");
const mongoose=require("mongoose");
const fs=require("fs");
const bodyParser=require("body-parser");

const path = require("path");
const app=express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
//Intializing Database
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test', {useNewUrlParser: true});"store",storeSchema);
/*
async function printPDF() {
    var pathtoFile="temp.pdf";
    if(fs.existsSync(pathtoFile))
    {   fs.unlink(pathtoFile,function(err){
            if(err)
            {
                throw err;
            }else{
                console.log("Successfully deleted the file");
            }
        })
   }
   const browser = await puppeteer.launch({ headless: true });
   const page = await browser.newPage();
   await page.setViewport({ width: 10, height: 10, deviceScaleFactor: 1});
   await page.goto('http://localhost:3000/', {waitUntil: 'networkidle0'});
  //const pdf = await page.pdf({ format: 'A4', landscape: true,printBackground: true });
   await page.pdf({path: "temp.pdf", format: 'A4', landscape: true, printBackground: true});
  //console.log(pdf);
   await browser.close();
  //return pdf;
}*/
app.get("/",function(req,res){
        res.sendFile(__dirname+"/index.html");
})
app.post("/pdf",function(req,res){
    printPDF();
    //res.set({ 'Content-Type': 'application/pdf', 'Content-Length': pdf.length});
    setTimeout(function(){res.sendFile(__dirname+"/temp.pdf");},5000);
    //console.log(pdf)
    //res.send(pdf);
})
//Invoices
app.get("/invoice",function(req,res){

})
//GETTING THE ENTERED DATA FROM THE USER//
app.post("/data",function(req,res){
    console.log(req.body)
    var Total=(req.body.quantity)*(req.body.price);
    const data=new store({
        name: req.body.name,
        product: req.body.product,
        quantity: req.body.quantity,
        price: req.body.price,
        total: Total
    })
    res.send(data);
    res.redirect("/");
})

app.listen(3000,function(req,res){
    console.log("Devesh");
})