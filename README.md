# AI-Powered Complaint Categorization System
This project is an AI-driven system designed to categorize complaints received by a credit card company. By leveraging advanced embedding techniques, it efficiently matches complaints to relevant categories based on both image and text inputs.

## Features
Image and Text Complaint Categorization: Upload an image or text related to a credit card complaint, and the system will provide a response based on embedding similarity.
Integration with Leading AI Services: Utilizes OpenAI for natural language processing, Hugging Face for embeddings, and Pinecone for vector search and retrieval.

## Getting Started
Prerequisites
Before starting, ensure you have the following API keys ready:

OPENAI_API_KEY

HUGGING_FACE_KEY

PINECONE_API_KEY

PINECONE_ENVIRONMENT

NEXT_PUBLIC_SUPABASE_URL

NEXT_PUBLIC_SUPABASE_ANON_KEY

## Installation
Clone the repository:
git clone <repository_url>
cd <repository_name>

Install dependencies:
npm install

Run the development server:
npm run dev

## Usage
Set up environment variables: Ensure all required API keys are stored in a .env.local file.

Upload Complaints: Use the interface to upload an image or text related to a credit card complaint.

Receive Categorization: The system will return a categorized response based on embedding similarity.

## Tech Stack
Frontend: Next.js, React.js

Backend: Node.js, Supabase

AI & Embeddings: OpenAI, Hugging Face

Vector Search: Pinecone

Deployment: Vercel
