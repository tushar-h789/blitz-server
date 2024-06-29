const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const { OAuth2 } = google.auth;
const oauth_link = "https://developer.google.com/oauthplayground";
const { EMAIL, MAILING_ID, MAILING_SECRET, MAILING_REFRESH } = process.env;

// OAuth2 client setup
const auth = new OAuth2(
  MAILING_ID, // Client ID
  MAILING_SECRET, // Client Secret
  MAILING_REFRESH, // Refresh Token
  oauth_link // OAuth2 Playground URL
);

// Function to send verification email
exports.sendVerifiedEmail = (email, name, url) => {
  auth.setCredentials({
    refresh_token: MAILING_REFRESH, // Set refresh token for the auth object
  });

  // Obtain access token
  const accessToken = auth.getAccessToken();

  // Configure Nodemailer transport
  const stmp = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: EMAIL, // Email address
      clientId: MAILING_ID, // Client ID
      clientSecret: MAILING_SECRET, // Client Secret
      refreshToken: MAILING_REFRESH, // Refresh Token
      accessToken, // Access Token
    },
  });

  // Define email options
  const mailOptions = {
    from: EMAIL, // Sender's email address
    to: email, // Recipient's email address
    subject: "Blitz App Verification", // Subject line
    html: `<div style="padding: 20px; border: 1px solid #ddd; border-radius: 5px; text-align: center;">
             <h1 style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif">
               Hello ${name}, What's Up?
             </h1>
             <p style="color: #333; font-size: 16px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
               Hello ${name}, hope you are doing well. Please confirm your verification email to start your journey with us.
             </p>
             <a style="border: 1px solid #666; padding: 8px 15px; border-radius: 5px; text-decoration: none; color: #333; margin-top: 20px; display: inline-block; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;"
                onMouseOver="this.style.background = '#ddd'"
                onMouseLeave="this.style.background = 'transparent'"
                href=${url}>
               Verify Email
             </a>
           </div>`,
  };

  // Send email
  stmp.sendMail(mailOptions, (err, res) => {
    if (err) return err; // Handle error
    return res; // Return response
  });
};
