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
                code: {
                    type: String,
                },
                expireAt: {
                    type: Date,
                },
            },
        },
    },
    { timestamps: true },
);

const User = models.users || model("users", userSchema);

export default User;