import { NextResponse } from "next/server";
import User from "@/lib/models/User";
import { connectMongodb } from "@/lib/db/index.js";
import bcrypt from "bcrypt";

export async function POST(req) {
    await connectMongodb();
    const body = await req.json();
    const { username, email, password } = body;

    if (!username || !email || !password) {
        return NextResponse.json(
            { status: false, message: "All fields are required!" },
            { status: 400 },
        );
    }
    if (password.length < 6) {
        return NextResponse.json(
            { status: false, message: "Password must be at least 6 characters long!" },
            { status: 400 },
        );
    }
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        return NextResponse.json(
            { status: false, message: "Please provide a valid email address!" },
            { status: 400 },
        );
    }
    if (!username.match(/^[a-zA-Z0-9_\.]+$/)) {
        return NextResponse.json(
            { status: false, message: "Username can only contain letters, numbers, (_) underscores and (.) dots!" },
            { status: 400 },
        );
    }
    try {

        const userExists = await User.findOne({ username, email });
        if (userExists && userExists.verify.status) {
            return NextResponse.json(
                { status: false, message: "Account with this username and email already exists!" },
                { status: 400 },
            );
        }
        const emailExists = await User.findOne({ email });
        if (emailExists && emailExists.verify.status) {
            return NextResponse.json(
                { status: false, message: "Account with this email already exists!" },
                { status: 400 },
            );
        }
        const usernameExists = await User.findOne({ username });
        if (usernameExists && usernameExists.verify.status) {
            return NextResponse.json(
                { status: false, message: "Account with this username already exists!" },
                { status: 400 },
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ username, email, password: hashedPassword, });
        return NextResponse.json(
            {
                status: true,
                message: "Account created successfully!",
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                },
            },
            { status: 201 },
        );
    } catch (error) {
        return NextResponse.json(
            {
                status: false,
                message: "Account creation failed!",
                error: error.message || "Unknown error",
            },
            { status: 500 },
        );
    }
}