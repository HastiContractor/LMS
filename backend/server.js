require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const DB_URI = process.env.MONGO_URI;

// Connect to MongoDB
mongoose
  .connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

//creating 'uploads' folder
const fs = require("fs");
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// Import and use routes
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);
const courseRoutes = require("./routes/courseRoutes");
app.use("/api/courses", courseRoutes);
const lessonRoutes = require("./routes/lessonRoutes");
app.use("/api/lessons", lessonRoutes);
const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);
const progressRoutes = require("./routes/progressRoutes");
app.use("/api/progress", progressRoutes);
const uploadRoutes = require("./routes/uploadRoutes");
app.use("/api/uploads", uploadRoutes);
const notificationRoutes = require("./routes/notificationRoutes");
app.use("/api/notifications", notificationRoutes);
const adminRoutes = require("./routes/adminRoutes");
app.use("/api/admin", adminRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
