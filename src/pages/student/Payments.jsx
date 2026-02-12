import { useEffect, useState } from 'react';
import api from '../../api/client';

export default function StudentPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/payments').then(({ data }) => setPayments(data)).catch(() => setPayments([])).finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-12 container mx-auto px-4">
      <h1 className="text-2xl font-heading font-bold text-gray-900 mb-6">Payments</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-xl border border-gray-200">
            <thead>
              <tr className="border-b text-left">
                <th className="p-3">Package</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Status</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p._id} className="border-b last:border-0">
                  <td className="p-3">{p.package?.name}</td>
                  <td className="p-3">₨{p.amount}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-sm ${
                      p.status === 'approved' ? 'bg-green-100 text-green-800' :
                      p.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="p-3 text-sm text-gray-500">{new Date(p.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {payments.length === 0 && <p className="text-gray-500 mt-4">No payments yet.</p>}
        </div>
      )}
    </section>
  );
}
