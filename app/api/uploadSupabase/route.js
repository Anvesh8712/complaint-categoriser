import fs from "fs";
import path from "path";
import { supabase } from "../../supabaseClient";

export async function POST(req) {
  try {
    // Load the JSON file containing complaint data
    const complaintsPath = path.join(
      process.cwd(),
      "app/ruby_hackathon_data.json"
    );
    const data = JSON.parse(fs.readFileSync(complaintsPath, "utf8"));

    // Define batch size
    const batchSize = 100;

    // Process the data in batches
    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize);

      // Prepare the data for inserting into Supabase
      const complaints = batch.map((item) => ({
        complaint_id: item._source.complaint_id,
        complaint_what_happened: item._source.complaint_what_happened,
      }));

      // Insert the batch of complaints into Supabase
      const { data: insertedData, error } = await supabase
        .from("complaints")
        .insert(complaints);

      if (error) {
        throw error;
      }

      console.log(
        `Inserted batch ${Math.ceil(i / batchSize) + 1} of ${Math.ceil(
          data.length / batchSize
        )}`
      );
    }

    // Return a success message
    return new Response(
      JSON.stringify({ message: "All complaints inserted successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to insert complaints:", error);
    return new Response(
      JSON.stringify({ error: "Failed to insert complaints" }),
      { status: 500 }
    );
  }
}
