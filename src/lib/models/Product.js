import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    price: Number,
    category: { type: String, default: "other" },
    stock: { type: Number, default: 0 },
    imageUrl: {
      type: String,
      default:
        "https://s3.ap-south-1.amazonaws.com/production.media.hafla.com/static_images/host/default-images/default-product.png",
    },
    keywords: [String],
    featuredProduct: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);
