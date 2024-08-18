// import { Pinecone } from "@pinecone-database/pinecone";

// // Function to generate an embedding using Hugging Face
// async function generateEmbedding(complaintText) {
//   const apiUrl =
//     "https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2";
//   const hfToken = process.env.HUGGING_FACE_KEY; // Use the Hugging Face API key stored in .env.local

//   const headers = {
//     Authorization: `Bearer ${hfToken}`,
//     "Content-Type": "application/json",
//   };

//   const body = JSON.stringify({
//     inputs: complaintText,
//     options: {
//       wait_for_model: true,
//     },
//   });

//   const response = await fetch(apiUrl, {
//     method: "POST",
//     headers: headers,
//     body: body,
//   });

//   if (!response.ok) {
//     throw new Error(`Error generating embedding: ${response.statusText}`);
//   }

//   const result = await response.json();
//   console.log("Full API Response:", result); // Log the full response

//   return result; // Return the full response for inspection
// }

// export async function POST(req) {
//   try {
//     const { complaintText } = await req.json();

//     if (!complaintText) {
//       return new Response(
//         JSON.stringify({ error: "Complaint text is required" }),
//         { status: 400 }
//       );
//     }

//     // Step 1: Generate the embedding for the new complaint
//     const embedding = await generateEmbedding(complaintText);
//     console.log("Generated Embedding:", embedding);

//     // Step 2: Initialize Pinecone
//     const pc = new Pinecone({
//       apiKey: process.env.PINECONE_API_KEY, // Pinecone API key from environment variables
//     });

//     const index = pc.index("complaint-categoriser"); // Replace with your actual index name

//     // Step 3: Query Pinecone for the most similar embeddings
//     const queryResponse = await index.query({
//       vector: embedding, // The embedding to search for similar vectors
//       topK: 5, // Number of similar results to return
//       includeMetadata: true, // Include metadata in the results
//     });

//     // Step 4: Return the results
//     return new Response(JSON.stringify(queryResponse), { status: 200 });
//   } catch (error) {
//     console.error("Failed to find similar complaints:", error);
//     return new Response(
//       JSON.stringify({ error: "Failed to find similar complaints" }),
//       { status: 500 }
//     );
//   }
// }

import { Pinecone } from "@pinecone-database/pinecone";
import { supabase } from "../../supabaseClient";

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

    // Step 2: Initialize Pinecone
    const pc = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY, // Pinecone API key from environment variables
    });

    const index = pc.index("complaint-categoriser"); // Replace with your actual index name

    // Step 3: Query Pinecone for the top 3 most similar embeddings
    const queryResponse = await index.query({
      vector: embedding, // The embedding to search for similar vectors
      topK: 3, // Fetch the top 3 results
      includeMetadata: true, // Include metadata in the results
    });

    console.log("Pinecone Query Response:", queryResponse);

    // Step 4: Fetch the corresponding complaints from Supabase
    const results = [];
    for (const match of queryResponse.matches) {
      const complaintId = match.id;
      console.log("Complaint ID from Pinecone:", complaintId);

      // Query Supabase for the corresponding complaint
      const { data, error } = await supabase
        .from("complaints")
        .select("complaint_id, complaint_what_happened")
        .eq("complaint_id", complaintId.toString());

      if (error) {
        console.error(
          `Error querying Supabase for complaint_id: ${complaintId}`,
          error
        );
        throw error;
      }

      // Add the result to the results array
      results.push({
        id: complaintId,
        score: match.score,
        complaint_what_happened:
          data.length > 0
            ? data[0].complaint_what_happened
            : "Complaint not found in database",
      });
    }

    // Step 5: Return the top 3 results
    return new Response(JSON.stringify(results), { status: 200 });
  } catch (error) {
    console.error("Failed to find similar complaints:", error);
    return new Response(
      JSON.stringify({ error: "Failed to find similar complaints" }),
      { status: 500 }
    );
  }
}
