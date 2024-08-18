import { NextResponse } from "next/server";
import fs from "fs";
import { pipeline } from "stream";
import { promisify } from "util";
import path from "path";
import { transcribeImage } from "/app/inputconvert/imagetotext";  
import { transcribeAudio } from "/app/inputconvert/voicetotext";  // Import the audio transcription function

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

    let transcriptionResult;

    if (file.type.startsWith("image/")) {
      transcriptionResult = await transcribeImage(filePath); // Transcribe image
    } else if (file.type === "audio/mpeg") {
      transcriptionResult = await transcribeAudio(filePath); // Transcribe audio
    } else {
      throw new Error("Unsupported file type.");
    }

    return NextResponse.json({ status: "success", data: transcriptionResult });
  } catch (error) {
    console.error("File upload error:", error);
    return NextResponse.json({ status: "fail", data: error.message });
  }
}