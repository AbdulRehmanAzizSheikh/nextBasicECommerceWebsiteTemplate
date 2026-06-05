import { NextResponse } from "next/server";
import connectMongodb from "../../../lib/db";
import Cart from "../../../lib/models/Cart";
import Product from "../../../lib/models/Product";
import { decodeToken } from "../../../utils/jwt";
import User from "../../../lib/models/User";

// 🔐 Helper function token se user ID nikalne ke liye
async function getUserIdFromToken(request) {
  const token = request.cookies.get("token")?.value;
  if (!token) return null;
  const decoded = await decodeToken(token);
  return decoded?.id || null;
}

// ==========================================
// 1. 🛒 GET: User ka cart fetch karna
// ==========================================
export async function GET(request) {
  try {
    await connectMongodb();
    const _id = await getUserIdFromToken(request);

    if (!_id) {
      return NextResponse.json(
        { status: false, message: "Unauthorized!" },
        { status: 401 },
      );
    }

    const cart = await Cart.findOne({ _id });

    if (!cart || !cart.products.length) {
      return NextResponse.json(
        { status: true, cart: [], message: "Cart is empty" },
        { status: 200 },
      );
    }

    return NextResponse.json(
      {
        status: true, cart: {
          products: cart.products,
          totalItems: cart.products.reduce((sum, item) => sum + item.quantity, 0),
        },
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { status: false, message: error.message },
      { status: 500 },
    );
  }
}

// ==========================================
// 2. ➕ POST: Cart me product add ya update karna
// ==========================================
export async function POST(request) {
  try {
    await connectMongodb();
    const userId = await getUserIdFromToken(request);
    if (!userId) {
      return NextResponse.json(
        { status: false, message: "Unauthorized!" },
        { status: 401 },
      );
    }
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        {
          status: false,
          message: "User not found!",
          error: "userNotFound",
        },
        { status: 404 },
      );
    }

    const { _id, quantity } = await request.json();
    if (!_id || !quantity) {
      return NextResponse.json(
        { status: false, message: "Missing fields!" },
        { status: 400 },
      );
    }

    // User ka cart dhoondo, agar nahi hai to naya empty cart object banao
    let cart = await Cart.findOne({ _id: userId });
    if (!cart) {
      cart = new Cart({ _id: userId, products: [] });
    }

    // check karo kya product ID valid hai ya nahi
    const product = async () => {
      try {
        return await Product.findById({ _id });
      } catch (error) {
        return null;
      }
    };
    if (!(await product())) {
      return NextResponse.json(
        { status: false, message: "Product not found!" },
        { status: 404 },
      );
    }

    // Check karo kya yeh item pehle se cart me hai?
    const itemIndex = cart.products.findIndex((p) => p._id == _id);
    if (itemIndex > -1) {
      cart.products[itemIndex].quantity = quantity;
    } else {
      cart.products.push({ _id, quantity });
    }

    await cart.save();
    return NextResponse.json(
      {
        status: true,
        message: "Cart updated successfully!",
        cart: cart,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { status: false, message: error.message },
      { status: 500 },
    );
  }
}

// ==========================================
// 3. ❌ DELETE: Cart se kisi item ko urana
// ==========================================
export async function DELETE(request) {
  try {
    await connectMongodb();
    const userId = await getUserIdFromToken(request);
    if (!userId) {
      return NextResponse.json(
        { status: false, message: "Unauthorized!" },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(request.url);
    const _id = searchParams.get("_id");

    if (!_id) {
      return NextResponse.json(
        { status: false, message: "Product ID is required!" },
        { status: 400 },
      );
    }

    let cart = await Cart.findOne({ _id: userId });
    if (!cart) {
      return NextResponse.json(
        { status: false, message: "Cart not found!" },
        { status: 404 },
      );
    }
    const checkProduct = cart.products.some((p) => p._id == _id);
    if (!checkProduct) {
      return NextResponse.json(
        { status: false, message: "Product not found in cart!" },
        { status: 404 },
      );
    }
    // Filter chalakar us makhsoos product ko array se nikal do
    const deleteProduct = cart.products.filter((p) => p._id != _id);
    cart.products = deleteProduct;

    await cart.save();
    return NextResponse.json(
      {
        status: true, message: "Item removed from cart!", cart: {
          products: cart.products,
          totalItems: cart.products.length
        }
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { status: false, message: error.message },
      { status: 500 },
    );
  }
}
