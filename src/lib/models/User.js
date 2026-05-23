import { Schema, model, models } from "mongoose";

const userSchema = new Schema(
  {
    username: String,
    email: String,
    password: String,
    verify: {
      status: {
        type: Boolean,
        default: false,
      },
      otp: {
        code: String,
        expireAt: Date,
      },
    },
  },
  { timestamps: true },
);

export default models.users || model("users", userSchema);
