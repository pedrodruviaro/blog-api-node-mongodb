const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const postRoute = require("./routes/posts");
const categoriesRoute = require("./routes/categories");

const app = express();
dotenv.config();
app.use(express.json());

// connection to mongodb
mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(console.log(`Connected to mongo`))
    .catch((err) => console.log(err));

app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/categories", categoriesRoute);

app.listen(3000, () => console.log("Server running!"));
