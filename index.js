const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const routeModel = require("./models/route.model");
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

    const existingRoute = await routeModel.findOne({route});

    if (!existingRoute) {
      return res.status(404).send({ error: "Route not found " });
    }

    return res.status(200).send({ message: "Route Found" });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Internal server error." });
  }
});
