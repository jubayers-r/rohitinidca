"use server";

import prisma from "@/src/lib/prisma";

export async function joinWaitlist(data: { email: string; phone: string }) {
  // Basic server-side validation (Don't trust the client!)
  if (!data.email || !data.phone) {
    return { success: false, message: "Invalid data provided." };
  }

  try {
    const entry = await prisma.waitlist.create({
      data: {
        email: data.email,
        phone: data.phone,
      },
    });

    // Return only what is necessary to avoid serialization issues
    return { success: true, id: entry.id };
  } catch (error: any) {
    console.error("Prisma Error:", error); // Check your server logs!

    if (error.code === "P2002") {
      return { success: false, message: "This email is already registered." };
    }

    return { success: false, message: "Database connection error." };
  }
}
