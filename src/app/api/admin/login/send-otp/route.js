import { NextResponse } from "next/server";
import { connectMongodb } from "@/lib/db"; // Apne db connection ka sahi path check karlena
import Admin from "@/lib/models/Admin";
import nodemailer from "nodemailer";
import otpGenerator from "@/utils/otpGenerator";

export async function POST(req) {
  const { email } = await req.json();
  if (!email || !email.trim()) {
    return NextResponse.json(
      { message: "Please enter your email!" },
      { status: 400 },
    );
  }
  try {
    await connectMongodb();

    // 1. Check karo ke kya yeh email database mein pehle se whitelisted hai
    const admin = await Admin.findOne({ email: email.toLowerCase() });

    if (!admin) {
      return NextResponse.json(
        { message: "Access Denied: You are not an authorized admin!" },
        { status: 403 },
      );
    }

    const otp = otpGenerator();

    // 3. Admin ke record ke andar OTP aur Expiry save/update karo
    admin.otp = {
      code: otp,
      expireAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes from now
    };
    await admin.save();

    // 4. Nodemailer Setup (Apne env credentials ke hisab se check karlena)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.PORTAL_EMAIL,
        pass: process.env.PORTAL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.PORTAL_EMAIL,
      to: email,
      subject: "Admin Portal Login - OTP Verification",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; rounded: 8px;">
          <h2 style="color: #333; text-align: center;">Admin Security Verification</h2>
          <p>You requested access to the Admin Panel. Use the following one-time password (OTP) to login:</p>
          <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 4px; color: #2563eb; margin: 20px 0; border-radius: 6px;">
            ${otp}
          </div>
          <p style="color: #666; font-size: 12px; text-align: center;">This OTP is strictly confidential and will expire in 5 minutes.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: "OTP sent successfully to your admin email!" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Admin Send OTP Error:", error);
    return NextResponse.json(
      { message: "Something went wrong on the server!" },
      { status: 500 },
    );
  }
}
