const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    text: String,
    // You can add more fields like user, rating, etc. as needed
});

const listingSchema = new mongoose.Schema({
    title: String,
    description: String,
    image: String,
    location: String,
    country: String,
    reviews: [reviewSchema] // Array of reviews
});

const Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;
