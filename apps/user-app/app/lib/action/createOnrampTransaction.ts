"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";

export async function createOnrampTransaction(
  amount: number,
  provider: string
) {
  const session = await getServerSession(authOptions);
  const token = Math.random().toString(36).substring(2, 15);
  const userId = session?.user.id;
  if (!userId) {
    throw new Error("User not authenticated");
  }

  await prisma.onRampTransaction.create({
    data: {
      userId: Number(userId),
      amount: amount,
      status: "Processing",
      startTime: new Date(),
      provider,
      token,
    },
  });

  return {
    message: "On ramp transaction created successfully",
  };
}
