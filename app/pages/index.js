// pages/index.js
import React, { useEffect, useState } from "react";
import ComplaintForm from "./components/ComplaintForm";

export default function Home() {
    const [answer, setAnswer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch('/api/schedule', {
                    method: 'POST',
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setAnswer(data.answer);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    return (
        <div>
            <ComplaintForm />
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}
            {answer && <div>Answer: {answer}</div>}
        </div>
    );
}
