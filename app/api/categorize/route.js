import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    const { complaint } = await request.json();

    if (!complaint) {
      return NextResponse.json(
        { error: "Complaint text is required" },
        { status: 400 }
      );
    }

    // Define the system prompt
    const systemPrompt = `
      You are an AI assistant that categorizes consumer complaints into relevant topics and provides concise summaries. Given a complaint, please follow these steps:

      1. Categorize the complaint into a relevant topic (e.g., Billing Issue, Customer Service, Fraud, etc.).
      2. Provide a brief summary of the complaint.

      Here is the complaint:

      "${complaint}"

      Please respond with the following format:
      - Topic: [Category of the complaint]
      - Summary: [Brief summary of the complaint]
    `;

    // Call the OpenAI API to categorize the complaint
    const completion = await openai.chat.completions.create({
      model: "meta-llama/llama-3.1-8b-instruct:free",
      messages: [{ role: "user", content: systemPrompt }],
    });

    const responseMessage = completion.choices[0].message.content;

    return NextResponse.json({ responseMessage });
  } catch (error) {
    console.error("Error categorizing complaint:", error);
    return NextResponse.json(
      { error: "Failed to categorize complaint" },
      { status: 500 }
    );
  }
}
