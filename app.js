require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const cors = require("cors");
const bycrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./model/user");
const Token = require("./model/token");
const auth = require("./middleware/auth");
const taskRouter = require("./route/task");
const randomstring = require("randomstring");
const { sendVerificationEmail } = require("./config/mailer");

const app = express();
// get whitelisted domains string from .env file
const whitelistDomainsFromEnv = process.env.WHITELIST_DOMAINS || "";
// make a array of url from the string splitting by ","
const whitelist = whitelistDomainsFromEnv
  .split(",")
  .map((domain) => domain.trim());
// create cors options
const corsOptions = {
  origin: (origin, callback) => {
    // check if request origin is present in whitelist
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Request is not allowed by CORS"));
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));
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
      res.status(400).json({ error: "All fields are not present" });
      return;
    }

    // check if the user is already present in our database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({
        error:
          "This email is already registered. Please login with this email.",
      });
      return;
    }

    // Encrypt password to store in DB
    const encryptedPassword = await bycrypt.hash(password, 10);

    // generate email verification token
    const email_verification_token = randomstring.generate({ length: 32 });

    // create a user with the registration details in the database
    const user = await User.create({
      first_name,
      last_name,
      email,
      password: encryptedPassword,
      email_verification_token,
    });

    // send verification email
    const { HOST_NAME, PORT, HEROKU } = process.env;
    const base_url = HEROKU ? HOST_NAME : HOST_NAME + ":" + PORT;
    const emailVerificationLink = `${base_url}/verify/${user._id}/${email_verification_token}`;
    const email_preview_link = await sendVerificationEmail(
      email,
      emailVerificationLink
    );

    // respond with the complete user details
    res.status(200).json({ user, email_preview_link });
  } catch (error) {
    console.error(error);
    res.status(500).json("Something went wrong !!");
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // check the inputs are present
    if (!(email && password)) {
      res.status(400).json({ error: "All fields are not present" });
      return;
    }

    // find the user with the email from database
    const user = await User.findOne({ email });

    // check if user present with this email and password
    if (user && (await bycrypt.compare(password, user.password))) {
      // check if email verification is completed
      if (!user.verified)
        return res
          .status(401)
          .json({ error: "Email verification required !!" });

      // create jwt token for this user
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );

      // add this token to the user
      const userToken = await Token.create({ token });

      // respond with the complete user details
      res.status(200).json({ user, userToken });
    } else {
      // if user not found with these credentials
      res.status(400).json({ error: "Failed to login with these credentials" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong !!" });
  }
});

app.get("/verify/:userid/:token", async (req, res) => {
  const { userid, token } = req.params;

  const user = await User.findOne({ _id: userid });
  if (user.email_verification_token === token) {
    await User.findOneAndUpdate({ _id: userid }, { $set: { verified: true } });

    // respond verification successful
    res.status(200).json({ error: "Email Verification successful !!" });
  } else {
    res.status(400).json({ error: "Failed to verify email !! Invalid token" });
  }
});

app.get("/logout", auth, async (req, res) => {
  try {
    // get the token from the request
    const token =
      req.body.token || req.query.token || req.headers["x-access-token"];

    // delete the token from the Database
    const deletedToken = await Token.deleteOne({ token });

    // respond to the user after successful logout
    res.status(200).json({
      error: `Logout ${
        deletedToken.deletedCount === 1 ? "Successful" : "Failed"
      }`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong !!" });
  }
});

module.exports = app;
