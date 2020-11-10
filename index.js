const express = require("express");
const mongoose = require("mongoose");
const formidableMiddleware = require("express-formidable");
const cors = require("cors");
const helmet = require("helmet");
const cloudinary = require("cloudinary").v2;
require("dotenv").config;

const app = express();
app.use(helmet());
app.use(cors());
app.use(formidableMiddleware());

mongoose.connect("mongodb://localhost:27017/boulangerie-api", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
});
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const userRoutes = require("./routes/user");
const companyRoutes = require("./routes/company");
const loginRoutes = require("./routes/login")
app.use(userRoutes);
app.use(companyRoutes);
app.use(loginRoutes);


app.all("*", (req, res) => {
    res.status(404).json({ error: "Page not found app.all" });
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server has started");
});
