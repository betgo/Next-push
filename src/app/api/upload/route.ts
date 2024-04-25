import { type Message } from "@prisma/client";
import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { db } from "~/server/db";

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get("filename");
  const filesize = searchParams.get("filesize");
  const key = searchParams.get("key");
  try {
    const blob = await put(filename ?? "", request.body!, {
      access: "public",
    });
    const isImage = blob.contentType?.startsWith("image/");
    const msg: Message = await db.message.create({
      data: {
        type: isImage ? "IMAGE" : "FILE",
        url: blob.url,
        fileName: filename,
        fileSize: filesize,
      },
    });
    return NextResponse.json({ msg, key });
  } catch (error) {
    return NextResponse.json(
      {
        error,
      },
      { status: 500 },
    );
  }
}
