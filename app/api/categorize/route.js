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

    // Define the system prompt with Topic, Subtopic, and a brief Summary
    const systemPrompt = `
      You are an AI assistant that categorizes consumer complaints into relevant categories and provides concise summaries. Given a complaint, please follow these steps:

1. Categorize the complaint into a relevant **Product** (e.g., Credit Card, Loan, Mortgage, etc.).
2. Further categorize the complaint into a **Sub-product** (e.g., General-purpose Credit Card, Store Credit Card, etc.).
3. Identify the **Issue** from the following list:
   - Advertising and marketing, including promotional offers
   - Closing your account
   - Credit monitoring or identity theft protection services
   - Fees or interest
   - Getting a credit card
   - Improper use of your report
   - Incorrect information on your report
   - Other features, terms, or problems
   - Problem when making payments
   - Problem with a company's investigation into an existing problem
   - Problem with a purchase shown on your statement
   - Problem with fraud alerts or security freezes
   - Struggling to pay your bill
   - Trouble using your card
   - Unable to get your credit report or credit score
4. Provide a brief and concise summary of the complaint, no longer than one sentence.

Here is the complaint:

"${complaint}"

Please respond with the following format:
- Product: [Category of the complaint]
- Sub-product: [Subcategory of the complaint]
- Issue: [Issue from the list]
- Summary: [Brief summary of the complaint, no longer than one sentence]

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
