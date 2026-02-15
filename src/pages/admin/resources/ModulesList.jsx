import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../api/client';
import ResourceBreadcrumb from '../../../components/admin/ResourceBreadcrumb';
import Modal from '../../../components/admin/Modal';
import { ModuleForm } from '../../../components/admin/ResourceForms';
import { Layers, Pencil, Trash2 } from 'lucide-react';

export default function ModulesList() {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [formOpen, setFormOpen] = useState(null);
  const [yearFilter, setYearFilter] = useState('');

  const load = () => api.get('/admin/modules').then(({ data }) => setModules(data)).catch(() => setModules([]));

  const years = useMemo(() => {
    const seen = new Map();
    modules.forEach((mod) => {
      const y = mod.year;
      if (y && (y._id || y)) {
        const id = y._id || y;
        if (!seen.has(id)) seen.set(id, { _id: id, name: y.name ?? id });
      }
    });
    return Array.from(seen.values()).sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  }, [modules]);

  const filteredModules = useMemo(() => {
    if (!yearFilter) return modules;
    return modules.filter((mod) => {
      const id = mod.year?._id || mod.year;
      return id === yearFilter;
    });
  }, [modules, yearFilter]);

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/admin/modules/${id}`);
      load();
      setDeleteConfirm(null);
    } catch (_) {}
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-pulse text-gray-500">Loading modules...</div>
      </div>
    );
  }

  return (
    <>
      <ResourceBreadcrumb items={[{ label: 'Resources', path: '/admin/resources' }, { label: 'Modules', path: null }]} />
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900">Modules</h1>
          <p className="text-sm text-gray-500 mt-1">All modules across years. Open a module to manage subjects and topics.</p>
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-600">
          Sort by year
          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 bg-white focus:ring-2 focus:ring-primary focus:border-primary min-w-[10rem]"
          >
            <option value="">All years</option>
            {years.map((y) => (
              <option key={y._id} value={y._id}>{y.name}</option>
            ))}
          </select>
        </label>
      </div>

      {/* Desktop: table listing */}
      <div className="hidden lg:block bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50/80">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Name</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Year</th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredModules.map((mod) => {
              const yearId = mod.year?._id || mod.year;
              return (
                <tr key={mod._id} className="border-b border-gray-100 hover:bg-gray-50/50">
                  <td className="py-3 px-4">
                    {yearId ? (
                      <Link to={`/admin/resources/years/${yearId}/modules/${mod._id}`} className="font-medium text-gray-900 hover:text-primary">
                        {mod.name}
                      </Link>
                    ) : (
                      <span className="font-medium text-gray-900">{mod.name}</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-500">{mod.year?.name ?? '—'}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {yearId && (
                        <button
                          type="button"
                          onClick={() => setFormOpen(mod)}
                          className="p-2 text-gray-500 hover:text-primary hover:bg-primary/5 rounded-lg"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setDeleteConfirm(mod)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      {yearId && (
                        <Link
                          to={`/admin/resources/years/${yearId}/modules/${mod._id}`}
                          className="text-sm font-medium text-primary hover:underline ml-1"
                        >
                          Open →
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile: cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:hidden">
        {filteredModules.map((mod) => {
          const yearId = mod.year?._id || mod.year;
          return (
            <div
              key={mod._id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
            >
              <Link to={yearId ? `/admin/resources/years/${yearId}/modules/${mod._id}` : '#'} className="block p-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Layers className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-heading font-semibold text-gray-900 group-hover:text-primary transition-colors">{mod.name}</h2>
                    <p className="text-xs text-gray-500">{mod.year?.name ? `Year: ${mod.year.name}` : `Order: ${mod.order}`}</p>
                  </div>
                </div>
              </Link>
              <div className="flex items-center gap-2 px-5 pb-4 border-t border-gray-100 pt-3">
                {yearId && (
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); setFormOpen(mod); }}
                    className="p-2 text-gray-500 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); setDeleteConfirm(mod); }}
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                {yearId && (
                  <Link
                    to={`/admin/resources/years/${yearId}/modules/${mod._id}`}
                    className="ml-auto text-sm font-medium text-primary hover:underline"
                  >
                    Open →
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredModules.length === 0 && (
        <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <Layers className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">{yearFilter ? 'No modules in this year' : 'No modules yet'}</p>
          <p className="text-sm text-gray-400 mt-1">{yearFilter ? 'Try another year or clear the filter.' : 'Add years and modules from Programs or Years.'}</p>
          {yearFilter ? (
            <button type="button" onClick={() => setYearFilter('')} className="mt-4 text-primary font-medium hover:underline">Clear year filter</button>
          ) : (
            <Link to="/admin/resources" className="mt-4 inline-block text-primary font-medium hover:underline">Go to Programs</Link>
          )}
        </div>
      )}

      {formOpen && (
        <ModuleForm
          yearId={formOpen.year?._id || formOpen.year}
          module={formOpen}
          onSave={load}
          onClose={() => setFormOpen(null)}
        />
      )}
      {deleteConfirm && (
        <Modal open onClose={() => setDeleteConfirm(null)} title="Delete module">
          <p className="text-gray-600 mb-4">Delete &quot;{deleteConfirm.name}&quot;? This will remove all subjects, topics and content under it.</p>
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={() => setDeleteConfirm(null)} className="px-4 py-2 border rounded-lg">Cancel</button>
            <button type="button" onClick={() => handleDelete(deleteConfirm._id)} className="px-4 py-2 bg-red-600 text-white rounded-lg">Delete</button>
          </div>
        </Modal>
      )}
    </>
  );
}
