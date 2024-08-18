// pages/api/categorize.js
import OpenAI from "openai";
import Pinecone from "@pinecone-database/pinecone";
import { OpenAIEmbeddings } from "@langchain/openai";
import { loadQAStuffChain } from "langchain/chains";
import { Document } from "langchain/document";
import { NextApiRequest, NextApiResponse } from "next";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const schedule = [
        "3/3/2024 6:00 AM - Wake Up",
        "3/3/2024 7:00 AM - Eat Breakfast",
        "3/3/2024 8:00 AM - Surrender to Canada",
        "3/3/2024 12:00 PM - Eat Lunch",
        "3/3/2024 5:00 PM - Go Home",
        "3/3/2024 6:00 PM - Eat Dinner",
        "3/3/2024 7:00 PM - Go to Sleep",
        "3/3/2024 8:00 PM - Dream",
      ];

      const embeddings = new OpenAIEmbeddings({
        openAIApiKey: process.env.OPENAI_API_KEY,
        batchSize: 100,
        model: "text-embedding-3-small",
      });

      const indexName = "aicustomersupport";
      const index = pc.index(indexName);
      const scheduleEmbeddings = await embeddings.embedDocuments(schedule);

      const scheduleVectors = scheduleEmbeddings.map((embedding, i) => ({
        id: schedule[i],
        values: embedding,
        metadata: { text: schedule[i] },
      }));

      await index.upsert(scheduleVectors);

      const query =
        "when do I plan to prostrate myself for our northern neighbor?";
      const queryEmbedding = await embeddings.embedQuery(query);

      const queryResponse = await index.query({
        vector: queryEmbedding,
        topK: 3,
        includeMetadata: true,
      });

      const concatenatedText = queryResponse.matches
        .map((match) => match.metadata.text)
        .join(" ");

      const llm = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
      const chain = loadQAStuffChain(llm);

      const result = await chain.call({
        input_documents: [new Document({ pageContent: concatenatedText })],
        question: query,
      });

      res.status(200).json({ answer: result.text });
    } catch (error) {
      console.error("Error categorizing complaint:", error);
      res.status(500).json({ error: "Error categorizing complaint" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
