// "use client";

// import React, { useState } from "react";
// import {
//   TextField,
//   Button,
//   Typography,
//   Container,
//   Box,
//   List,
//   ListItem,
//   ListItemText,
//   Grid,
//   Paper,
//   CircularProgress,
// } from "@mui/material";

// export default function ComplaintForm() {
//   const [complaint, setComplaint] = useState("");
//   const [responseMessage, setResponseMessage] = useState({});
//   const [similarComplaints, setSimilarComplaints] = useState([]);
//   const [error, setError] = useState("");
//   const [loadingCategorization, setLoadingCategorization] = useState(false);
//   const [loadingSimilarComplaints, setLoadingSimilarComplaints] =
//     useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setResponseMessage({});
//     setSimilarComplaints([]);
//     setLoadingCategorization(true);
//     setLoadingSimilarComplaints(false);

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
//       setResponseMessage(data);
//       setLoadingCategorization(false);

//       // Fetch similar complaints based on the categorized complaint
//       setLoadingSimilarComplaints(true);
//       const similarResponse = await fetch("/api/findSimilar", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ complaintText: complaint }),
//       });

//       if (!similarResponse.ok) {
//         throw new Error("Failed to fetch similar complaints");
//       }

//       const similarData = await similarResponse.json();
//       setSimilarComplaints(similarData);
//       setLoadingSimilarComplaints(false);
//     } catch (err) {
//       console.error(err);
//       setError("Error processing complaint.");
//       setLoadingCategorization(false);
//       setLoadingSimilarComplaints(false);
//     }
//   };

//   return (
//     <Container maxWidth="lg">
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
//       </Box>

//       {!loadingCategorization && !responseMessage.product && (
//         <Typography variant="body1" align="center" sx={{ marginTop: 4 }}>
//           Enter a complaint and click Categorize to see the results.
//         </Typography>
//       )}

//       <Grid container spacing={4} sx={{ marginTop: 4 }}>
//         {/* Left side: Categorization result */}
//         <Grid item xs={12} md={6}>
//           <Paper sx={{ padding: 2 }}>
//             <Typography variant="h6">Categorization Result</Typography>
//             {loadingCategorization ? (
//               <Box
//                 sx={{
//                   display: "flex",
//                   justifyContent: "center",
//                   alignItems: "center",
//                   height: 200,
//                 }}
//               >
//                 <CircularProgress />
//               </Box>
//             ) : responseMessage.product ? (
//               <Box>
//                 <Typography>
//                   <strong>Product:</strong> {responseMessage.product}
//                 </Typography>
//                 <Typography>
//                   <strong>Sub-product:</strong> {responseMessage.sub_product}
//                 </Typography>
//                 <Typography>
//                   <strong>Issue:</strong> {responseMessage.issue}
//                 </Typography>
//                 <Typography>
//                   <strong>Summary:</strong> {responseMessage.summary}
//                 </Typography>
//               </Box>
//             ) : (
//               <Typography>No categorization results yet.</Typography>
//             )}
//           </Paper>
//         </Grid>

//         {/* Right side: Similar complaints */}
//         <Grid item xs={12} md={6}>
//           <Paper sx={{ padding: 2 }}>
//             <Typography variant="h6">Similar Complaints</Typography>
//             {loadingSimilarComplaints ? (
//               <Box
//                 sx={{
//                   display: "flex",
//                   justifyContent: "center",
//                   alignItems: "center",
//                   height: 200,
//                 }}
//               >
//                 <CircularProgress />
//               </Box>
//             ) : similarComplaints.length > 0 ? (
//               <List>
//                 {similarComplaints.map((complaint, index) => (
//                   <ListItem key={index}>
//                     <ListItemText
//                       primary={`Score: ${complaint.score}`}
//                       secondary={complaint.complaint_what_happened}
//                     />
//                   </ListItem>
//                 ))}
//               </List>
//             ) : (
//               <Typography>No similar complaints found.</Typography>
//             )}
//           </Paper>
//         </Grid>
//       </Grid>
//     </Container>
//   );
// }

// "use client";

// import React, { useState } from "react";
// import {
//   TextField,
//   Button,
//   Typography,
//   Container,
//   Box,
//   IconButton,
//   CircularProgress,
// } from "@mui/material";
// import { CloudUpload, Delete } from "@mui/icons-material";

// export default function ComplaintForm() {
//   const [complaint, setComplaint] = useState("");
//   const [file, setFile] = useState(null);
//   const [previewUrl, setPreviewUrl] = useState(""); // For image preview
//   const [error, setError] = useState("");
//   const [uploading, setUploading] = useState(false);

//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files[0];
//     if (selectedFile) {
//       setFile(selectedFile);

//       // Generate a preview URL for images
//       if (selectedFile.type.startsWith("image/")) {
//         setPreviewUrl(URL.createObjectURL(selectedFile));
//       } else {
//         setPreviewUrl("");
//       }
//     }
//   };

//   const handleFileRemove = () => {
//     setFile(null);
//     setPreviewUrl("");
//   };

//   const handleFileUpload = async () => {
//     if (!file) {
//       setError("Please select a file before uploading.");
//       return;
//     }

//     setUploading(true);
//     setError("");

//     try {
//       const formData = new FormData();
//       formData.append("file", file); // Ensure the key is "file" to match backend

//       const response = await fetch("/api/uploadFile", {
//         method: "POST",
//         body: formData,
//       });

//       if (!response.ok) {
//         throw new Error("Failed to upload file");
//       }

//       const data = await response.json();
//       console.log("File upload response:", data);
//     } catch (err) {
//       console.error("Error uploading file:", err);
//       setError("Error uploading file.");
//     } finally {
//       setUploading(false);
//     }
//   };

//   return (
//     <Container maxWidth="lg">
//       <Box
//         sx={{ display: "flex", flexDirection: "column", gap: 2, marginTop: 5 }}
//       >
//         <Typography variant="h4" align="center">
//           Complaint Categorization
//         </Typography>

//         {/* Complaint Input */}
//         <TextField
//           label="Enter your complaint"
//           variant="outlined"
//           multiline
//           rows={4}
//           value={complaint}
//           onChange={(e) => setComplaint(e.target.value)}
//           disabled={!!file} // Disable input if a file is selected
//         />

//         {/* File Upload Section */}
//         <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//           <Button
//             variant="contained"
//             component="label"
//             startIcon={<CloudUpload />}
//           >
//             Select File
//             <input
//               type="file"
//               hidden
//               accept=".mp3,image/*" // Accept mp3 and image files
//               onChange={handleFileChange}
//             />
//           </Button>
//           {file && (
//             <IconButton onClick={handleFileRemove} color="error">
//               <Delete />
//             </IconButton>
//           )}
//         </Box>

//         {/* File Preview Section */}
//         {previewUrl && (
//           <Box sx={{ marginTop: 2 }}>
//             <img
//               src={previewUrl}
//               alt="Preview"
//               style={{ maxWidth: "100%", maxHeight: 200 }}
//             />
//           </Box>
//         )}

//         {file && !previewUrl && (
//           <Typography variant="body1">{file.name}</Typography>
//         )}

//         {/* Upload Button */}
//         <Button
//           variant="contained"
//           color="primary"
//           onClick={handleFileUpload}
//           disabled={uploading}
//         >
//           {uploading ? <CircularProgress size={24} /> : "Upload File"}
//         </Button>

//         {error && (
//           <Typography variant="body1" color="error">
//             {error}
//           </Typography>
//         )}
//       </Box>

//       {/* Loading Indicators */}
//       {uploading && (
//         <Box sx={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
//           <CircularProgress />
//         </Box>
//       )}
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
  Grid,
  Paper,
  IconButton,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { CloudUpload, Delete } from "@mui/icons-material";

export default function ComplaintForm() {
  const [complaint, setComplaint] = useState("");
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(""); // For image preview
  const [loadingCategorization, setLoadingCategorization] = useState(false);
  const [loadingSimilarComplaints, setLoadingSimilarComplaints] =
    useState(false);
  const [error, setError] = useState("");
  const [responseMessage, setResponseMessage] = useState({});
  const [similarComplaints, setSimilarComplaints] = useState([]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);

      // Generate a preview URL for images
      if (selectedFile.type.startsWith("image/")) {
        setPreviewUrl(URL.createObjectURL(selectedFile));
      } else {
        setPreviewUrl("");
      }
    }
  };

  const handleFileRemove = () => {
    setFile(null);
    setPreviewUrl("");
  };

  const handleFileUpload = async () => {
    if (!file) {
      setError("Please select a file before uploading.");
      return;
    }

    setLoadingCategorization(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file); // Ensure the key is "file"

      const response = await fetch("/api/uploadFile", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }

      const data = await response.json();
      console.log("File upload response:", data);

      // Assuming the server returns the converted text in the 'text' field
      setComplaint(data.text);
      setError("File uploaded and converted successfully!");
    } catch (err) {
      console.error("Error uploading file:", err);
      setError("Error uploading file.");
    } finally {
      setLoadingCategorization(false);
    }
  };

  const handleCategorization = async (e) => {
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
        onSubmit={handleCategorization}
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

        {/* Complaint Input */}
        <TextField
          label="Enter your complaint"
          variant="outlined"
          multiline
          rows={4}
          value={complaint}
          onChange={(e) => setComplaint(e.target.value)}
          disabled={!!file && !complaint} // Disable input if a file is selected and not yet processed
        />

        {/* File Upload and Categorize Section */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button
            variant="contained"
            component="label"
            startIcon={<CloudUpload />}
          >
            Upload File
            <input
              type="file"
              hidden
              accept=".mp3,image/*" // Accept mp3 and image files
              onChange={handleFileChange}
            />
          </Button>
          {file && (
            <IconButton onClick={handleFileRemove} color="error">
              <Delete />
            </IconButton>
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={handleFileUpload}
            disabled={!file || !!complaint} // Disable if no file is selected or text already set
          >
            Upload
          </Button>
          <Button
            variant="contained"
            color="secondary"
            type="submit"
            disabled={!complaint} // Enable categorization only if complaint text is available
          >
            Categorize Complaint
          </Button>
        </Box>

        {/* File Preview Section */}
        {previewUrl && (
          <Box sx={{ marginTop: 2 }}>
            <img
              src={previewUrl}
              alt="Preview"
              style={{ maxWidth: "100%", maxHeight: 200 }}
            />
          </Box>
        )}

        {file && !previewUrl && (
          <Typography variant="body1">{file.name}</Typography>
        )}

        {error && (
          <Typography variant="body1" color="error">
            {error}
          </Typography>
        )}
      </Box>

      {/* Loading Indicators */}
      {loadingCategorization && (
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
          <CircularProgress />
        </Box>
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