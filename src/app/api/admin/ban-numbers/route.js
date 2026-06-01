import { NextResponse } from "next/server";
import connectMongodb from "../../../../lib/db";
import BanNumber from "../../../../lib/models/BanNumber";
import Admin from "../../../../lib/models/Admin";
import { decodeToken } from "../../../../utils/jwt";

// 👮‍♂️ HELPER FUNCTION: Security Check ta-ke koi aam banda ya hacker yeh API hit na kare
async function checkAdmin(request) {
  const token = request.cookies.get("admin_token")?.value;
  if (!token) return false;

  const decoded = await decodeToken(token);
  if (!decoded || !decoded.id) return false;

  await connectMongodb();
  const admin = await Admin.findById(decoded.id);
  return !!admin; // Wahi shandaar true/false shortcut ustad!
}

// 1. 📂 GET METHOD: Saare banned numbers ki list admin dashboard par dikhane ke liye
export async function GET(request) {
  try {
    if (!(await checkAdmin(request))) {
      return NextResponse.json(
        { status: false, message: "Unauthorized Access!" },
        { status: 401 },
      );
    }

    const bannedList = await BanNumber.find().sort({ createdAt: -1 });

    return NextResponse.json(
      { status: true, bannedNumbers: bannedList },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { status: false, message: "Internal Server Error", error: error.message },
      { status: 500 },
    );
  }
}

// 2. 📝 POST METHOD: Admin panel se kisi naye fraud number ko blacklist/ban list me daalna
export async function POST(request) {
  try {
    if (!(await checkAdmin(request))) {
      return NextResponse.json(
        { status: false, message: "Unauthorized Access!" },
        { status: 401 },
      );
    }

    const { phone, reason } = await request.json();

    if (!phone) {
      return NextResponse.json(
        { status: false, message: "Phone number is required!" },
        { status: 400 },
      );
    }

    const phoneRegex = /^\+?[1-9]\d{1,14}$/;

    if (!phoneRegex.test(phone)) {
      return NextResponse.json(
        { status: false, message: "Invalid phone number format!" },
        { status: 400 },
      );
    }

    // Check karo kahin yeh number pehle se hi ban to nahi hai
    const exists = await BanNumber.findOne({ phone: phone.trim() });
    if (exists) {
      return NextResponse.json(
        { status: false, message: "This number is already banned!" },
        { status: 400 },
      );
    }
    // Naya ban record create karo database me
    const newBan = await BanNumber.create({
      phone: phone.trim(),
      reason: reason,
    });

    return NextResponse.json(
      { status: true, message: "Number banned successfully!", data: newBan },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { status: false, message: "Internal Server Error", error: error.message },
      { status: 500 },
    );
  }
}

// 3. ✏️ PUT METHOD: Kisi number ke ban hone ki wajah (Reason) ko badalna/edit karna
export async function PUT(request) {
  try {
    if (!(await checkAdmin(request))) {
      return NextResponse.json(
        { status: false, message: "Unauthorized Access!" },
        { status: 401 },
      );
    }

    const { id, reason } = await request.json();

    if (!id || !reason) {
      return NextResponse.json(
        { status: false, message: "Missing ID or Reason!" },
        { status: 400 },
      );
    }

    const updatedBan = await BanNumber.findByIdAndUpdate(
      id,
      { reason: reason.trim() },
      { new: true }, // Ta-ke updated data return ho
    );

    if (!updatedBan) {
      return NextResponse.json(
        { status: false, message: "Banned number record not found!" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        status: true,
        message: "Ban reason updated successfully!",
        data: updatedBan,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { status: false, message: "Internal Server Error", error: error.message },
      { status: 500 },
    );
  }
}

// 4. ❌ DELETE METHOD: Kisi number ko unban karna (List se permanent hatana)
export async function DELETE(request) {
  try {
    if (!(await checkAdmin(request))) {
      return NextResponse.json(
        { status: false, message: "Unauthorized Access!" },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { status: false, message: "Missing Record ID!" },
        { status: 400 },
      );
    }

    const unbanned = await BanNumber.findByIdAndDelete(id);

    if (!unbanned) {
      return NextResponse.json(
        { status: false, message: "Record not found!" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { status: true, message: "Number unbanned successfully!" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { status: false, message: "Internal Server Error", error: error.message },
      { status: 500 },
    );
  }
}
