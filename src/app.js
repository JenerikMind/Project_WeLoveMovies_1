if (process.env.USER) require("dotenv").config();
const express = require("express");

const app = express();
app.use(express.json());

const moviesRouter = require("./movies/movies.router");
const reviewsRouter = require("./reviews/reviews.router");
const theatersRouter = require("./theaters/theaters.router");

app.use("/movies", moviesRouter);
app.use("/reviews", reviewsRouter);
app.use("/theaters", theatersRouter);


// error-catcher
app.use((err, req, res, next) => {
    const { status = 500, message = "Something went wrong..." } = err;
    res.status(status).json({error: message});
});

module.exports = app;
