import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    userId: String,
    phone: String,
    products: [
      {
        id: String,
        quantity: Number,
      },
    ],
    items: Number,
    total: Number,
    payment: {
      type: String,
      enum: ["COD", "unpaid", "paid"],
      default: "unpaid",
    },
    address: String,
    status: {
      type: String,
      enum: [
        "Pending",
        "Processing",
        "Shipped",
        "Delivered",
        "Completed",
        "Cancelled",
      ],
      default: "Pending",
    },
  },
  { timestamps: true },
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
