import { type NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  // Parse JSON body from the request
  const body = await request.json();
  // Check if the 'text' property exists in the body
  const text = body.text;
  if (!text) {
    return new Response(JSON.stringify({ error: "Text not found" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  const msg = await prisma.message.create({
    data: {
      message: text,
    },
  });

  return NextResponse.json(msg);
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const text = searchParams.get("text");

  if (!text) {
    return NextResponse.json("text not found");
  }

  const msg = await prisma.message.create({
    data: {
      message: text,
    },
  });

  return NextResponse.json(msg);
}
