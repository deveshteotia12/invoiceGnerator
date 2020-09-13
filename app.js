//Requiring all Important Modules
const express = require("express");
const puppeteer = require("puppeteer");
const mongoose = require("mongoose");
const fs = require("fs");
const bodyParser=require("body-parser");

const path = require("path");
const { RSA_NO_PADDING } = require("constants");
const app=express();
app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine','ejs');

app.use(express.static('public'));

//Intializing Database
mongoose.connect("mongodb://localhost:27017/myStore", {useNewUrlParser: true, useUnifiedTopology:true});
//Schema
const storeSchema=new mongoose.Schema({
    name: String,
    product: [{productName: String, quantity: Number,price: Number}],
    total: Number,
    invoiceNumber: Number
});
const store = mongoose.model("store",storeSchema);


//Using puppeteer to print pdf
async function printPDF(Number) {
    var pathtoFile="temp.pdf";

   const browser = await puppeteer.launch({ headless: true });
   const page = await browser.newPage();
   await page.setViewport({ width: 10, height: 10, deviceScaleFactor: 1});
   await page.goto('http://localhost:3000/index/'+Number, {waitUntil: 'networkidle1'});
   //const pdf = await page.pdf({ format: 'A4', landscape: true,printBackground: true });
   await page.pdf({path: "temp.pdf", format: 'A4', landscape: true, printBackground: true});
   //console.log(pdf);
   await browser.close();
   //return pdf;
}

//get request from invoice page to print pdf
app.get("/pdf/:Number",function(req,res){
    var pathtoFile="temp.pdf";
    if(fs.existsSync(pathtoFile))
    {   fs.unlink(pathtoFile,function(err){
            if(err)
            {
                console.log(err);
            }else{
                console.log("Successfully deleted the file");
            }
        })
   }
    printPDF(req.params.Number);
    //res.set({ 'Content-Type': 'application/pdf', 'Content-Length': pdf.length});
    setTimeout(function(){res.sendFile(__dirname+"/temp.pdf");},7000);
    //console.log(pdf)
    //res.send(pdf);
})

//Get Request For invoice page (Renders all the invoice unique Number from the database)
app.get("/invoice",function(req,res){
    var Number=[];
    store.find({},function(err,doc){
        if(err)
        {
            console.log(err);
        }
        else{
            var i;
             for(i=0;i<doc.length;i++)
             {
                 Number.push(doc[i].invoiceNumber);
             }
             console.log(Number);
             res.render("invoice",{Number, my: "Devesh"});
        }
    })
});

//Get request to view the invoice Rendering all the data to the ejs temlate for invoice
app.get("/index/:Number",function(req,res){
    store.findOne({invoiceNumber: req.params.Number},function(err,doc){
        if(doc)
        {
            console.log("Hii");
            res.render('index',{name: doc.name,product: doc.product, price: doc.price,quantity: doc.quantity,total : doc.total});
        }
    })
   //res.render('index',{name: "Devesh",product: "Milk", price: "10",quantity: "3",total : "30"});
})

/*

//Post request to store all the form data to Database(Previously Used)

app.post("/data",function(req,res){
    console.log(req.body)
    var Total=(req.body.quantity)*(req.body.price);
    const data=new store({
        name: req.body.name,
        product: req.body.product,
        quantity: req.body.quantity,
        price: req.body.price,
        total: Total,
        invoiceNumber: req.body.Invoice
    })
   data.save();
    res.redirect("/invoice");
})
*/

//Updated Version of getting the data and 

//intializing list for temporary Storage(can be saved to database for multiple users)
var productArray=[];

//Get Request to the Home Page
app.get("/",function(req,res){
    res.render("main",{productArray});
        //res.sendFile(__dirname+"/index.html");
})
//Post request bringing the Customer Data from the forms

app.post("/gulaothi",function(req,res){
    var sum=0;
    for(var i=0;i<productArray.length;i++)
    {
        sum=sum+(productArray[i].price*productArray[i].quantity);
    }
    const details=new store({
        name: req.body.name,
        product: productArray,
        total: sum,
        invoiceNumber: req.body.Invoice
    })
    details.save();
    productArray=[];
    res.redirect("/temporary");
})

//Post Request Bringing the Product Data from the Store

app.post("/productData",function(req,res){
    var details={
        productName: req.body.product,
        quantity: req.body.quantity,
        price: req.body.price,
        
    }
    productArray.push(details);
    res.redirect("/temporary");
})

//Using puppeteer to print pdf
async function printPDF(Number) {
    var pathtoFile="temp.pdf";
    
   const browser = await puppeteer.launch({ headless: true });
   const page = await browser.newPage();
   await page.setViewport({ width: 10, height: 10, deviceScaleFactor: 1});
   await page.goto('http://localhost:3000/index/'+Number, {waitUntil: 'networkidle0'});
  //const pdf = await page.pdf({ format: 'A4', landscape: true,printBackground: true });
   await page.pdf({path: "temp.pdf", format: 'A4', landscape: true, printBackground: true});
  //console.log(pdf);
   await browser.close();
  //return pdf;
}




//Listening to the Port
app.listen(3000,function(){
    console.log("Devesh");
    
})