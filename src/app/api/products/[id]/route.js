import Product from "../../../../lib/models/Product";
import connectMongodb from "../../../../lib/db";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
    try {
        await connectMongodb();
        const { id } = params;

        const product = await Product.findById(id);

        if (!product) {
            return NextResponse.json(
                { status: false, message: "Product not found!" },
                { status: 404 },
            );
        }

        return NextResponse.json(
            { status: true, product },
            { status: 200 },
        );
    } catch (error) {
        return NextResponse.json(
            { status: false, message: "Failed to fetch product!", error: error.message },
            { status: 500 },
        );
    }
}