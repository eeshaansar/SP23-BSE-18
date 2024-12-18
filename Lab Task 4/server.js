const express = require('express');
const path = require('path');
const multer  = require('multer')
const crypto  = require('crypto')
const flash = require("connect-flash");
const cookieParser = require('cookie-parser');
const session = require("express-session");
const MongoStore = require("connect-mongo");



const app = express();
app.use(cookieParser());


// Serving static files from "public" directory
app.use(express.static(path.join(__dirname, 'public')));

const expressLayouts = require("express-ejs-layouts");
app.use(expressLayouts);


app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.set('view engine','ejs');


app.get("/", (req, res) => {
  res.redirect("user/home/main"); 
});


// Session middleware
app.use(
    session({
        name: "session",
        secret: "SecretKey", 
        resave: false, 
        saveUninitialized: false, 
        store: MongoStore.create({
            mongoUrl: "mongodb://localhost:27017/Hushpuppy", 
        }),
        cookie: {
            maxAge: 1000 * 60 * 60, 
            httpOnly: true, 
            secure: false, 
        },
    })
);

app.use(flash());

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

const authRoutes = require("./routes/admin/route.authorization");
app.use("/user", authRoutes); 

const searchRoute = require("./routes/admin/search.routes");
app.use("/search", searchRoute); 

const cart = require("./routes/admin/addtocart.routes");
app.use("/addtocart", cart); 

//mongodb connection
const dbc= require("./db");

const Port = 1000;

const start =async() =>{
    await dbc();
    app.listen(Port, () =>{
        console.log(`Server started at localhost${Port}`);
    });
}

start();














   