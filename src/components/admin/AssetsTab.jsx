import { useState, useRef } from 'react';
import {
  Box, Typography, TextField, Button, Alert,
  Divider, CircularProgress, Paper,
} from '@mui/material';
import UploadIcon from '@mui/icons-material/UploadFileOutlined';
import { useSelector } from 'react-redux';
import api from '../../api/globalApi.js';

const PAGE_KEYS = ['sql', 'nosql', 'vectordb'];

function UploadField({ label, accept = 'image/*', onUpload, loading }) {
  const inputRef = useRef(null);
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Typography variant="body2" sx={{ minWidth: 200 }}>{label}</Typography>
      <Button
        variant="outlined"
        size="small"
        startIcon={loading ? <CircularProgress size={14} /> : <UploadIcon />}
        disabled={loading}
        onClick={() => inputRef.current?.click()}
      >
        Upload
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        hidden
        onChange={(e) => {
          if (e.target.files?.[0]) onUpload(e.target.files[0]);
          e.target.value = '';
        }}
      />
    </Box>
  );
}

export default function AssetsTab() {
  const [datasetId,    setDatasetId]    = useState('');
  const [pageKey,      setPageKey]      = useState('sql');
  const [statusMap,    setStatusMap]    = useState({}); // key → { loading, message, error }
  const [loadingMap,   setLoadingMap]   = useState({});

  const setStatus = (key, message, error = false) => {
    setStatusMap((prev) => ({ ...prev, [key]: { message, error } }));
  };
  const setLoading = (key, value) => {
    setLoadingMap((prev) => ({ ...prev, [key]: value }));
  };

  const uploadMultipart = async (url, file, key) => {
    setLoading(key, true);
    setStatus(key, null);
    const form = new FormData();
    form.append('file', file);
    try {
      const res = await api.post(url, form, { headers: { 'Content-Type': 'multipart/form-data' } });
      if (res.status === 200) setStatus(key, 'Uploaded successfully');
      else setStatus(key, res.data?.message || 'Upload failed', true);
    } catch (e) {
      setStatus(key, e.response?.data?.message || 'Upload failed', true);
    } finally {
      setLoading(key, false);
    }
  };

  // Any ADMIN+ can upload assets for all modules — scope only governs permission grants to users
  const allowedPageKeys = PAGE_KEYS;

  return (
    <Box>
      {/* Dataset assets */}
      <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
        <Typography variant="subtitle1" fontWeight="600" mb={2}>Dataset Assets</Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>
          Provide the MongoDB dataset ID to upload its cover image or ER diagram.
        </Typography>

        <TextField
          label="Dataset ID"
          size="small"
          value={datasetId}
          onChange={(e) => setDatasetId(e.target.value)}
          sx={{ mb: 2, width: 280 }}
        />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <UploadField
            label="Cover image"
            loading={!!loadingMap['cover']}
            onUpload={(file) => uploadMultipart(`/admin/dataset/${datasetId}/cover`, file, 'cover')}
          />
          {statusMap['cover'] && (
            <Alert severity={statusMap['cover'].error ? 'error' : 'success'} sx={{ py: 0 }}>
              {statusMap['cover'].message}
            </Alert>
          )}

          <UploadField
            label="ER diagram"
            loading={!!loadingMap['er']}
            onUpload={(file) => uploadMultipart(`/admin/dataset/${datasetId}/er`, file, 'er')}
          />
          {statusMap['er'] && (
            <Alert severity={statusMap['er'].error ? 'error' : 'success'} sx={{ py: 0 }}>
              {statusMap['er'].message}
            </Alert>
          )}
        </Box>
      </Paper>

      {/* Page heroes */}
      <Paper variant="outlined" sx={{ p: 3 }}>
        <Typography variant="subtitle1" fontWeight="600" mb={2}>Page Hero Images</Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>
          Upload the hero image shown at the top of each module page.
        </Typography>

        {allowedPageKeys.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No module pages are within your admin scope.
          </Typography>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {allowedPageKeys.map((pk) => (
              <Box key={pk}>
                <UploadField
                  label={`${pk.toUpperCase()} page hero`}
                  loading={!!loadingMap[`hero-${pk}`]}
                  onUpload={(file) => uploadMultipart(`/admin/page/${pk}/hero`, file, `hero-${pk}`)}
                />
                {statusMap[`hero-${pk}`] && (
                  <Alert
                    severity={statusMap[`hero-${pk}`].error ? 'error' : 'success'}
                    sx={{ py: 0, mt: 0.5 }}
                  >
                    {statusMap[`hero-${pk}`].message}
                  </Alert>
                )}
              </Box>
            ))}
          </Box>
        )}
      </Paper>
    </Box>
  );
}
