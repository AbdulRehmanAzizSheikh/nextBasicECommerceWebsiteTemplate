import { NextResponse } from "next/server";
import connectMongodb from "../../../../../../nextBasicECommerceWebsiteTemplate/src/lib/db.js";
import Product from "../../../../../../nextBasicECommerceWebsiteTemplate/src/lib/models/Product.js";

// 🔥 1. PATCH: Product Update karne ke liye
export async function PATCH(req) {
  try {
    const { searchParams } = new URL(req.url);
    const _id = searchParams.get("_id");
    if (!_id) {
      return NextResponse.json(
        { status: false, message: "Product ID is required!" },
        { status: 400 },
      );
    }
    await connectMongodb();
    const body = await req.json();
    const product = await Product.findById(_id);
    if (!product) {
      return NextResponse.json(
        { status: false, message: "Product not found!" },
        { status: 404 },
      );
    }
    console.log("Update Product API Body:", body);
    const updatedProduct = await Product.findOneAndReplace({ _id: _id }, body,);
    console.log("Update Product API Body:", updatedProduct);
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
    console.error("Update Product API Error:", error);
    return NextResponse.json(
      { status: false, message: error.message },
      { status: 500 },
    );
  }
}

// 🔥 2. DELETE: Product urane ke liye
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const _id = searchParams.get("_id");
    if (!_id) {
      return NextResponse.json(
        { status: false, message: "Product ID is required!" },
        { status: 400 },
      );
    }
    await connectMongodb();

    const deletedProduct = await Product.findByIdAndDelete(_id);

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
