import { NextResponse } from "next/server";
import fs from "fs";
import { pipeline } from "stream";
import { promisify } from "util";
import path from "path";
import { transcribeImage } from "/app/inputconvert/imagetotext"; // Import the transcription function

const pump = promisify(pipeline);

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      throw new Error("File not found in the form data.");
    }

    const filePath = `./public/file/${file.name}`;
    await pump(file.stream(), fs.createWriteStream(filePath));

    // Call the transcribeImage function after saving the file
    const transcriptionResult = await transcribeImage(filePath);

    // Return only the transcription text
    return NextResponse.json({ status: "success", text: transcriptionResult });
  } catch (error) {
    console.error("File upload error:", error);
    return NextResponse.json({ status: "fail", data: error.message });
  }
}
