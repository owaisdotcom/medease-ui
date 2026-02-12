import { useEffect, useState } from 'react';
import api from '../../api/client';

export default function AdminPackages() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/packages').then(({ data }) => setPackages(data)).catch(() => setPackages([])).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-heading font-bold text-gray-900 mb-6">Packages</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-4">
          {packages.map((pkg) => (
            <div key={pkg._id} className="bg-white rounded-xl border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900">{pkg.name}</h3>
              <p className="text-sm text-gray-500">{pkg.type} {pkg.year && `Year ${pkg.year}`} {pkg.part && `Part ${pkg.part}`}</p>
              <p className="text-primary font-medium">₨{pkg.price}</p>
            </div>
          ))}
          {packages.length === 0 && <p className="text-gray-500">No packages. Create via API or add UI for create.</p>}
        </div>
      )}
    </div>
  );
}
