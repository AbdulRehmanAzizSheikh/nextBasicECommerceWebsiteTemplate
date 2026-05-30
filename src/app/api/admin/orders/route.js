import { NextResponse } from "next/server";
import connectMongodb from "../../../../lib/db";
import Order from "../../../../lib/models/Order";
import User from "../../../../lib/models/User";
import Product from "../../../../lib/models/Product";
import { decodeToken } from "../../../../utils/jwt";
import Admin from "../../../../lib/models/Admin";

export async function GET(request) {
  try {
    await connectMongodb();

    const token = request.cookies.get("admin_token")?.value;
    if (!token) {
      return NextResponse.json(
        { status: false, message: "Unauthorized! Missing token." },
        { status: 401 },
      );
    }

    const decoded = await decodeToken(token);
    if (!decoded || !decoded.id) {
      return NextResponse.json(
        { status: false, message: "Invalid token!" },
        { status: 401 },
      );
    }

    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      return NextResponse.json(
        { status: false, message: "Access Denied! Admins only." },
        { status: 403 },
      );
    }

    const getOrders = await Order.find();
    const getUser = async (id) => {
      return await User.findById(id);
    };
    const getProducts = async (products) => {
      const productsIds = products.map((p) => p.id);
      const dbProducts = await Product.find({
        _id: { $in: productsIds },
      }).select("title price imageUrl _id");
      products = products.map((p) => {
        const dbProduct = dbProducts.find(
          (dp) => dp._id.toString() === p.id.toString(),
        );
        return {
          id: p.id,
          title: dbProduct?.title,
          price: dbProduct?.price,
          imageUrl: dbProduct?.imageUrl,
          quantity: p.quantity,
        };
      });
      return products;
    };
    const orders = await Promise.all(
      getOrders.map(async (order) => {
        return {
          orderId: order._id,
          user: await getUser(order.userId).then((user) => ({
            id: user._id,
            username: user.username,
            email: user.email,
          })),
          phone: order.phone || "",
          address: order.address,
          products: await getProducts(order.products),
          total: order.total,
          status: order.status,
          payment: order.payment,
          createdAt: order.createdAt,
        };
      }),
    );

    return NextResponse.json(
      {
        status: true,
        count: orders.length,
        orders: orders,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Admin Get Orders Error:", error);
    return NextResponse.json(
      {
        status: false,
        message: "Internal Server Error",
        error: error.message,
      },
      { status: 500 },
    );
  }
}

export async function PUT(request) {
  try {
    await connectMongodb();

    const token = request.cookies.get("admin_token")?.value;
    if (!token) {
      return NextResponse.json(
        { status: false, message: "Unauthorized! Missing token." },
        { status: 401 },
      );
    }

    const decoded = await decodeToken(token);
    if (!decoded || !decoded.id) {
      return NextResponse.json(
        { status: false, message: "Invalid token!" },
        { status: 401 },
      );
    }

    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      return NextResponse.json(
        { status: false, message: "Access Denied! Admins only." },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { orderId, status } = body;

    if (!orderId || !status) {
      return NextResponse.json(
        { status: false, message: "Missing orderId or status!" },
        { status: 400 },
      );
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status: status },
      { new: true }, // { new: true } se updated data wapas milta hai
    );

    if (!updatedOrder) {
      return NextResponse.json(
        { status: false, message: "Order not found!" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        status: true,
        message: `Order status updated to ${status} successfully!`,
        success: updatedOrder,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Admin Update Status Error:", error);
    return NextResponse.json(
      {
        status: false,
        message: "Internal Server Error",
        error: error.message,
      },
      { status: 500 },
    );
  }
}
