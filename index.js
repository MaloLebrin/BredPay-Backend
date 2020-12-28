const express = require("express");
const mongoose = require("mongoose");
const formidableMiddleware = require("express-formidable");
const cors = require("cors");
const helmet = require("helmet");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

const app = express();
app.use(helmet());
app.use(cors());
app.use(formidableMiddleware({
    multiples: true,
}));

mongoose.connect("mongodb://localhost:27017/boulangerie-api", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
});
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "malolebrin",
    api_key: process.env.CLOUDINARY_API_KEY || "212971842325324",
    api_secret: process.env.CLOUDINARY_API_SECRET || "79KqyVOwveSqV7PGkTcez9btus4",
});

const userRoutes = require("./routes/user");
const companyRoutes = require("./routes/company");
const loginRoutes = require("./routes/login")
const productRoutes = require("./routes/product");
const orderRoutes = require("./routes/order");
app.use(userRoutes);
app.use(companyRoutes);
app.use(loginRoutes);
app.use(productRoutes);
app.use(orderRoutes)


app.all("*", (req, res) => {
    res.status(404).json({ error: "Page not found app.all" });
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server has started");
});
