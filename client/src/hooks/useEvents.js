import { useState, useEffect } from 'react';
import { getEvents } from '../api/contentApi.js';

const useEvents = (params = {}) => {
  const [data, setData] = useState({ events: [], total: 0, page: 1, pages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEvents = (overrideParams) => {
    setLoading(true);
    getEvents(overrideParams || params)
      .then((res) => setData(res.data))
      .catch((err) => setError(err.response?.data?.error?.message || 'Failed to load events'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchEvents(); }, [JSON.stringify(params)]);

  return { ...data, loading, error, refetch: fetchEvents };
};

export default useEvents;
