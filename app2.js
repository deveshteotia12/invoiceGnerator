const express = require("express");
const puppeteer = require("puppeteer");
const mongoose = require("mongoose");
const fs = require("fs");
const bodyParser=require("body-parser");
const fileUpload = require('express-fileupload');
const path = require("path");
const app=express();
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine','ejs');
app.use(express.static('public'));


app.use(fileUpload());
  
//Intializing Database
mongoose.connect("mongodb://localhost:27017/myStore", {useNewUrlParser: true, useUnifiedTopology:true});
//Schema for Main DataBase
const storeSchema=new mongoose.Schema({
    name: String,
    product: [{productName: String, quantity: Number,price: Number}],
    total: Number,
    invoiceNumber: String
});
//Creating Model for Main Database
const store = mongoose.model("store",storeSchema);



//Rendering Main Page
var productArray=[];
var sum=0;
app.get("/",function(req,res){
    sum=0;
    for(var i=0;i<productArray.length;i++)
    {
         sum=sum+((productArray[i].quantity)*(productArray[i].price));
    }
    res.render("main",{productArray,total: sum});
        //res.sendFile(__dirname+"/index.html");
})

//Post request bringing the Customer Data from the forms
app.post("/gulaothi",function(req,res){
    /*var sum=0;
    for(var i=0;i<productArray.length;i++)
    {
        sum=sum+(productArray[i].price*productArray[i].quantity);
    }*/
    const details=new store({
        name: req.body.name,
        product: productArray,
        total: sum,
        invoiceNumber: req.body.Invoice
    })
    details.save();
    productArray=[];
    res.redirect("/");
})

//Post Request Bringing the Product Data from the Store
app.post("/productData",function(req,res){
    var details={
        productName: req.body.product,
        quantity: req.body.quantity,
        price: req.body.price, 
    }
    productArray.push(details);
    res.redirect("/");
})

//Get request to view the invoice Rendering all the data to the ejs temlate for invoice
app.get("/index/:Number",function(req,res){
    var Name;
    var Address1;
    var Address2;
    Details.find({},function(err,doc){
        if(err)
        {
            console.log(err);
        }
        else{
            
             Address1=doc[0].Address[0];
             Address2=doc[0].Address[1];
             Name=doc[0].brandName;
              console.log(Name);
             console.log(Address2);
            console.log(Address1);
        }
    })
   

    store.findOne({invoiceNumber: req.params.Number},function(err,doc){
        if(doc)
        {
            console.log("Hii");
            res.render('index',{Name: Name,Address1: Address1,Address2: Address2,name: doc.name,invoiceNumber: doc.invoiceNumber,product: doc.product,total : doc.total});
        }
    })
   //res.render('index',{name: "Devesh",product: "Milk", price: "10",quantity: "3",total : "30"});
})

//Get Request For invoice page (Renders all the invoice unique Number from the database)

app.get("/invoice",function(req,res){
var number=[];
     if(fs.existsSync(__dirname+"/temp.pdf"))
      {   fs.unlink(__dirname+"/temp.pdf",function(err){
            if(err)
            {
                console.log(err);
            }else{
                console.log("Deleted the file"); 
            }
        })
      }
    
    store.find({},function(err,doc){
        if(err)
        {
            console.log(err);
        }
        else{
            var i;
             for(i=0;i<doc.length;i++)
             {
                 number.push(doc[i].invoiceNumber);
             }
             //console.log(Number);
             res.render("invoice",{number, my: "Devesh"});
        }
    })
});
//Filtering the data with invoice NUmber and Name
/*app.post("/invoiceSearch",function(req,res){
    console.log(req.body);
   var number=[];
    var Type= req.body.invoiceSearch;
  if(req.body.option==='name')
  {
      store.find({name: Type},function(err,doc){
        if(err)
        {
            console.log(err);
        }
        else{
            var i;
             for(i=0;i<doc.length;i++)
             {
                 number.push(doc[i].invoiceNumber);
             }
             //console.log(Number);
             res.render("invoice",{number, my: "Devesh"});
        }
    })
}else{
    store.find({invoiceNumber: Type},function(err,doc){
        if(err)
        {
            console.log(err);
        }
        else{
            var i;
             for(i=0;i<doc.length;i++)
             {
                 number.push(doc[i].invoiceNumber);
             }
             //console.log(Number);
             res.render("invoice",{number, my: "Devesh"});
        }
    })
  }

})*/
//Get Request to Analysis Page Rendering data from data Base

app.get("/analysis",function(req,res){
    var sum2=0;
    store.find({},function(err,doc){
        if(err)
        {
            console.log(err);
        }
        else{
            var i;
            for(i=0;i<doc.length;i++)
            {
                sum2=sum2+(doc[i].total);
                console.log(sum2);
            }
            res.render("analysis",{total: sum2,paid : sum2, unpaid: 0});
        }
    })  
})
//Rendering Admin Page
app.get("/admin",function(req,res){
    if(fs.existsSync(__dirname+"/public/logo.jpg"))
     { 
         res.render("admin",{message: "You have Succesfully Uploaded the Logo to Update Upload Again"});
     }
    else{
        res.render("admin",{message: "Please Upload Your Logo"});
    }
})
//Taking Logo As Input, and saving it at directory
app.post("/admin",function(req,res){
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
      }
      // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
      let sampleFile = req.files.Image;
     if( fs.existsSync(__dirname+"/publiic/logo.png"));
     {
        fs.unlink(__dirname+"/publiic/logo.png",function(err){
            if(err)
            {
                console.log(err);
            }else{
                console.log("Successfully deleted the file"); 
            }
        })
     }
      // Use the mv() method to place the file somewhere on your server
      sampleFile.mv(__dirname+'/public/logo.jpg', function(err) {
        if (err)
          return res.status(500).send(err);
    
        res.redirect('/admin');
      });
})
//Taking Brand Name And Address as Input From User and saving in database
const storeDetail=mongoose.Schema({
    brandName: String,
    Address:[String]
})
var Details=mongoose.model("Details",storeDetail);
app.post("/shopDetails",function(req,res){
      console.log(req.body);
      var List=[req.body.address1,req.body.address2]
      var Data=new Details({
           brandName: req.body.shopName,
           Address: List
      });
      Data.save(function(err){
          if(err)
          {
              console.log(err);
          }else{
              console.log("Saved");
          }
      });
})
//Function to create pdf Using puppeteer
async function printPDF(Number) {
    var pathtoFile="temp.pdf";
   const browser = await puppeteer.launch({ headless: true });
   const page = await browser.newPage();
   await page.setViewport({ width: 10, height: 10, deviceScaleFactor: 1});
   await page.goto('http://localhost:1000/index/'+Number, {waitUntil: 'networkidle0'});
   //await page.goto('https://localhost:')
  //const pdf = await page.pdf({ format: 'A4', landscape: true,printBackground: true });
   await page.pdf({path: "temp.pdf", format: 'A4', landscape: true, printBackground: true});
   //console.log(pdf);
   await browser.close();
  //return pdf;
}

//get request from invoice page to print pdf
 
app.get("/pdf/:Number",function(req,res){
    var pathtoFile="temp.pdf";
    console.log("DEVESH TEOTIA");
    if(fs.existsSync(pathtoFile))
    {   fs.unlink(pathtoFile,function(err){
            if(err)
            {
                console.log(err);
            }else{
                console.log("Successfully deleted the file"); 
                console.log(req.params.Number);
                printPDF(req.params.Number);
                setTimeout(function(){res.sendFile(__dirname+"/temp.pdf");},7000);
            }
        })
   }
   else{
       console.log(req.params.Number);
       printPDF(req.params.Number);
       setTimeout(function(){res.sendFile(__dirname+"/temp.pdf");},7000);
   }
   
    //res.set({ 'Content-Type': 'application/pdf', 'Content-Length': pdf.length});
    
    //console.log(pdf)
    //res.send(pdf);
})
/*
var pass="Ravindra@1"
var Email="devesh.teotia12@gmail.com"
const USERNAME_SELECTOR = '#username';
const PASSWORD_SELECTOR = '#password';
const CTA_SELECTOR = '#login-submit';
//Function to Print Pdf
*/

app.listen(1000,function(){
    console.log("running");
})