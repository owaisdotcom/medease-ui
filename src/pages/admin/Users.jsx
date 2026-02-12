import { useEffect, useState } from 'react';
import api from '../../api/client';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/users', { params: { page, limit: 20 } })
      .then(({ data }) => {
        setUsers(data.users);
        setTotal(data.total);
      })
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }, [page]);

  const handleVerify = async (id) => {
    try {
      await api.patch(`/users/${id}/verify`);
      setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, isVerified: true } : u)));
    } catch (_) {}
  };

  return (
    <div>
      <h1 className="text-2xl font-heading font-bold text-gray-900 mb-6">Users</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl border border-gray-200">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left">
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Verified</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b last:border-0">
                  <td className="p-3">{u.name}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">{u.isVerified ? 'Yes' : 'No'}</td>
                  <td className="p-3">
                    {!u.isVerified && (
                      <button onClick={() => handleVerify(u._id)} className="text-primary font-medium text-sm">
                        Verify
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {total > 20 && (
            <div className="p-3 flex gap-2">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} className="px-3 py-1 border rounded disabled:opacity-50">Prev</button>
              <span className="py-1">Page {page}</span>
              <button onClick={() => setPage((p) => p + 1)} disabled={page * 20 >= total} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
