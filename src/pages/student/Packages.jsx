import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/client';

export default function StudentPackages() {
  const { user, refreshUser } = useAuth();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState(null);
  const [academic, setAcademic] = useState({ institution: '', year: '', rollNumber: '', batch: '' });
  const [amount, setAmount] = useState('');
  const [receipt, setReceipt] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/packages').then(({ data }) => setPackages(data)).catch(() => setPackages([])).finally(() => setLoading(false));
  }, []);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!selectedPkg) return;
    setError('');
    setApplying(true);
    try {
      await api.post('/package-apply', { packageId: selectedPkg._id, academicDetails: academic });
      await refreshUser();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed');
    }
    setApplying(false);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPkg || !receipt) {
      setError('Select package and upload receipt');
      return;
    }
    setError('');
    setApplying(true);
    try {
      await api.post('/package-apply', { packageId: selectedPkg._id, academicDetails: academic });
    } catch (_) {}
    const form = new FormData();
    form.append('packageId', selectedPkg._id);
    form.append('amount', amount || selectedPkg.price || 0);
    form.append('receipt', receipt);
    try {
      await api.post('/payments', form);
      setSelectedPkg(null);
      setReceipt(null);
      await refreshUser();
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    }
    setApplying(false);
  };

  return (
    <section className="py-12 container mx-auto px-4">
      <h1 className="text-2xl font-heading font-bold text-gray-900 mb-6">Packages</h1>
      {user?.packages?.length > 0 && (
        <div className="mb-8 p-4 bg-primary/10 rounded-xl">
          <h3 className="font-semibold text-gray-900">Your packages</h3>
          <ul className="mt-2">
            {user.packages.map((up) => (
              <li key={up._id}>{up.package?.name} – Active</li>
            ))}
          </ul>
        </div>
      )}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-6">
          <p className="text-gray-600">Apply for one half-package at a time. After applying, upload your payment receipt.</p>
          {packages.map((pkg) => (
            <div key={pkg._id} className="bg-white rounded-xl border border-gray-200 p-4 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-gray-900">{pkg.name}</h3>
                <p className="text-sm text-gray-500">{pkg.description}</p>
                {pkg.price != null && <p className="text-primary font-medium">₨{pkg.price}</p>}
              </div>
              <button
                onClick={() => setSelectedPkg(selectedPkg?._id === pkg._id ? null : pkg)}
                className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                {selectedPkg?._id === pkg._id ? 'Cancel' : 'Apply & pay'}
              </button>
            </div>
          ))}
          {selectedPkg && (
            <form onSubmit={handlePaymentSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4 max-w-md">
              <h3 className="font-semibold">Apply: {selectedPkg.name}</h3>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Institution</label>
                <input
                  type="text"
                  value={academic.institution}
                  onChange={(e) => setAcademic((a) => ({ ...a, institution: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Year</label>
                <input
                  type="number"
                  value={academic.year || ''}
                  onChange={(e) => setAcademic((a) => ({ ...a, year: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Roll number</label>
                <input
                  type="text"
                  value={academic.rollNumber}
                  onChange={(e) => setAcademic((a) => ({ ...a, rollNumber: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Amount</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder={selectedPkg.price}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Receipt (image)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setReceipt(e.target.files?.[0])}
                  className="w-full"
                />
              </div>
              {error && <p className="text-red-600 text-sm">{error}</p>}
              <button type="submit" disabled={applying} className="bg-primary text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50">
                {applying ? 'Submitting...' : 'Submit payment'}
              </button>
            </form>
          )}
        </div>
      )}
    </section>
  );
}
