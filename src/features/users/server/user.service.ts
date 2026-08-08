import bcrypt from "bcryptjs";
import { connectDB } from "@/shared/libs/mongodb";
import { User } from "./user.model";

async function createUser(data: {
  name: string;
  email: string;
  password: string;
}) {
  await connectDB();

  const passwordHash = await bcrypt.hash(data.password, 12);

  return User.create({
    name: data.name.trim(),
    email: data.email.toLowerCase(),
    passwordHash,
    role: "booker",
    provider: "credentials",
  });
}

async function getUsers() {
  await connectDB();

  return User.find().sort({ createdAt: -1 }).lean();
}

export {
  createUser,
  getUsers
}