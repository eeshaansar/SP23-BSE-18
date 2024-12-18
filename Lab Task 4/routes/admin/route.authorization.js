const express = require("express");
const router = express.Router();
const User = require("../../models/signup.model");
const bcrypt = require("bcrypt");

//middlewares
const isAuthenticated = require("../../middleware/authMiddleware");
const verifyRole = require("../../middleware/roleMiddleware");

// render signup form
router.get("/signup", (req, res) => {
  const role = req.query.role || "user"; 
  res.render("Authorization/signup", { role }); 
});
// signup
router.post("/signup", async (req, res) => {
  const { username, email, password, confirmpassword, role, adminCode } =
    req.body;

  try {
    if (password !== confirmpassword) {
      return res.status(400).send("Passwords do not match.");
    }

    if (role === "admin" && adminCode !== "12345") {
      return res.status(403).send("Invalid Admin Code.");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send("Email already in use.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: role || "user", 
    });

    await newUser.save();
    res.redirect("/user/login"); 
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).send("Server error. Please try again later.");
  }
});


// render login form
router.get("/login", (req, res) => {
  res.render("Authorization/login");
});

// login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send("User not found.");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send("Invalid credentials.");
    }

    req.flash("success_msg", "Successfully logged in!");

    req.session.userId = user._id;
    req.session.username = user.username;
    req.session.role = user.role;

    if (user.role === "admin") {
      return res.redirect("/user/admin");
    }
    res.redirect("/user/home/main");
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send("Server error. Please try again later.");
  }
});

// homepage
router.get("/main", isAuthenticated, (req, res) => {
  res.render("website/homepage", { username: req.session.username });
});

// admin panel
router.get("/admin", [isAuthenticated, verifyRole("admin")], (req, res) => {
  res.render("home", { success_msg: req.flash("success_msg") });
});

// ogout
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error during logout:", err);
      return res.status(500).send("Error logging out.");
    }
    res.clearCookie("session"); // Clear the session cookie
    res.redirect("/user/login"); // Redirect to the login page after logout
  });
});

module.exports = router;
