
const express = require('express');
const mongoose = require('mongoose');
const config = require('./config/config'); // Ensure this file contains mongoURI & port
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const matchRoutes = require("./routes/matchRoutes");
const errorHandler = require('./middleware/errorHandler'); // Uncomment if available

const app = express();
const PORT = config.port || 5000; // Ensure `PORT` is defined

app.use(express.json());

// Debugging logs
console.log("Server is starting...");
console.log("Configured PORT:", PORT);
console.log("MongoDB URI:", config.mongoURI ? "Available" : "Not Found");

// Route Handlers
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/matches', matchRoutes);

// Global Error Handling Middleware (if available)
app.use(errorHandler);

// MongoDB Connection
mongoose.connect(config.mongoURI, { })
  .then(() => {
    console.log(" Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(` Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB Connection Error:", error.message);
    process.exit(1); // Exit if DB connection fails
  });

