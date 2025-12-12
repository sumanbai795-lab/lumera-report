// src/PatientReport.tsx
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
  Card,
  CardContent,
} from "@mui/material";

const API_URL =
  "https://sites-quotes-modify-layers.trycloudflare.com";

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
    setLoading(true);
    axios
      .get(`${API_URL}/patient-history/report/${reportId}`)
      .then((res) => {
        if (res.data.success) {
          setReport(res.data.data);
        } else {
          setReport(null);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("API Error:", err);
        setReport(null);
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

  // Extract scores safely
  const zr = report.zylaResult || {};
  const s = zr.score_info || {};

  // 11 Skin Parameters
  const skinParameters = [
    { label: "Acne", value: s.acne_score ?? "N/A" },
    { label: "Pores", value: s.pores_score ?? "N/A" },
    { label: "Wrinkles", value: s.wrinkle_score ?? "N/A" },
    { label: "Red Spots", value: s.red_spot_score ?? "N/A" },
    { label: "Texture / Roughness", value: s.rough_score ?? "N/A" },
    { label: "Dryness / Water", value: s.water_score ?? "N/A" },
    { label: "Oiliness", value: s.oily_intensity_score ?? "N/A" },
    { label: "Sensitivity", value: s.sensitivity_score ?? "N/A" },
    { label: "Pigmentation (Melanin)", value: s.melanin_score ?? "N/A" },
    { label: "Dark Circles", value: s.dark_circle_score ?? "N/A" },
    { label: "Blackheads", value: s.blackhead_score ?? "N/A" },
  ];

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

        {/* ------------------------------- */}
        {/*       ZYLA SCORES SECTION       */}
        {/* ------------------------------- */}

        <Typography sx={{ mt: 3 }} fontWeight="bold" fontSize={20}>
          Zyla AI Skin Scores (11 Parameters)
        </Typography>

        {/* ⭐ GRID FIX – Pure CSS Grid, NO ERRORS ⭐ */}
        <Box
          display="grid"
          gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr" }}
          gap={2}
          mt={2}
        >
          {skinParameters.map((p, i) => (
            <Card
              key={i}
              elevation={3}
              sx={{
                p: 2,
                borderRadius: 3,
                background: "#f7f7f7",
              }}
            >
              <CardContent>
                <Typography fontWeight="bold" sx={{ mb: 1 }}>
                  {p.label}
                </Typography>

                <Chip
                  label={p.value}
                  color={
                    p.value === "N/A"
                      ? "default"
                      : Number(p.value) > 50
                      ? "error"
                      : "success"
                  }
                />
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Products */}
        <Typography sx={{ mt: 4 }} fontWeight="bold">
          Recommended Products:
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
