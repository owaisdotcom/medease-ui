import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import { Lock } from 'lucide-react';

export default function ProffPage() {
  const { user } = useAuth();
  const [proffStructures, setProffStructures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/content/proff').then(({ data }) => setProffStructures(data)).catch(() => setProffStructures([])).finally(() => setLoading(false));
  }, []);

  const hasAccess = !!user?.packages?.length;

  return (
    <section className="py-12 sm:py-16 container mx-auto px-4">
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-heading font-bold text-gray-900">Proff Preparation</h1>
        <p className="text-gray-600 font-body mt-2">
          JSMU and other university formats. Purchase Master Proff package for access.
        </p>
      </div>
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <div className="max-w-2xl mx-auto space-y-6">
          {proffStructures.length === 0 ? (
            <p className="text-center text-gray-500">Proff structure not configured yet.</p>
          ) : (
            proffStructures.map((ps) => (
              <div key={ps._id} className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-xl font-heading font-bold text-gray-900 uppercase">
                  {ps.university === 'jsmu' ? 'JSMU' : 'Other Universities'}
                </h2>
                <ul className="mt-4 space-y-2">
                  {(ps.papers || []).sort((a, b) => (a.order || 0) - (b.order || 0)).map((p, i) => (
                    <li key={i} className="flex items-center gap-2 text-gray-700">
                      <span className="font-medium">{p.name}</span>
                      <span className="text-sm text-gray-500">({p.type})</span>
                    </li>
                  ))}
                </ul>
                {!hasAccess && (
                  <p className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                    <Lock className="w-4 h-4" /> Register and purchase a package to access.
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </section>
  );
}
