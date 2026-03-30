import { useState, useEffect } from 'react';
import { getPage } from '../api/contentApi.js';

const usePageContent = (slug) => {
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    getPage(slug)
      .then((res) => setPage(res.data))
      .catch((err) => setError(err.response?.data?.error?.message || 'Failed to load page'))
      .finally(() => setLoading(false));
  }, [slug]);

  return { page, loading, error };
};

export default usePageContent;
