// "use client";

// import React, { useState } from "react";
// import { TextField, Button, Typography, Container, Box } from "@mui/material";

// export default function ComplaintForm() {
//   const [complaint, setComplaint] = useState("");
//   const [responseMessage, setResponseMessage] = useState("");
//   const [error, setError] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setResponseMessage("");

//     try {
//       const response = await fetch("/api/categorize", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ complaint }),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to process complaint");
//       }

//       const data = await response.json();
//       setResponseMessage(data.responseMessage);
//     } catch (err) {
//       console.error(err);
//       setError("Error processing complaint.");
//     }
//   };

//   return (
//     <Container maxWidth="sm">
//       <Box
//         component="form"
//         onSubmit={handleSubmit}
//         sx={{
//           display: "flex",
//           flexDirection: "column",
//           gap: 2,
//           marginTop: 5,
//         }}
//       >
//         <Typography variant="h4" align="center">
//           Complaint Categorization
//         </Typography>
//         <TextField
//           label="Enter your complaint"
//           variant="outlined"
//           multiline
//           rows={4}
//           value={complaint}
//           onChange={(e) => setComplaint(e.target.value)}
//           required
//         />
//         <Button variant="contained" color="primary" type="submit">
//           Categorize
//         </Button>
//         {error && (
//           <Typography variant="body1" color="error">
//             {error}
//           </Typography>
//         )}
//         {responseMessage && (
//           <Typography variant="body1">
//             <strong>Response:</strong> {responseMessage}
//           </Typography>
//         )}
//       </Box>
//     </Container>
//   );
// }

"use client";

import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Container,
  Box,
  List,
  ListItem,
  ListItemText,
  Grid,
  Paper,
  CircularProgress,
} from "@mui/material";

export default function ComplaintForm() {
  const [complaint, setComplaint] = useState("");
  const [responseMessage, setResponseMessage] = useState({});
  const [similarComplaints, setSimilarComplaints] = useState([]);
  const [error, setError] = useState("");
  const [loadingCategorization, setLoadingCategorization] = useState(false);
  const [loadingSimilarComplaints, setLoadingSimilarComplaints] =
    useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResponseMessage({});
    setSimilarComplaints([]);
    setLoadingCategorization(true);
    setLoadingSimilarComplaints(false);

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
      setResponseMessage(data);
      setLoadingCategorization(false);

      // Fetch similar complaints based on the categorized complaint
      setLoadingSimilarComplaints(true);
      const similarResponse = await fetch("/api/findSimilar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ complaintText: complaint }),
      });

      if (!similarResponse.ok) {
        throw new Error("Failed to fetch similar complaints");
      }

      const similarData = await similarResponse.json();
      setSimilarComplaints(similarData);
      setLoadingSimilarComplaints(false);
    } catch (err) {
      console.error(err);
      setError("Error processing complaint.");
      setLoadingCategorization(false);
      setLoadingSimilarComplaints(false);
    }
  };

  return (
    <Container maxWidth="lg">
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
      </Box>

      {!loadingCategorization && !responseMessage.product && (
        <Typography variant="body1" align="center" sx={{ marginTop: 4 }}>
          Enter a complaint and click Categorize to see the results.
        </Typography>
      )}

      <Grid container spacing={4} sx={{ marginTop: 4 }}>
        {/* Left side: Categorization result */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ padding: 2 }}>
            <Typography variant="h6">Categorization Result</Typography>
            {loadingCategorization ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: 200,
                }}
              >
                <CircularProgress />
              </Box>
            ) : responseMessage.product ? (
              <Box>
                <Typography>
                  <strong>Product:</strong> {responseMessage.product}
                </Typography>
                <Typography>
                  <strong>Sub-product:</strong> {responseMessage.sub_product}
                </Typography>
                <Typography>
                  <strong>Issue:</strong> {responseMessage.issue}
                </Typography>
                <Typography>
                  <strong>Summary:</strong> {responseMessage.summary}
                </Typography>
              </Box>
            ) : (
              <Typography>No categorization results yet.</Typography>
            )}
          </Paper>
        </Grid>

        {/* Right side: Similar complaints */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ padding: 2 }}>
            <Typography variant="h6">Similar Complaints</Typography>
            {loadingSimilarComplaints ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: 200,
                }}
              >
                <CircularProgress />
              </Box>
            ) : similarComplaints.length > 0 ? (
              <List>
                {similarComplaints.map((complaint, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={`Score: ${complaint.score}`}
                      secondary={complaint.complaint_what_happened}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography>No similar complaints found.</Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
