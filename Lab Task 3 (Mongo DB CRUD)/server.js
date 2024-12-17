//requiring packages
const express = require('express');
const path = require('path');
const multer  = require('multer')

const crypto  = require('crypto')

const app = express();


// Serving static files from "public" directory
app.use(express.static(path.join(__dirname, 'public')));

const expressLayouts = require("express-ejs-layouts");
app.use(expressLayouts);


app.use(express.json());
app.use(express.urlencoded({extended: true}));

 

app.set('view engine','ejs');


app.get("/", (req,res) => {
  return res.render("home");
});
//multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads')
  },
  filename: function (req, file, cb) {
    crypto.randomBytes(12,function(err,bytes){
      console.log(bytes.toString("hex"));
      const fn =bytes.toString("hex") + path.extname(file.originalname);
      cb(null, fn)

    })
  }
})

const upload = multer({ storage: storage })

//routes

const categoryRoute = require("./routes/admin/categories.routes");
app.use("/admin/categories",categoryRoute);

const productsRoute = require("./routes/admin/products.routes");
app.use("/admin/products",productsRoute);

const userInterfaceRoute = require("./routes/admin/homepage.routes");
app.use("/user/home",userInterfaceRoute);


//mongodb connection
const dbc= require("./db");

const Port = 1000;

const start =async() =>{
    await dbc();
    app.listen(Port, () =>{
        console.log(`Server started at localhoat${Port}`);
    });
}

start();














   