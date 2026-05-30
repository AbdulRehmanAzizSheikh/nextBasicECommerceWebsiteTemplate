import { NextResponse } from "next/server";
import connectMongodb from "../../../../../lib/db.js";
import { cookies } from "next/headers";
import Admin from "../../../../../lib/models/Admin";
import { generateToken } from "../../../../../utils/jwt";

export async function POST(req) {
  try {
    await connectMongodb();
    const { email, otp } = await req.json();

    // 1. Validation checks
    if (!email || !otp) {
      return NextResponse.json(
        { status: false, message: "Email and OTP are required!" },
        { status: 400 },
      );
    }

    // 2. Admin ko database mein dhoondo
    const admin = await Admin.findOne({ email: email.toLowerCase() });

    if (!admin) {
      return NextResponse.json(
        { status: false, message: "Admin not found!", error: "adminNotFound" },
        { status: 400 },
      );
    }

    if (admin.otp.expireAt && new Date() > admin.otp.expireAt) {
      return NextResponse.json(
        {
          status: false,
          message: "OTP has expired! Please request a new one.",
        },
        { status: 400 },
      );
    }

    // 4. OTP code match karo
    if (admin.otp.code !== otp.trim()) {
      return NextResponse.json(
        {
          status: false,
          message: "Wrong OTP! Please try again.",
          error: "invalidOTP",
        },
        { status: 400 },
      );
    }
    admin.otp = null; // OTP ko clear kar do after successful verification
    await admin.save();

    const token = await generateToken({ id: admin._id });

    const cookieStore = await cookies();
    cookieStore.set("admin_token", token, {
      httpOnly: true,
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 365 * 10, // second, minute, hour, day, year
    });

    return NextResponse.json(
      {
        status: true,
        message: "Admin logged in successfully!",
        success: "adminLoggedIn",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Admin Verify OTP Error:", error);
    return NextResponse.json(
      { status: false, message: "Something went wrong on the server!" },
      { status: 500 },
    );
  }
}
