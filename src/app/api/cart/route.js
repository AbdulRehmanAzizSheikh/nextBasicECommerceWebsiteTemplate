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

    // User ka cart dhoondo aur `.populate()` ke zariye product ka naam, price, image bhi sath uthao
    const cart = await Cart.findOne({ _id }).populate(
      "products.productId",
      "name price image stock",
    );

    if (!cart || !cart.products.length) {
      return NextResponse.json(
        { status: true, cart: [], message: "Cart is empty" },
        { status: 200 },
      );
    }

    return NextResponse.json(
      { status: true, cart: cart.products },
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
    const _id = await getUserIdFromToken(request);
    if (!_id) {
      return NextResponse.json(
        { status: false, message: "Unauthorized!" },
        { status: 401 },
      );
    }
    const user = await User.findById(_id);
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

    const { id, quantity } = await request.json();
    if (!id || !quantity) {
      return NextResponse.json(
        { status: false, message: "Missing fields!" },
        { status: 400 },
      );
    }

    // User ka cart dhoondo, agar nahi hai to naya empty cart object banao
    let cart = await Cart.findOne({ _id });
    if (!cart) {
      cart = new Cart({ _id, products: [] });
    }

    // Check karo kya yeh item pehle se cart me hai?
    const itemIndex = cart.products.findIndex((p) => p.id.toString() === id);

    if (itemIndex > -1) {
      // Agar pehle se hai, to purani quantity me nayi quantity plus karlo
      cart.products[itemIndex].quantity = quantity;
    } else {
      // Agar naya item hai, to array me push marnon
      cart.products.push({ id, quantity });
    }

    console.log(cart);
    await cart.save();
    return NextResponse.json(
      {
        status: true,
        message: "Cart updated successfully!",
        cart: cart.products,
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
    const _id = await getUserIdFromToken(request);
    if (!_id) {
      return NextResponse.json(
        { status: false, message: "Unauthorized!" },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json(
        { status: false, message: "Product ID is required!" },
        { status: 400 },
      );
    }

    let cart = await Cart.findOne({ _id });
    if (!cart) {
      return NextResponse.json(
        { status: false, message: "Cart not found!" },
        { status: 404 },
      );
    }

    // Filter chalakar us makhsoos product ko array se nikal do
    cart.products = cart.products.filter((p) => p.id.toString() !== productId);

    await cart.save();
    return NextResponse.json(
      { status: true, message: "Item removed from cart!", cart: cart.products },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { status: false, message: error.message },
      { status: 500 },
    );
  }
}
