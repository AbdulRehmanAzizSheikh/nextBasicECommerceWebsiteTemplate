import mongoose from "mongoose";

const BanNumberSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true, // Ek number do dafa ban nahi ho sakta
      trim: true,
    },
    reason: {
      type: String,
      default: "No reason provided by admin.", // Admin apni marzi se Urdu/English kuch bhi likhe
    },
  },
  { timestamps: true },
);

// Next.js ke compilation jhatkon se bachne ke liye cleanup check
const BanNumber =
  mongoose.models.BanNumber || mongoose.model("BanNumber", BanNumberSchema);
export default BanNumber;
