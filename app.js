require("dotenv").config();
const express = require("express");

const app = express();
app.use(express.json());

app.get("/", (req,res)=> {
    res.status(200).send("Welcome to elRed API");
})

module.exports = app;
