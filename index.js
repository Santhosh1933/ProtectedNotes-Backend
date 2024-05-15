const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const routeModel = require("./models/route.model");
const notesModel = require("./models/notes.model");
require("dotenv").config();
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);
mongoose.connect(process.env.MONGODB_URI);
app.listen(8000, () => console.log(`listening on http://localhost:8000`));

app.post("/create-route", async (req, res) => {
  try {
    const { route, editPassword, viewPassword } = req.body;

    const existingRoute = await routeModel.findOne({ route });
    console.log(existingRoute);
    if (existingRoute) {
      return res.status(400).send({ error: "Route already exists." });
    }
    const data = await routeModel.create({
      route,
      editPassword,
      viewPassword,
    });
    await data.save();

    return res.status(200).send(data);
  } catch (error) {
    return res.status(500).send({ error: "Internal server error." });
  }
});

app.get("/edit-notes", async (req, res) => {
  try {
    const { route, editPassword } = req.query;

    const existingRoute = await routeModel.findOne({ route, editPassword });

    if (!existingRoute) {
      return res
        .status(404)
        .send({ error: "Route not found or authentication failed." });
    }

    return res.status(200).send({ message: "Authentication Successful" });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Internal server error." });
  }
});

app.get("/route", async (req, res) => {
  try {
    const { route } = req.query;

    const existingRoute = await routeModel.findOne({ route });

    if (!existingRoute) {
      return res.status(404).send({ error: "Route not found " });
    }

    return res.status(200).send({ message: "Route Found" });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Internal server error." });
  }
});

app.post("/notes", async (req, res) => {
  try {
    const { route, editPassword, notes } = req.body;

    // Check if the route exists
    const existingRoute = await routeModel.findOne({ route, editPassword });
    if (!existingRoute) {
      return res.status(400).json({ error: "No Access" });
    }

    // Check if the note exists for the route
    let existingNote = await notesModel.findOne({ route });
    if (!existingNote) {
      // If note doesn't exist, create a new note document
      existingNote = new notesModel({
        route,
        notes,
      });
    } else {
      // If note exists, update the notes
      existingNote.notes = notes;
    }

    // Save the note to the database
    await existingNote.save();

    return res.status(201).json(existingNote);
  } catch (error) {
    console.error("Error creating or updating note:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
});

app.get("/notes", async (req, res) => {
  try {
    const { route, viewPassword, editPassword } = req.query;

    // Check if the route exists
    const existingRoute = await routeModel.findOne({ route });
    if (!existingRoute) {
      return res.status(404).json({ error: "Route not found." });
    }

    // Check if either viewPassword or editPassword matches
    if (
      existingRoute.viewPassword !== viewPassword &&
      existingRoute.editPassword !== editPassword
    ) {
      return res.status(401).json({ error: "Unauthorized." });
    }

    // Fetch notes if access is granted
    const notes = await notesModel.findOne({ route });
    if (!notes) {
      return res.status(402).json({ error: "Notes not found." });
    }

    return res.status(200).json(notes);
  } catch (error) {
    console.error("Error fetching notes:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
});
