require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const bycrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./model/user");
const auth = require("./middleware/auth");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("Welcome to elRed API");
});

app.post("/register", async (req, res) => {
  try {
    // receive the registration data from the request body
    const { first_name, last_name, email, password } = req.body;

    // check if the inputs are present
    if (!(first_name && last_name && email && password)) {
      res.status(400).send("All fields are not present");
    }

    // check if the user is already present in our database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .send(
          "This email is already registered. Please login with this email."
        );
    }

    // Encrypt password to store in DB
    const encryptedPassword = await bycrypt.hash(password, 10);

    // create a user with the registration details in the database
    const user = await User.create({
      first_name,
      last_name,
      email: email.toLowerCase(),
      password: encryptedPassword,
    });

    // create jwt token for this user
    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: "30s",
      }
    );

    // add this token to the user
    user.token = token;

    // respond with the complete user details
    res.status(200).send(user);
  } catch (error) {
    console.error(error);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // check the inputs are present
    if (!(email && password)) {
      res.status(400).send("All fields are not present");
    }

    // find the user with the email from database
    const user = await User.findOne({ email });

    // check if user present with this email and password
    if (user && (await bycrypt.compare(password, user.password))) {
      // create jwt token for this user
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "30s",
        }
      );

      // add this token to the user
      user.token = token;

      // respond with the complete user details
      res.status(200).send(user);
    } else {
      // if user not found with these credentials
      res.status(400).send("Failed to login with these credentials");
    }
  } catch (error) {
    console.error(error);
  }
});

app.get("/task", auth, (req, res) => {
  res.status(200).send("Task");
});

app.post("/createtask", auth, async (req, res) => {
  try {
    // get the task string from the request
    const { task } = req.body;
    const { email } = req.user;

    // check if the task is present
    if (!task) {
      res.status(400).send("Task string is not present in the request");
    }

    // add new task to the task array
    const user = await User.findOneAndUpdate(
      { email },
      { $push: { tasks: { task } } },
      { new: true } // it will help to return the user data after update
    );

    // respond with the user with the all tasks
    res.status(200).send(user);
  } catch (error) {
    console.error(error);
  }
});

app.patch("/task/:id", auth, async (req, res) => {
  try {
    // get the inputs from the request
    const task_id = req.params.id;
    const { email } = req.user;
    const { date, task, completed } = req.body;

    // create the update query dynamically depending on the inputs present
    let updatedTaskQuery = {};
    if (date) updatedTaskQuery["tasks.$[task].date"] = date;
    if (task) updatedTaskQuery["tasks.$[task].task"] = task;
    if (completed) updatedTaskQuery["tasks.$[task].completed"] = completed;

    // check if the task_id is present
    if (!task_id) {
      res.status(400).send("Task id is not present in the request");
    }

    // update the task with the available inputs
    const user = await User.findOneAndUpdate(
      { email },
      { $set: updatedTaskQuery },
      {
        arrayFilters: [{ "task._id": task_id }],
        new: true,
      }
    );

    // respond with the user with the all tasks
    res.status(200).send(user.tasks);
  } catch (error) {
    console.error(error);
  }
});

app.delete("/task/:id", auth, async (req, res) => {
  try {
    // get the inputs from the request
    const task_id = req.params.id;
    const { email } = req.user;

    // delete the task from the tasks array in database
    const user = await User.findOneAndUpdate(
      { email },
      { $pull: { tasks: { _id: task_id } } },
      { new: true }
    );

    // respond with the updated task list
    res.status(200).send(user.tasks)
  } catch (error) {
    console.error(error);
  }
});

module.exports = app;
