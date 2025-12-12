import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Typography,
  Paper,
  CircularProgress,
  Chip,
  Box,
  Divider,
} from "@mui/material";

const API_URL = "https://condign-acarpelous-marlen.ngrok-free.dev";

interface ReportData {
  id: number;
  scanDate: string;
  dryness: number | null;
  gptCarePlan: string;
  aiRecommendation: string;
  topIssue: string;
  zylaResult: any;
  products: any[];
  patientId: number;
}

export default function PatientReport() {
  const { reportId } = useParams();
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API_URL}/patient-history/report/${reportId}`)
      .then((res) => {
        if (res.data.success) {
          setReport(res.data.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [reportId]);

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );

  if (!report)
    return (
      <Typography textAlign="center" mt={10}>
        Report not found
      </Typography>
    );

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Typography
        variant="h3"
        textAlign="center"
        gutterBottom
        color="primary"
        fontWeight="bold"
      >
        Skin Analysis Report
      </Typography>

      <Paper elevation={6} sx={{ padding: 4, borderRadius: 4 }}>
        {/* Report ID */}
        <Typography variant="h6" fontWeight="bold">
          Report ID: {report.id}
        </Typography>
        <Divider sx={{ my: 2 }} />

        {/* Scan Date */}
        <Typography sx={{ mt: 1 }}>
          <b>Date:</b> {new Date(report.scanDate).toLocaleString()}
        </Typography>

        {/* Patient ID */}
        <Typography sx={{ mt: 1 }}>
          <b>Patient ID:</b> {report.patientId}
        </Typography>

        {/* Dryness */}
        <Typography sx={{ mt: 2 }}>
          <b>Dryness Score:</b>{" "}
          {report.dryness !== null ? (
            <Chip
              label={report.dryness}
              color={report.dryness > 50 ? "error" : "success"}
            />
          ) : (
            "-"
          )}
        </Typography>

        {/* Top Issue */}
        <Typography sx={{ mt: 2 }}>
          <b>Top Issue:</b> {report.topIssue || "—"}
        </Typography>

        {/* AI Recommendation */}
        <Typography sx={{ mt: 2 }}>
          <b>AI Recommendation:</b>
          <br />
          {report.aiRecommendation || "—"}
        </Typography>

        {/* GPT Care Plan */}
        <Typography sx={{ mt: 2 }}>
          <b>GPT Care Plan:</b>
          <br />
          {report.gptCarePlan || "—"}
        </Typography>

        {/* Products */}
        <Typography sx={{ mt: 2 }}>
          <b>Recommended Products:</b>
        </Typography>

        {report.products?.length > 0 ? (
          report.products.map((p, i) => (
            <Typography key={i} sx={{ mt: 1 }}>
              • {p.name || p.title || JSON.stringify(p)}
            </Typography>
          ))
        ) : (
          <Typography color="gray">No products available</Typography>
        )}
      </Paper>
    </Container>
  );
}
