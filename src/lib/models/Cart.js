import mongoose from "mongoose";
const CartSchema = new mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, required: true },
    products: [{
      _id: { type: mongoose.Schema.Types.ObjectId, required: true },
      quantity: { type: Number, required: true }
    }],
  },
  { timestamps: true },
);
export default mongoose.models.Cart || mongoose.model("Cart", CartSchema);