# List Your Business API

## Description

List Your Business is a platform where users can list their businesses and browse other businesses. Each listing can have reviews, and users can add their reviews. This project provides the backend API to manage user authentication, business listings, and reviews.

The API is built with **Express.js** and **MongoDB**. It includes user authentication with **Passport.js** and session management with **express-session**. The database is hosted on **MongoDB Atlas**, and the application is deployed on **Render**.

## Features

- User sign-up and login functionality with authentication via Passport.js.
- CRUD operations for managing business listings:
  - View all listings.
  - View a specific listing by its ID.
  - Create a new listing.
  - Update an existing listing.
  - Delete a listing.
- Users can add reviews to listings.
- The application uses **express-session** for managing user sessions and **connect-mongo** for storing sessions in MongoDB.

## Technologies Used

- **Express.js** for the backend framework.
- **MongoDB** and **Mongoose** for the database and data modeling.
- **Passport.js** for user authentication.
- **express-session** and **connect-mongo** for session management.
- **dotenv** for managing environment variables.
- **method-override** for supporting HTTP verbs like PUT and DELETE in forms.
- **flash** for flashing messages after certain actions (e.g., login failure).
- **CORS** to allow cross-origin requests.

## API Endpoints

### 1. **User Authentication**

- **POST /signup** - Create a new user account.
- **POST /login** - Log in a user.

### 2. **Business Listings**

- **GET /api/listings** - Get a list of all business listings.
- **GET /api/listings/:id** - Get details of a specific business listing by ID.
- **POST /api/listings** - Create a new business listing.
- **PUT /api/listings/:id** - Update an existing business listing by ID.
- **DELETE /api/listings/:id** - Delete a business listing by ID.

### 3. **Reviews**

- **POST /api/listings/:id/reviews** - Add a review to a specific business listing.

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/your-username/list-your-business.git
cd list-your-business
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create an `.env` file

Create a `.env` file in the root of the project and add the following environment variables:

```env
ATLASDB_URL=mongodb+srv://your-mongo-db-url
SECRET_KEY=your-secret-key
```

Replace `your-mongo-db-url` with your MongoDB connection string from MongoDB Atlas and `your-secret-key` with your desired secret key for session management.

### 4. Start the server

```bash
npm start
```

The server will be running on **http://localhost:8080**.

### 5. Production Deployment

The backend is deployed on Render and can be accessed at:

**[List Your Business API](https://listyourbusiness.onrender.com)**

## Example Usage

- **Get all listings**:

  ```
  GET /api/listings
  ```

- **Create a new listing**:

  ```
  POST /api/listings
  Body:
  {
    "title": "Your Business Name",
    "description": "Business description",
    "image": "image-url",
    "location": "Location",
    "country": "Country"
  }
  ```

- **Add a review to a listing**:

  ```
  POST /api/listings/:id/reviews
  Body:
  {
    "text": "This business is great!"
  }
  ```

## Notes

- Make sure to keep your `.env` file private and never push it to version control.
- MongoDB connection string and secret key should be stored securely in your `.env` file.

## License

This project is licensed under the MIT License.

---
