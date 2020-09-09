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
const storeSchema=new mongoose.Schema({
    name: String,
    product: String,
    quantity: Number,
    price: Number,
    total: Number,
    invoiceNumber: Number
});
const store = mongoose.model("store",storeSchema);

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
app.get("/",function(req,res){
        res.sendFile(__dirname+"/index.html");
})
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
//Invoices
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

app.listen(3000,function(){
    console.log("Devesh");
})