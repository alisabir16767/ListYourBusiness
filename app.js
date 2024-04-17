const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path = require("path");
const methodOverride= require("method-override");
const ejsMate=require("ejs-mate");
const dotenv=require("dotenv");
const bodyParser=require("body-parser");



const MONGO_URL = "mongodb://127.0.0.1:27017/ListYourBusiness";


main().then(() => {
    console.log("Connected to DB");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); 
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


app.get("/", (req, res) => {
    res.send("hello, i am root.");
});
app.get("/listings", async (req, res) => {
    try {
        const allListings = await Listing.find({});
        res.render('listings/index', { allListings });

    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

// show route 
app.get("/listings/new", (req, res) => {
    res.render("listings/new", { listing: {} });
});

app.get("/listings/features",(req,res)=>{
    res.render("listings/feature");
})
app.get("/listings/aboutUs",(req,res)=>{
    res.render("listings/aboutUs");
})
app.get("/terms",(req,res)=>{
    res.render("listings/terms");
})
app.get("/privacy",(req,res)=>{
    res.render("listings/privacy");
})
app.get("/login",(req,res)=>{
    res.render("listing/login");
})

// Create route for new listing
app.post("/listings", async (req, res) => {
    try {
        const { title, description, image, location, country } = req.body;
        if (!title || !description || !image || !location || !country) {
            return res.status(400).send("All fields are required");
        }

        // Create a new Listing object
 
        const newListing = new Listing({
            title,
            description,
            image,
            location,
            country
        });
        await newListing.save();
        res.redirect("/listings");
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});


// Edit route
app.get("/listings/:id/edit", async (req, res) => {
    try {
        const { id } = req.params;
        const listing = await Listing.findById(id);
        if (!listing) {
            return res.status(404).send("Listing not found");
        }
        res.render("listings/edit", { listing });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

// Update Route

app.put("/listings/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, image, location, country } = req.body;
        const updatedListing = await Listing.findByIdAndUpdate(id, {
            title,
            description,
            image,
            location,
            country
        }, { new: true }); 
        if (!updatedListing) {
            return res.status(404).send("Listing not found");
        }
        res.redirect(`/listings/${id}`);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

//Delete route

app.delete("/listings/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deletedListing = await Listing.findByIdAndDelete(id);
        if (!deletedListing) {
            return res.status(404).send("Listing not found");
        }
        console.log(deletedListing); 
        res.redirect("/listings");
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});
// Add review route
app.post("/listings/:id/reviews", async (req, res) => {
    try {
        const { id } = req.params;
        const { text } = req.body;
        
        // Find the listing by ID
        const listing = await Listing.findById(id);
        if (!listing) {
            return res.status(404).send("Listing not found");
        }

        // Add the review to the listing's reviews array
        listing.reviews.push({ text });
        await listing.save();

        res.redirect(`/listings/${id}`);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});



// Get a specific listing by ID
app.get("/listings/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const listing = await Listing.findById(id);
        if (!listing) {
            return res.status(404).send("Listing not found");
        }
        res.render("listings/show", { listing });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

app.listen(8080, () => {
    console.log("Listening on port 8080");
});
