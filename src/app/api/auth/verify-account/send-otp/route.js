import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import otpGenerator from "@/utils/otpGenerator";
import User from "@/lib/models/User";
import { connectMongodb } from "@/lib/db";

const emailConfig = {
  service: "gmail",
  auth: {
    user: process.env.PORTAL_EMAIL,
    pass: process.env.PORTAL_PASSWORD,
  },
};

async function sendVerificationEmail(email, otp) {
  const transporter = nodemailer.createTransport(emailConfig);

  const mailOptions = {
    from: process.env.PORTAL_EMAIL,
    to: email,
    subject: "Email Verification OTP",
    text: `Your OTP is: ${otp}`,
  };
  await transporter.sendMail(mailOptions);
}

export async function POST(req) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json(
        {
          status: false,
          message: "Email is required!",
          error: "missingFields",
        },
        { status: 400 },
      );
    }
    await connectMongodb();
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { status: false, message: "User not found!", error: "userNotFound" },
        { status: 404 },
      );
    }
    if (user.verify.status) {
      return NextResponse.json(
        {
          status: false,
          message: "User already verified!",
          error: "userAlreadyVerified",
        },
        { status: 400 },
      );
    }
    const otp = otpGenerator(4);
    user.verify.otp.code = otp;
    user.verify.otp.expireAt = Date.now() + 5 * 60 * 1000; // 5 minutes
    await user.save();
    await sendVerificationEmail(email, otp);

    return NextResponse.json(
      {
        status: true,
        message: "Verification email sent successfully!",
        success: "otpSentSuccess",
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: false,
        message: "Error sending verification email",
        error: error.message || "Unknown error",
      },
      { status: 500 },
    );
  }
}
