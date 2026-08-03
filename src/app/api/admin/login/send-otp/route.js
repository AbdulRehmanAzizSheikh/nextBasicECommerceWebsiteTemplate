import { NextResponse } from "next/server";
import connectMongodb from "@/lib/db.js";
import Admin from "@/lib/models/Admin.js";
import emailSender from "@/utils/email/index.js";
import otpGenerator from "@/utils/otpGenerator/index.js";

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

    const emailResponse = await emailSender({
      to: admin.email,
      subject: "🔒 Admin Portal Login - OTP Verification",
      html: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 30px 20px; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
                <div style="text-align: center; margin-bottom: 25px;">
                  <div style="display: inline-block; background-color: #eff6ff; padding: 12px; border-radius: 50%; margin-bottom: 10px;">
                      <span style="font-size: 28px;">🔐</span>
                  </div>
                  <h2 style="color: #1f2937; margin: 0; font-size: 22px; font-weight: 700; letter-spacing: -0.025em;">
                    Security Verification
                  </h2>
                  <p style="color: #4b5563; font-size: 14px; margin-top: 8px; margin-bottom: 0;">
                  Admin Portal Access Request
                  </p>
              </div>
              <hr style="border: 0; border-top: 1px solid #f3f4f6; margin-bottom: 25px;" />
              <div style="color: #374151; font-size: 15px; line-height: 1.6;">
                <p style="margin-top: 0;">Hello,</p>
                <p>A login attempt was made to access your secure admin area. Please use the following One-Time Password (OTP) to complete your verification:</p>
                <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 18px; text-align: center; margin: 25px 0; border-radius: 8px;">
                  <span style="font-family: 'Courier New', Courier, monospace; font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #0284c7; display: block; line-height: 1;">
                    ${otp}
                  </span>
                </div>
                <p style="color: #ef4444; font-size: 13px; font-weight: 500; background-color: #fef2f2; padding: 10px 12px; border-radius: 6px; margin-bottom: 25px; border-left: 3px solid #ef4444;">
                  ⚠️ <strong>Security Note:</strong> This OTP is highly confidential and will expire automatically in <strong>5 minutes</strong>. If you did not request this code, please secure your credentials immediately.
                </p>
              </div>
              <hr style="border: 0; border-top: 1px solid #f3f4f6; margin-top: 25px; margin-bottom: 20px;" />
              <div style="text-align: center;">
                <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                  &copy; ${new Date().getFullYear()} Control Panel. All rights reserved.
                </p>
              </div>

            </div>`,
    });

    if (!emailResponse.success) {
      console.error("Failed to send OTP email:", emailResponse.error);
      return NextResponse.json(
        { message: "Failed to send OTP email. Please try again later." },
        { status: 500 },
      );
    }
    return NextResponse.json(
      { message: "OTP sent successfully!" },
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

