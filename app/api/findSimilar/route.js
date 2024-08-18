import { Pinecone } from "@pinecone-database/pinecone";

// Function to generate an embedding using Hugging Face
async function generateEmbedding(complaintText) {
  const apiUrl =
    "https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2";
  const hfToken = process.env.HUGGING_FACE_KEY; // Use the Hugging Face API key stored in .env.local

  const headers = {
    Authorization: `Bearer ${hfToken}`,
    "Content-Type": "application/json",
  };

  const body = JSON.stringify({
    inputs: complaintText,
    options: {
      wait_for_model: true,
    },
  });

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: headers,
    body: body,
  });

  if (!response.ok) {
    throw new Error(`Error generating embedding: ${response.statusText}`);
  }

  const result = await response.json();
  console.log("Full API Response:", result); // Log the full response

  return result; // Return the full response for inspection
}

export async function POST(req) {
  try {
    const { complaintText } = await req.json();

    if (!complaintText) {
      return new Response(
        JSON.stringify({ error: "Complaint text is required" }),
        { status: 400 }
      );
    }

    // Step 1: Generate the embedding for the new complaint
    const embedding = await generateEmbedding(complaintText);
    console.log("Generated Embedding:", embedding);

    // Step 2: Initialize Pinecone
    const pc = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY, // Pinecone API key from environment variables
    });

    const index = pc.index("complaint-categoriser"); // Replace with your actual index name

    // Step 3: Query Pinecone for the most similar embeddings
    const queryResponse = await index.query({
      vector: embedding, // The embedding to search for similar vectors
      topK: 5, // Number of similar results to return
      includeMetadata: true, // Include metadata in the results
    });

    // Step 4: Return the results
    return new Response(JSON.stringify(queryResponse), { status: 200 });
  } catch (error) {
    console.error("Failed to find similar complaints:", error);
    return new Response(
      JSON.stringify({ error: "Failed to find similar complaints" }),
      { status: 500 }
    );
  }
}
