import { NextResponse } from "next/server";
import { connectMongodb } from "@/lib/db";
import Product from "@/lib/models/Product";

export async function POST(req) {
  try {
    await connectMongodb();
    const body = await req.json();
    const {
      title,
      description,
      price,
      category,
      stock,
      imageUrl,
      keywords,
      featuredProduct,
    } = body;

    // Server-side strict check
    if (!title || !price) {
      return NextResponse.json(
        {
          status: false,
          message: "Title and Price are required!",
        },
        { status: 400 },
      );
    }

    const product = await Product.create({
      title,
      description,
      price: Number(price),
      category: category,
      stock: Number(stock),
      imageUrl,
      keywords,
      featuredProduct: Boolean(featuredProduct),
    });

    return NextResponse.json(
      {
        status: true,
        message: "Product has been published successfully!",
        product: product,
        success: "productAdded",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Add Product API Error:", error);
    return NextResponse.json(
      {
        status: false,
        message: "Server Error: Failed to add product!",
        error: error.message,
      },
      { status: 500 },
    );
  }
}
