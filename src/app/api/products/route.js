import { NextResponse } from "next/server";
import connectMongodb from "../../../../../nextBasicECommerceWebsiteTemplate/src/lib/db";
import Product from "../../../../../nextBasicECommerceWebsiteTemplate/src/lib/models/Product";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page")) || 1;
  const LIMIT = 10;
  const skip = (page - 1) * LIMIT;
  try {
    await connectMongodb();

    const products = await Product.find().sort({ featuredProduct: -1, createdAt: -1, }).skip(skip).limit(LIMIT);

    return NextResponse.json(
      {
        status: true,
        total: await Product.countDocuments(),
        products
      },
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
