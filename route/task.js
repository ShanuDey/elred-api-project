const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../model/user");

router.get("/", auth, async (req, res) => {
  try {
    // get the authenticated user email from the request
    const { email } = req.user;

    // fetch the user from the database
    const user = await User.findOne({ email });

    // respond with the available tasks
    res.status(200).send(user.tasks);
  } catch (error) {
    console.error(error);
  }
});

router.post("/create", auth, async (req, res) => {
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
    res.status(200).send(user.tasks);
  } catch (error) {
    console.error(error);
  }
});

router.patch("/:id", auth, async (req, res) => {
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

router.delete("/:id", auth, async (req, res) => {
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
    res.status(200).send(user.tasks);
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
