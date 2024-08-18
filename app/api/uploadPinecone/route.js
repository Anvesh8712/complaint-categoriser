import fs from "fs";
import path from "path";
import { Pinecone } from "@pinecone-database/pinecone";

export async function POST(req) {
  try {
    // Initialize Pinecone
    const pc = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY, // Pinecone API key from environment variables
    });

    const index = pc.index("complaint-categoriser"); // Replace 'complaint-categoriser' with the actual index name

    // Load the JSON file containing embeddings and complaint IDs
    const embeddingsPath = path.join(
      process.cwd(),
      "app/embeddings_with_ids.json"
    );
    const data = JSON.parse(fs.readFileSync(embeddingsPath, "utf8"));

    // Define the batch size
    const batchSize = 100;

    // Process the data in batches
    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize);

      // Prepare the vectors for upserting
      const vectors = batch.map((item) => ({
        id: item.complaint_id,
        values: item.embedding,
      }));

      // Upsert the batch of vectors to Pinecone
      await index.upsert(vectors);

      console.log(
        `Uploaded batch ${Math.ceil(i / batchSize) + 1} of ${Math.ceil(
          data.length / batchSize
        )}`
      );
    }

    // Return a success message
    return new Response(
      JSON.stringify({
        message: "All embeddings uploaded to Pinecone successfully",
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to upload embeddings to Pinecone:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to upload embeddings to Pinecone",
      }),
      { status: 500 }
    );
  }
}
