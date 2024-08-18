import knex from "../../db-config";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { complaint } = req.body;

      const prompt = `Categorize the following complaint:\n\n"${complaint.complaint_what_happened}"\n\nCategory:`;
      const response = await openai.completions.create({
        model: "text-davinci-003",
        prompt: prompt,
        max_tokens: 50,
        n: 1,
        stop: null,
        temperature: 0.5,
      });

      const category = response.choices[0].text.trim();

      const [categoryId] = await knex("categories")
        .select("id")
        .where({ product: category });

      let categoryIdToUse = categoryId;

      if (!categoryId) {
        [categoryIdToUse] = await knex("categories")
          .insert({
            product: category,
            sub_product: complaint.sub_product,
          })
          .returning("id");
      }

      await knex("complaints").insert({
        complaint_id: complaint.complaint_id,
        complaint_text: complaint.complaint_what_happened,
        category_id: categoryIdToUse,
        company: complaint.company,
        state: complaint.state,
        zip_code: complaint.zip_code,
        timely: complaint.timely,
        consumer_consent_provided: complaint.consumer_consent_provided,
        company_response: complaint.company_response,
        submitted_via: complaint.submitted_via,
        company_public_response: complaint.company_public_response,
        date_received: complaint.date_received,
        date_sent_to_company: complaint.date_sent_to_company,
      });

      res
        .status(200)
        .json({ message: "Complaint categorized and inserted successfully" });
    } catch (error) {
      console.error("Error categorizing and inserting complaint:", error);
      res
        .status(500)
        .json({ error: "Error categorizing and inserting complaint" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
