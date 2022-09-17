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
    const { date, task, status } = req.body;
    const { email } = req.user;

    // find the user from the database
    const user = await User.findOne({ email });
    // push the new task object to the tasks array
    await user.tasks.push({date, task, status});
    // save the changed to the user document
    const updatedUser = await user.save();

    // respond with the user with the all tasks
    res.status(200).send(updatedUser.tasks);
  } catch (error) {
    console.error(error);
    if (error.name === "ValidationError") {
      res.status(400).send("Invalid Request !! " + error.message.split(":").pop());
    }
  }
});

router.patch("/:id", auth, async (req, res) => {
  try {
    // get the inputs from the request
    const task_id = req.params.id;
    const { email } = req.user;
    const { date, task, status } = req.body;

    // check if the task_id is present
    if (!task_id) {
      res.status(400).send("Task id is not present in the request");
    }

    // find the user from the database
    const user = await User.findOne({ email });
    // update the requested fields
    if (date)  user.tasks.id(task_id).date = new Date(date);
    if (task)  user.tasks.id(task_id).task = task;
    if (status)  user.tasks.id(task_id).status = status;
    // save the changed to the user document
    const updatedUser = await user.save();

    // respond with the user with the all tasks
    res.status(200).send(updatedUser.tasks);
  } catch (error) {
    console.error(error);
    if (error.name === "ValidationError") {
      res.status(400).send("Invalid Request !! " + error.message.split(":").pop());
    }
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
