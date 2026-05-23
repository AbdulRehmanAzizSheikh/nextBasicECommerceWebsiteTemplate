import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    email: String,
    otp: {
      code: String,
      expireAt: Date,
    },
  },
  { timestamps: true },
);

export default mongoose.models.Admin || mongoose.model("Admin", adminSchema);
