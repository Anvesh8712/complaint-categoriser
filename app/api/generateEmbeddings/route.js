import fs from "fs";
import path from "path";

export async function POST(req) {
  try {
    // Correct path to the dataset file (from the root of the project)
    const datasetPath = path.join(
      process.cwd(),
      "app/ruby_hackathon_data.json"
    );

    // Load the dataset
    const dataset = JSON.parse(fs.readFileSync(datasetPath, "utf8"));

    // Extract the relevant fields (complaint_id and complaint_what_happened)
    const data = dataset.map((item) => ({
      complaint_id: item._source.complaint_id,
      text: item._source.complaint_what_happened,
    }));

    // Set batch size
    const batchSize = 100;

    // Generate embeddings in batches
    const result = await generateEmbeddingsInBatches(data, batchSize);

    // Save the result (complaint_id and embeddings) to a file in the 'app/' directory
    const embeddingsPath = path.join(
      process.cwd(),
      "app/embeddings_with_ids.json"
    );
    fs.writeFileSync(embeddingsPath, JSON.stringify(result, null, 2));

    // Return a success message
    return new Response(
      JSON.stringify({
        message: "Embeddings generated and saved successfully",
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to generate embeddings:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate embeddings" }),
      { status: 500 }
    );
  }
}

async function generateEmbeddingsInBatches(data, batchSize) {
  const apiUrl =
    "https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2";
  const hfToken = process.env.HUGGING_FACE_KEY; // Access the API key from environment variables

  const headers = {
    Authorization: `Bearer ${hfToken}`,
    "Content-Type": "application/json",
  };

  let allResults = [];

  // Process each batch
  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize);

    const body = JSON.stringify({
      inputs: batch.map((item) => item.text), // Only send the texts for embedding
      options: {
        wait_for_model: true,
      },
    });

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: headers,
        body: body,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const batchEmbeddings = await response.json();

      // Map the embeddings back to their corresponding complaint IDs
      const batchResults = batch.map((item, index) => ({
        complaint_id: item.complaint_id,
        embedding: batchEmbeddings[index],
      }));

      allResults = allResults.concat(batchResults);
      console.log(
        `Processed batch ${i / batchSize + 1} of ${Math.ceil(
          data.length / batchSize
        )}`
      );
    } catch (error) {
      console.error(
        `Failed to generate embeddings for batch starting at index ${i}:`,
        error
      );
      throw error;
    }
  }

  return allResults;
}
