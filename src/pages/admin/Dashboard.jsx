import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/admin/dashboard').then(({ data }) => setStats(data)).catch(() => setStats(null));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-heading font-bold text-gray-900 mb-6">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats && (
          <>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-gray-500 text-sm">Students</p>
              <p className="text-2xl font-bold text-gray-900">{stats.userCount}</p>
              <Link to="/admin/users" className="text-primary text-sm font-medium">View</Link>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-gray-500 text-sm">Pending payments</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingPayments}</p>
              <Link to="/admin/payments" className="text-primary text-sm font-medium">View</Link>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-gray-500 text-sm">Years / Modules / Topics</p>
              <p className="text-xl font-bold text-gray-900">{stats.yearCount} / {stats.moduleCount} / {stats.topicCount}</p>
              <Link to="/admin/resources" className="text-primary text-sm font-medium">Manage</Link>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-gray-500 text-sm">MCQs</p>
              <p className="text-2xl font-bold text-gray-900">{stats.mcqCount}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
