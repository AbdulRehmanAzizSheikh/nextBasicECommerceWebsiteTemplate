import { NextResponse } from "next/server";
import { connectMongodb } from "@/lib/db";
import Product from "@/lib/models/Product";

// 🌍 Sab ke liye open: Frontend website par products show karne ke liye
export async function GET() {
  try {
    await connectMongodb();

    const products = await Product.find().sort({
      featuredProduct: -1,
      createdAt: -1,
    });

    return NextResponse.json(
      { status: true, count: products.length, products },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: false,
        message: "Failed to fetch products!",
        error: error.message,
      },
      { status: 500 },
    );
  }
}
