import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Container, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, CircularProgress, Chip, Box
} from '@mui/material';

interface Scan {
  id: number;
  scanDate: string;
  dryness: number | null;
  gptCarePlan: string;
  aiRecommendation: string;
  topIssue: string;
  photos: string[];
}

export default function PatientReport() {
  const { patientId } = useParams();
  const [scans, setScans] = useState<Scan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`https://condign-acarpelous-marlen.ngrok-free.dev/patient-history/${patientId}`)
      .then(res => {
        if (res.data.success) {
          setScans(res.data.data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [patientId]);

  if (loading) return <Box display="flex" justifyContent="center" mt={10}><CircularProgress /></Box>;

  if (scans.length === 0) return <Typography textAlign="center" mt={10}>No scans found</Typography>;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" textAlign="center" gutterBottom color="#1976d2">
        Patient Report - ID: {patientId}
      </Typography>
      <Typography textAlign="center" color="gray" mb={4}>
        Total Scans: {scans.length}
      </Typography>

      <TableContainer component={Paper} elevation={6}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell><b>Date & Time</b></TableCell>
              <TableCell><b>Dryness Level</b></TableCell>
              <TableCell><b>Top Issue</b></TableCell>
              <TableCell><b>Care Plan</b></TableCell>
              <TableCell><b>AI Recommendation</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {scans.map((scan) => (
              <TableRow key={scan.id} hover>
                <TableCell>{new Date(scan.scanDate).toLocaleString('en-IN')}</TableCell>
                <TableCell>
                  {scan.dryness !== null ? (
                    <Chip label={scan.dryness} color={scan.dryness > 50 ? "error" : "success"} />
                  ) : '-'}
                </TableCell>
                <TableCell><b>{scan.topIssue || '—'}</b></TableCell>
                <TableCell>{(scan.gptCarePlan || scan.aiRecommendation || '').substring(0, 80)}...</TableCell>
                <TableCell>{(scan.aiRecommendation || '').substring(0, 70)}...</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}