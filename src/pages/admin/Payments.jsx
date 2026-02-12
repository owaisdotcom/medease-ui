import { useEffect, useState } from 'react';
import api from '../../api/client';

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/payments').then(({ data }) => setPayments(data)).catch(() => setPayments([])).finally(() => setLoading(false));
  }, []);

  const handleVerify = async (id, status, rejectionReason) => {
    try {
      await api.patch(`/payments/${id}/verify`, { status, rejectionReason: rejectionReason || '' });
      setPayments((prev) => prev.map((p) => (p._id === id ? { ...p, status } : p)));
    } catch (_) {}
  };

  const pending = payments.filter((p) => p.status === 'pending');
  const rest = payments.filter((p) => p.status !== 'pending');

  return (
    <div>
      <h1 className="text-2xl font-heading font-bold text-gray-900 mb-6">Payments</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-6">
          {[...pending, ...rest].map((p) => (
            <div key={p._id} className="bg-white rounded-xl border border-gray-200 p-4 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="font-medium">{p.user?.name} – {p.user?.email}</p>
                <p className="text-sm text-gray-500">{p.package?.name} – ₨{p.amount}</p>
                <p className="text-sm">Status: <span className={p.status === 'approved' ? 'text-green-600' : p.status === 'rejected' ? 'text-red-600' : 'text-yellow-600'}>{p.status}</span></p>
                {p.receiptUrl && (
                  <a href={p.receiptUrl} target="_blank" rel="noopener noreferrer" className="text-primary text-sm">View receipt</a>
                )}
              </div>
              {p.status === 'pending' && (
                <div className="flex gap-2">
                  <button onClick={() => handleVerify(p._id, 'approved')} className="bg-green-600 text-white px-3 py-1 rounded text-sm">Approve</button>
                  <button onClick={() => handleVerify(p._id, 'rejected')} className="bg-red-600 text-white px-3 py-1 rounded text-sm">Reject</button>
                </div>
              )}
            </div>
          ))}
          {payments.length === 0 && <p className="text-gray-500">No payments.</p>}
        </div>
      )}
    </div>
  );
}
