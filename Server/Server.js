const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection — replace with your Atlas URI
const MONGO_URI = "mongodb+srv://Nile:09682690675Ze@cluster0.lwten1g.mongodb.net/feedbackDB?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));

// Schema
const feedbackSchema = new mongoose.Schema({
    studentName: String,
    course: String,
    rating: Number,
    comments: String,
});

const Feedback = mongoose.model("Feedback", feedbackSchema);

// POST /feedback
app.post("/feedback", async (req, res) => {
    const { studentName, course, rating, comments } = req.body;

    if (!studentName || !course || !rating || !comments) {
        return res.status(400).json({ message: "All fields are required." });
    }

    if (rating < 1 || rating > 5) {
        return res.status(400).json({ message: "Rating must be between 1 and 5." });
    }

    try {
        const feedback = new Feedback({ studentName, course, rating, comments });
        await feedback.save();
        res.status(201).json({ message: "Feedback submitted successfully!" });
    } catch (err) {
        res.status(500).json({ message: "Server error. Please try again." });
    }
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));