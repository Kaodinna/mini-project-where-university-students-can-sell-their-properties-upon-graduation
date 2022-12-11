import {
  accountSid,
  authToken,
  FromAdminMail,
  fromAdminPhone,
  GMAIL_PASS,
  GMAIL_USER,
  userSubject,
} from "../config/database.config";

import nodemailer from "nodemailer";

export const GenerateOTP = () => {
  const otp = Math.floor(1000 + Math.random() * 9000);
  const expiry = new Date();
  expiry.setTime(new Date().getTime() + 30 * 60 * 1000);
  return { otp, expiry };
};

export const onRequestOTP = async (otp: number, toPhoneNumber: string) => {
  const client = require("twilio")(accountSid, authToken);

  const response = await client.messages.create({
    body: `Your OTP is ${otp}`,
    to: toPhoneNumber,
    from: fromAdminPhone,
  });
  return response;
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_PASS,
  },
});

export const sendMail = async (
  from: string,
  to: string,
  subject: string,
  html: string
) => {
  try {
    const response = await transporter.sendMail({
      from: FromAdminMail,
      to,
      subject: userSubject,
      html,
    });
  } catch (err) {
    console.log(err);
  }
};

export const emailHtml = (otp: number): string => {
  const temp = `
  <div style = "max-width:700px; color:teal;font-size:110%;
  border:10px solid #ddd; padding: 50px 20px; margin:auto;">
  <h2 style = "text-transform:uppercase;text-align:center;color:teal;">
  Welcome to vladimir stores
  </h2>
  <p>Hi dear, your otp is ${otp} and will expire in 30 minutes</p>
  
  </div>
    `;
  return temp;
};
