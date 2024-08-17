"use client";

import React, { useState } from "react";
import { TextField, Button, Typography, Container, Box } from "@mui/material";

export default function ComplaintForm() {
  const [complaint, setComplaint] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResponseMessage("");

    try {
      const response = await fetch("/api/categorize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ complaint }),
      });

      if (!response.ok) {
        throw new Error("Failed to process complaint");
      }

      const data = await response.json();
      setResponseMessage(data.responseMessage);
    } catch (err) {
      console.error(err);
      setError("Error processing complaint.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          marginTop: 5,
        }}
      >
        <Typography variant="h4" align="center">
          Complaint Categorization
        </Typography>
        <TextField
          label="Enter your complaint"
          variant="outlined"
          multiline
          rows={4}
          value={complaint}
          onChange={(e) => setComplaint(e.target.value)}
          required
        />
        <Button variant="contained" color="primary" type="submit">
          Categorize
        </Button>
        {error && (
          <Typography variant="body1" color="error">
            {error}
          </Typography>
        )}
        {responseMessage && (
          <Typography variant="body1">
            <strong>Response:</strong> {responseMessage}
          </Typography>
        )}
      </Box>
    </Container>
  );
}
