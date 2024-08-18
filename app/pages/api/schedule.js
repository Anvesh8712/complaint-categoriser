// pages/api/schedule.js
import { PineconeClient } from '@pinecone-database/pinecone';
import OpenAI from 'openai';
import { OpenAIEmbeddings } from '@langchain/openai';
import { loadQAStuffChain } from 'langchain/chains';
import { Document } from 'langchain/document';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const schedule = ["3/3/2024 6:00 AM - Wake Up", "3/3/2024 7:00 AM - Eat Breakfast", "3/3/2024 8:00 AM - Surrender to Canada", "3/3/2024 12:00 PM - Eat Lunch", "3/3/2024 5:00 PM - Go Home", "3/3/2024 6:00 PM - Eat Dinner", "3/3/2024 7:00 PM - Go to Sleep", "3/3/2024 8:00 PM - Dream"];

            const openai = new OpenAI({
                apiKey: process.env.OPENAI_API_KEY,
                dangerouslyAllowBrowser: true
            });

            const pc = new PineconeClient({
                apiKey: process.env.PINECONE_API_KEY,
            });

            const embeddings = new OpenAIEmbeddings({
                openAIApiKey: process.env.OPENAI_API_KEY,
                batchSize: 100,
                model: 'text-embedding-3-small',
            });

            const indexName = 'aicustomersupport';
            const index = pc.index(indexName);

            const scheduleEmbeddings = await embeddings.embedDocuments(schedule);

            const scheduleVectors = scheduleEmbeddings.map((embedding, i) => ({
                id: schedule[i],
                values: embedding,
                metadata: {
                    text: schedule[i],
                }
            }));

            await index.upsert(scheduleVectors);

            const query = "when do I plan to prostrate myself for our northern neighbor?";
            const queryEmbedding = await new OpenAIEmbeddings().embedQuery(query);

            let queryResponse = await index.query({
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
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
