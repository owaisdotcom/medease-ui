import { createContext, useContext, useState, useEffect } from 'react';
import { setLoaderCallback } from '../api/client';
import Loader from '../components/Loader';

const LoaderContext = createContext(null);

export function LoaderProvider({ children }) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoaderCallback((show) => setLoading(show));
    return () => setLoaderCallback(null);
  }, []);

  return (
    <LoaderContext.Provider value={{ loading, setLoading }}>
      {children}
      {loading && <Loader />}
    </LoaderContext.Provider>
  );
}

export function useLoader() {
  const ctx = useContext(LoaderContext);
  return ctx;
}
