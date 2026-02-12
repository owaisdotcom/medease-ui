import { useEffect, useState } from 'react';
import api from '../../api/client';

export default function AdminProff() {
  const [structures, setStructures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/proff').then(({ data }) => setStructures(data)).catch(() => setStructures([])).finally(() => setLoading(false));
  }, []);

  const jsmu = structures.find((s) => s.university === 'jsmu');
  const other = structures.find((s) => s.university === 'other');

  const saveJsmu = async () => {
    const papers = [
      { name: 'Paper 1', type: 'mcq', order: 1 },
      { name: 'Paper 2', type: 'mcq', order: 2 },
      { name: 'OSPE 3', type: 'ospe', order: 3 },
      { name: 'OSPE 4', type: 'ospe', order: 4 },
    ];
    await api.put('/admin/proff', { university: 'jsmu', papers });
    const { data } = await api.get('/admin/proff');
    setStructures(data);
  };

  const saveOther = async () => {
    const papers = [
      { name: 'MCQs', type: 'mcq', order: 1 },
      { name: 'OSPEs', type: 'ospe', order: 2 },
    ];
    await api.put('/admin/proff', { university: 'other', papers });
    const { data } = await api.get('/admin/proff');
    setStructures(data);
  };

  return (
    <div>
      <h1 className="text-2xl font-heading font-bold text-gray-900 mb-6">Proff structure</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-6 max-w-md">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="font-semibold mb-2">JSMU</h3>
            <p className="text-sm text-gray-500 mb-2">Paper 1, Paper 2, OSPE 3, OSPE 4</p>
            <button onClick={saveJsmu} className="bg-primary text-white px-3 py-1 rounded text-sm">Save JSMU</button>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="font-semibold mb-2">Other universities</h3>
            <p className="text-sm text-gray-500 mb-2">MCQs, OSPEs</p>
            <button onClick={saveOther} className="bg-primary text-white px-3 py-1 rounded text-sm">Save Other</button>
          </div>
        </div>
      )}
    </div>
  );
}
