import mongoose from "mongoose";

const CartSchema = new mongoose.Schema(
  {
    _id: String,
    products: [
      {
        id: String,
        quantity: Number,
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.models.Cart || mongoose.model("Cart", CartSchema);
