import React from "react";
import ComplaintForm from "./components/ComplaintForm";

export default function Home() {
  return (
    <div className="background">
      <header>
        <h1>AI-Powered Complaint Categorization System</h1>
        <p>Enhancing consumer complaint management with advanced AI and RAG pipeline.</p>
      </header>
      <main>
        <div className="card">
          <h2>Instructions</h2>
          <p>Write down the complaint, and we'll categorize it for you.</p>
        </div>
        <ComplaintForm />
      </main>
      <footer>
        <p>&copy; 2024 Ruby Card AI Intern Project</p>
      </footer>
    </div>
  );
}
