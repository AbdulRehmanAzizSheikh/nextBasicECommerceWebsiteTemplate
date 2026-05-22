import { NextResponse } from "next/server";
import { connectMongodb } from "@/lib/db";
import { cookies } from "next/headers";
import User from "@/lib/models/User";
import { generateToken } from "@/utils/jwt";
import bcrypt from "bcrypt";

export async function POST(req) {
  await connectMongodb();
  const body = await req.json();
  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json(
      { status: false, message: "All fields are required!" },
      { status: 400 },
    );
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { status: false, message: "User not found!" },
        { status: 404 },
      );
    }
    if (!user.verify.status) {
      return NextResponse.json(
        {
          status: false,
          message: "Please verify your email before logging in!",
          error: "Email not verified",
        },
        { status: 401 },
      );
    }
    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      return NextResponse.json(
        { status: false, message: "Invalid password!" },
        { status: 401 },
      );
    }

    const token = generateToken({ id: user._id });
    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 100 * 365 * 24 * 60 * 60, // 100 years
    });

    return NextResponse.json(
      { status: true, message: "User login successfully!" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { status: false, message: "User login failed!", error: error.message },
      { status: 500 },
    );
  }
}
