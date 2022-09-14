require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const bycrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./model/user");
const taskRouter = require("./route/task");
const randomstring = require("randomstring");
const { sendVerificationEmail } = require("./config/mailer");

const app = express();
app.use(express.json());
app.use("/task", taskRouter);

app.get("/", (req, res) => {
  res.status(200).send(
    `Welcome to elRed API !!
    <a href='https://github.com/ShanuDey/elred-api-project#readme' target='_blank'>API Docs</a>`
  );
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

    // generate email verification token
    const email_verification_token = randomstring.generate({ length: 32 });

    // create a user with the registration details in the database
    const user = await User.create({
      first_name,
      last_name,
      email: email.toLowerCase(),
      password: encryptedPassword,
      email_verification_token,
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

    // send verification email
    const emailVerificationLink = `${process.env.HOST_NAME}:${process.env.PORT}/verify/${user._id}/${email_verification_token}`;
    const email_preview_link = await sendVerificationEmail(
      email,
      emailVerificationLink
    );
    user.email_preview_link = email_preview_link;

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
      // check if email verification is completed
      if (!user.verified)
        return res.status(401).send("Email verification required !!");

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

app.get("/verify/:userid/:token", async (req, res) => {
  const { userid, token } = req.params;

  const user = await User.findOne({ _id: userid });
  if (user.email_verification_token === token) {
    await User.findOneAndUpdate({ _id: userid }, { $set: { verified: true } });

    // respond verification successful
    res.status(200).send("Email Verification successful !!");
  } else {
    res.status(400).send("Failed to verify email !! Invalid token");
  }
});

module.exports = app;
