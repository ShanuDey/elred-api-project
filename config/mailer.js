const nodemailer = require("nodemailer");

exports.sendVerificationEmail = async (email, verificationLink) => {
  // get email hosting account details
  const { EMAIL_ACCOUNT_USER, EMAIL_ACCOUNT_PASSWORD, EMAIL_HOST, EMAIL_PORT } =
    process.env;

  let testEmail = false; // flag to identify test Email
  let transporter;
  if (
    EMAIL_ACCOUNT_USER &&
    EMAIL_ACCOUNT_PASSWORD &&
    EMAIL_HOST &&
    EMAIL_PORT
  ) {
    transporter = nodemailer.createTransport({
      host: EMAIL_HOST,
      port: EMAIL_PORT,
      secure: false, // true for 465, false for other ports
      auth: {
        user: EMAIL_ACCOUNT_USER, // generated ethereal user
        pass: EMAIL_ACCOUNT_PASSWORD, // generated ethereal password
      },
    });
  } else {
    testEmail = true;
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass, // generated ethereal password
      },
    });
  }

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Shanu Dey" <Verify@example.com>', // sender address
    to: email, // list of receivers
    subject: "Verification OTP for elRed API", // Subject line
    text: "elRed API", // plain text body
    html: `<b>Verification link : <a href="${verificationLink}">Click here to verify email</a></b>`, // html body
  });

  if (testEmail) return nodemailer.getTestMessageUrl(info);
};
