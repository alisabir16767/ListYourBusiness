const mongoose = require("mongoose");
const User = require("./models/user");
const Listing = require("./models/listing");
require("dotenv").config();

async function seedDatabase() {
  try {
    // Connect to the database
    await mongoose.connect(process.env.ATLASDB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    // Sample users
    const users = [
      {
        username: "john_doe",
        email: "john.doe@example.com",
        password: "securePassword123",
      },
      {
        username: "jane_doe",
        email: "jane.doe@example.com",
        password: "anotherSecurePassword456",
      },
      {
        username: "test_user",
        email: "test.user@example.com",
        password: "testPassword789",
      },
    ];

    // Clear users and register new users with hashed passwords
    await User.deleteMany({});
    for (let userData of users) {
      const { username, email, password } = userData;
      const user = new User({ username, email });
      await User.register(user, password);
      console.log(`User ${username} registered`);
    }
    console.log("All users added successfully");

    // Sample listings
    const listings = [
      {
        title: "Modern Apartment",
        description: "A beautiful apartment in the city center.",
        image: "https://via.placeholder.com/150",
        location: "New York",
        country: "USA",
        reviews: [{ text: "Great place!" }, { text: "Very comfortable." }],
      },
      {
        title: "Beach House",
        description: "A cozy house near the beach.",
        image: "https://via.placeholder.com/150",
        location: "Miami",
        country: "USA",
        reviews: [{ text: "Loved the ocean view." }],
      },
      {
        title: "Mountain Cabin",
        description: "A rustic cabin in the mountains.",
        image: "https://via.placeholder.com/150",
        location: "Aspen",
        country: "USA",
        reviews: [],
      },
    ];

    // Clear listings and add new ones
    await Listing.deleteMany({});
    await Listing.insertMany(listings);
    console.log("All listings added successfully");

    // Exit process after seeding
    process.exit();
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
