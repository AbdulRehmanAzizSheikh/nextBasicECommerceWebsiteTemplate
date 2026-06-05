import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema(
  {
    email: String,
    otp: {
      code: String,
      expireAt: Date,
    },
  },
  { timestamps: true },
);

export default mongoose.models.Admin || mongoose.model("Admin", AdminSchema);
