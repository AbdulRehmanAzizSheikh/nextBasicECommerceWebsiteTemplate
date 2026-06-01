import { NextResponse } from "next/server";
import connectMongodb from "../../../../lib/db";
import Order from "../../../../lib/models/Order";
import { decodeToken } from "../../../../utils/jwt";
import User from "../../../../lib/models/User";
import Product from "../../../../lib/models/Product";
import BanNumber from "../../../../lib/models/BanNumber";

export async function POST(request) {
  try {
    const body = await request.json();

    // 1. Database se connect karo
    await connectMongodb();

    // 2. Token verification
    const { id } = await decodeToken(request.cookies.get("token")?.value);
    if (!id) {
      return NextResponse.json(
        {
          status: false,
          message: "Invalid or missing token!",
          error: "invalidOrMissingToken",
        },
        { status: 401 },
      );
    }

    const userId = id;
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        {
          status: false,
          message: "User not found!",
          error: "userNotFound",
        },
        { status: 401 },
      );
    }

    const { phone, products, address } = body;
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    // 3. Validation
    if (!phone || !address || !products || !products.length) {
      return NextResponse.json(
        {
          status: false,
          message: "Required fields are missing!",
          error: "requiredFieldsMissing",
        },
        { status: 400 },
      );
    } else if (!products.length) {
      return NextResponse.json(
        {
          status: false,
          message: "Products array is required!",
          error: "productsArrayMissing",
        },
        { status: 400 },
      );
    } else if (products.some((p) => !p.id || !p.quantity)) {
      return NextResponse.json(
        {
          status: false,
          message: "Each product must have an ID and quantity!",
          error: "invalidProductData",
        },
        { status: 400 },
      );
    } else if (!phoneRegex.test(phone)) {
      return NextResponse.json(
        {
          status: false,
          message: "Invalid phone number format!",
          error: "invalidPhoneFormat",
        },
        { status: 400 },
      );
    } else if (await BanNumber.findOne({ phone })) {
      return NextResponse.json(
        {
          status: false,
          message: "You are not allowed to place orders!",
          error: "userBanned",
        },
        { status: 403 },
      );
    }

    const order = {
      userId,
      address,
      products,
      items: products.length,
      total: 0,
    };
    if (phone) order.phone = phone;

    await Promise.all(
      products.map(async (p) => {
        try {
          const product = await Product.findById(p.id);
          if (product) {
            order.total += product.price * p.quantity;
          }
        } catch (e) {
          console.error(`Error fetching product with ID ${p.id}:`, e);
        }
      }),
    );

    const createOrder = await Order.create(order);

    return NextResponse.json(
      {
        status: true,
        message: "Order placed successfully!",
        orderId: createOrder._id,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Order Creation Error:", error);
    return NextResponse.json(
      {
        status: false,
        message: "Internal Server Error",
        error: error,
      },
      { status: 500 },
    );
  }
}
