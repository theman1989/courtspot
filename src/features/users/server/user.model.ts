import { model, models, Schema } from "mongoose";

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: [String],
      enum: ['booker', 'owner'],
      default: ['booker'],
      required: true
    },
    passwordHash: {
      type: String,
      select: false,
    },
    provider: {
      type: String,
      enum: ['google', 'credentials'],
      required: true
    }
  },
  {
    timestamps: true,
  },
);

userSchema.pre('save', async function () {
  if (this.provider === 'credentials' && !this.passwordHash) {
    throw new Error('credentials users must have a passwordHash');
  }
});

export const User = models.User || model("User", userSchema);