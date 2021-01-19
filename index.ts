import express = require("express");
import mongoose = require("mongoose");
import formidableMiddleware = require("express-formidable");
import cors = require("cors");
import helmet = require("helmet");
import cloudinary = require("cloudinary");
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
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// import userRoutes from "./routes/user";
// import companyRoutes from "./routes/company";
// import loginRoutes from "./routes/login";
// import productRoutes from "./routes/product";
// import orderRoutes from "./routes/order";
// app.use(userRoutes);
// app.use(companyRoutes);
// app.use(loginRoutes);
// app.use(productRoutes);
// app.use(orderRoutes)


app.all("*", (req, res) => {
    res.status(404).json({ error: "Page not found app.all" });
});

app.listen(process.env.PORT, () => {
    console.log(`Server has started on ${process.env.PORT}`);
});
