import { NextResponse } from "next/server";
import { connectMongodb } from "@/lib/db";
import Product from "@/lib/models/Product";

// 🔥 1. PUT: Product Update karne ke liye
export async function PUT(req, { params }) {
  try {
    await connectMongodb();
    const { id } = await params;
    const body = await req.json();

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        ...body,
        price: Number(body.price),
        stock: Number(body.stock),
        featuredProduct: Boolean(body.featuredProduct),
      },
      { new: true }, // Taake updated data return ho
    );

    if (!updatedProduct) {
      return NextResponse.json(
        { status: false, message: "Product not found!" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      status: true,
      message: "Product updated successfully!",
      product: updatedProduct,
    });
  } catch (error) {
    return NextResponse.json(
      { status: false, message: error.message },
      { status: 500 },
    );
  }
}

// 🔥 2. DELETE: Product urane ke liye
export async function DELETE(req, { params }) {
  try {
    await connectMongodb();
    const { id } = await params;

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return NextResponse.json(
        { status: false, message: "Product not found!" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      status: true,
      message: "Product deleted successfully!",
    });
  } catch (error) {
    return NextResponse.json(
      { status: false, message: error.message },
      { status: 500 },
    );
  }
}
