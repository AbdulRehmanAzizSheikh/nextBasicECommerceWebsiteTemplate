import { NextResponse } from "next/server";
import { connectMongodb } from "@/lib/db";
import User from "@/lib/models/User";

export async function POST(req) {
  try {
    const { email, otp } = await req.json();
    if (!email || !otp) {
      return NextResponse.json(
        {
          status: false,
          message: "Email and OTP are required",
          error: "missingFields",
        },
        { status: 400 },
      );
    }
    await connectMongodb();
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        {
          status: false,
          message: "User not found",
          error: "userNotFound",
        },
        { status: 404 },
      );
    }
    if (user.verify.status) {
      return NextResponse.json(
        {
          status: false,
          message: "User already verified",
          error: "userAlreadyVerified",
        },
        { status: 400 },
      );
    }
    if (user.verify.otp.code !== otp) {
      return NextResponse.json(
        {
          status: false,
          message: "Invalid OTP",
          error: "invalidOtp",
        },
        { status: 400 },
      );
    }
    if (user.verify.otp.expireAt < Date.now()) {
      return NextResponse.json(
        {
          status: false,
          message: "OTP expired",
          error: "otpExpired",
        },
        { status: 400 },
      );
    }
    user.verify.status = true;
    user.verify.otp.code = null;
    user.verify.otp.expireAt = null;
    await user.save();
    return NextResponse.json(
      {
        status: true,
        message: "Account verified successfully",
        success: "accountVerifiedSuccess",
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: false,
        message: "Error in verifying account",
        error: error.message || "Unknown error",
      },
      { status: 500 },
    );
  }
}
