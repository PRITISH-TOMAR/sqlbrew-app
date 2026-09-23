import api from './globalApi';
import toast from 'react-hot-toast';

const STORAGE_BASE = (import.meta.env.VITE_SUPABASE_STORAGE_BASE_URL ?? '').replace(/\/+$/, '');
const BUCKET       = 'brewquery_profile_picture';
const MAX_SIZE     = 2 * 1024 * 1024; // 2 MB

/**
 * Public URL of a user's avatar (works even before uploading — will 404 until set).
 */
export function getAvatarUrl(userId) {
  return `${STORAGE_BASE}/object/public/${BUCKET}/${userId}`;
}

/**
 * Upload a new avatar for `userId` via the backend (which uses the Supabase service role key).
 * Returns the public URL on success, or null on failure.
 */
export async function uploadAvatar(userId, file) {
  if (file.size > MAX_SIZE) {
    toast.error('Image must be smaller than 2 MB');
    return null;
  }

  try {
    const form = new FormData();
    form.append('file', file);

    const res = await api.put(`/user/${userId}/avatar`, form, {
      headers: { 'Content-Type': undefined },
    });

    if (res.status === 200) {
      toast.success('Avatar updated');
      return res.data.data; // public URL returned by the backend
    }

    toast.error(res.data.message || 'Upload failed');
    return null;
  } catch (e) {
    toast.error(e.response?.data?.message || 'Upload failed');
    return null;
  }
}
