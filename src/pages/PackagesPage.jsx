import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import { Lock, Check } from 'lucide-react';

export default function PackagesPage() {
  const { user } = useAuth();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/packages').then(({ data }) => setPackages(data)).catch(() => setPackages([])).finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-12 sm:py-16 md:py-20 container mx-auto px-4">
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-heading font-bold text-gray-900">Packages</h1>
        <p className="text-gray-600 font-body mt-2">Choose a package to get started. Register and complete payment for access.</p>
      </div>
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
          {packages.length === 0 ? (
            <p className="col-span-full text-center text-gray-500">No packages available yet.</p>
          ) : (
            packages.map((pkg) => (
              <div
                key={pkg._id}
                className="bg-white border-2 border-gray-200 rounded-2xl p-6 hover:border-primary/50 hover:shadow-xl transition-all"
              >
                <h3 className="text-xl font-heading font-bold text-gray-900">{pkg.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{pkg.description}</p>
                {pkg.price != null && (
                  <p className="mt-2 text-primary font-semibold">₨{pkg.price}</p>
                )}
                <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                  {user ? (
                    <Link
                      to="/student/packages"
                      className="inline-flex items-center gap-1 text-primary font-medium"
                    >
                      <Check className="w-4 h-4" />
                      Apply from Dashboard
                    </Link>
                  ) : (
                    <Link
                      to="/register"
                      className="inline-flex items-center gap-1 text-primary font-medium"
                    >
                      <Lock className="w-4 h-4" />
                      Register to apply
                    </Link>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </section>
  );
}
