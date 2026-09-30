import { useEffect, useState } from "react";

type UseFetchListResult<T> = {
  data: T[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
};

export const useFetchList = <T>(
  fetchFn: () => Promise<T[]>
): UseFetchListResult<T> => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchFn();
      setData(result);
    } catch (err) {
      console.error(err);
      setError("Não foi possível carregar os dados.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, error, refetch: fetchData };
};