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
  const jsmu = proffStructures.find((ps) => ps.university === 'jsmu');
  const other = proffStructures.find((ps) => ps.university === 'other');
  const otherYears = other?.years || [];

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
            <>
              {/* JSMU */}
              {jsmu && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="text-xl font-heading font-bold text-gray-900 uppercase">JSMU</h2>
                  <p className="text-sm text-gray-500 mt-0.5">Year-wise</p>
                  {(jsmu.years && jsmu.years.length > 0) ? (
                    <div className="mt-4 space-y-4">
                      {jsmu.years.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).map((yr, yi) => (
                        <div key={yi} className="border border-gray-100 rounded-lg p-4">
                          <h3 className="font-semibold text-gray-900">{yr.name || `Year ${yi + 1}`}</h3>
                          <ul className="mt-2 space-y-1">
                            {(yr.papers || []).sort((a, b) => (a.order || 0) - (b.order || 0)).map((p, i) => (
                              <li key={i} className="flex items-center gap-2 text-gray-700 text-sm">
                                <span className="font-medium">{p.name}</span>
                                <span className="text-gray-500">({p.type === 'ospe' ? 'OSPE' : 'Mix MCQs'})</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <ul className="mt-4 space-y-2">
                      {(jsmu.papers || []).sort((a, b) => (a.order || 0) - (b.order || 0)).map((p, i) => (
                        <li key={i} className="flex items-center gap-2 text-gray-700">
                          <span className="font-medium">{p.name}</span>
                          <span className="text-sm text-gray-500">({p.type === 'ospe' ? 'OSPE' : 'Mix MCQs'})</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {!hasAccess && (
                    <p className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                      <Lock className="w-4 h-4" /> Register and purchase a package to access.
                    </p>
                  )}
                </div>
              )}

              {/* Other University */}
              {other && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="text-xl font-heading font-bold text-gray-900 uppercase">Other University</h2>
                  {otherYears.length === 0 ? (
                    <p className="mt-4 text-sm text-gray-500">Not configured yet.</p>
                  ) : (
                    <div className="mt-4 space-y-4">
                      {otherYears.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).map((yr, yi) => (
                        <div key={yi} className="border border-gray-100 rounded-lg p-4">
                          <h3 className="font-semibold text-gray-900">{yr.name || `Year ${yi + 1}`}</h3>
                          <ul className="mt-3 space-y-2 pl-4">
                            {(yr.subjects || []).sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).map((sub, si) => (
                              <li key={si} className="text-gray-700">
                                <span className="font-medium">{sub.name || `Subject ${si + 1}`}</span>
                                <ul className="mt-1 ml-2 text-sm text-gray-500 space-y-0.5">
                                  <li>Subject-wise Mix MCQs</li>
                                  <li>Subject-wise OSPE</li>
                                </ul>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                  {!hasAccess && (
                    <p className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                      <Lock className="w-4 h-4" /> Register and purchase a package to access.
                    </p>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </section>
  );
}
