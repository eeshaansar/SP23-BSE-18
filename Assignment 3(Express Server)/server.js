const express = require("express");
let app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.get("/", (req,res) => {
    res.render("landingpage");
});

app.get("/portfolio", (req,res) =>{
    res.render("portfolio")
    
});

app.listen(3000, () => {
    console.log("server Started at localhost:5020");
})