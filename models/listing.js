
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default:"https://unsplash.com/photos/a-woman-is-taking-a-picture-of-a-coral-reef-odwrd9IVBuk",
        set: v => (!v ? "https://unsplash.com/photos/a-woman-is-taking-a-picture-of-a-coral-reef-odwrd9IVBuk" : v)
    },
    price:Number,
    description: String,
    location: String,
    country: String
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;