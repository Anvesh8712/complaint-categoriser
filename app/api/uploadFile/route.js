import { NextResponse } from "next/server";
import fs from "fs";
import { pipeline } from "stream";
import { promisify } from "util";
const pump = promisify(pipeline);

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file"); // Ensure you access the correct key 'file'

    if (!file) {
      throw new Error("File not found in the form data.");
    }

    const filePath = `./public/file/${file.name}`;

    await pump(file.stream(), fs.createWriteStream(filePath));

    return NextResponse.json({ status: "success", data: file.size });
  } catch (error) {
    console.error("File upload error:", error);
    return NextResponse.json({ status: "fail", data: error.message });
  }
}