const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const Listing = require("./models/listing");
const User = require("./models/user");

dotenv.config();

const MONGO_URL = process.env.ATLASDB_URL;

console.log("MongoDB URI:", MONGO_URL);

async function connectToDatabase() {
  try {
    await mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to DB");
  } catch (err) {
    console.error("Database connection error:", err.message);
  }
}

connectToDatabase();

const sessionOptions = {
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: MONGO_URL,
    collectionName: "sessions",
    ttl: 14 * 24 * 60 * 60,
  }),
  cookie: {
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
  },
};

// Middleware setup
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(cookieParser());
app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Passport configuration
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Routes
app.get("/", (req, res) => {
  console.dir(req.cookies); // Debugging cookies
  res.json({ message: "Welcome to List Your Business API" });
});

app.get("/signup", (req, res) => {
  res.json({ message: "Signup page" });
});

app.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email });
    const registeredUser = await User.register(user, password);
    res.json(registeredUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/login", (req, res) => {
  res.json({ message: "Login page" });
});

app.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (req, res) => {
    res.json({ message: "Logged in" });
  }
);

// CRUD routes for listings
app.get("/api/listings", async (req, res) => {
  try {
    const allListings = await Listing.find({});
    res.json(allListings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/listings/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }
    res.json(listing);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/listings", async (req, res) => {
  try {
    const { title, description, image, location, country } = req.body;
    if (!title || !description || !image || !location || !country) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const newListing = new Listing({
      title,
      description,
      image,
      location,
      country,
    });
    await newListing.save();
    res.status(201).json(newListing);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/api/listings/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, image, location, country } = req.body;
    const updatedListing = await Listing.findByIdAndUpdate(
      id,
      { title, description, image, location, country },
      { new: true }
    );
    if (!updatedListing) {
      return res.status(404).json({ error: "Listing not found" });
    }
    res.json(updatedListing);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/api/listings/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    if (!deletedListing) {
      return res.status(404).json({ error: "Listing not found" });
    }
    res.json({ message: "Listing deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/listings/:id/reviews", async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    const listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }
    listing.reviews.push({ text });
    await listing.save();
    res.json(listing);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start the server
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Backend API running on port ${PORT}`);
});
