"use server";

import { redirect } from "next/navigation";
import { registerSchema } from "@/features/auth/schemas";
import {
  createUser
} from '@/features/users';

type ActionResult = { error: string } | undefined;

export async function registerAction(data: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}): Promise<ActionResult> {
  const result = registerSchema.safeParse(data);

  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  try {
    await createUser(result.data);
  } catch (err: unknown) {
    if (
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      (err as { code: unknown }).code === 11000
    ) {
      return { error: "An account with this email already exists" };
    }
    return { error: "Something went wrong. Please try again." };
  }

  redirect("/login");
}
