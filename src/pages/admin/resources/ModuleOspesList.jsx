import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../../api/client';
import ResourceBreadcrumb from '../../../components/admin/ResourceBreadcrumb';
import Modal from '../../../components/admin/Modal';
import { Plus, Pencil, Trash2, ClipboardList } from 'lucide-react';

export default function ModuleOspesList() {
  const { yearId, moduleId } = useParams();
  const [year, setYear] = useState(null);
  const [module_, setModule_] = useState(null);
  const [ospes, setOspes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const loadYear = () => api.get('/admin/years').then(({ data }) => setYear(data.find((x) => x._id === yearId) || null)).catch(() => setYear(null));
  const loadModule = () => api.get(`/admin/years/${yearId}/modules`).then(({ data }) => setModule_(data.find((x) => x._id === moduleId) || null)).catch(() => setModule_(null));
  const loadOspes = () => api.get(`/admin/modules/${moduleId}/ospes`).then(({ data }) => setOspes(data)).catch(() => setOspes([]));

  useEffect(() => {
    if (!yearId || !moduleId) return;
    Promise.all([loadYear(), loadModule(), loadOspes()]).finally(() => setLoading(false));
  }, [yearId, moduleId]);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/admin/ospes/${id}`);
      loadOspes();
      setDeleteConfirm(null);
    } catch (_) {}
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-pulse text-gray-500">Loading OSPEs...</div>
      </div>
    );
  }
  if (!year || !module_) return <p className="text-gray-500">Not found.</p>;

  const breadcrumbItems = [
    { label: 'Resources', path: '/admin/resources' },
    ...(year.program ? [{ label: year.program.name, path: `/admin/resources/programs/${year.program._id}` }] : []),
    { label: year.name, path: `/admin/resources/years/${yearId}` },
    { label: module_.name, path: `/admin/resources/years/${yearId}/modules/${moduleId}` },
    { label: 'OSPEs', path: null },
  ];

  return (
    <>
      <ResourceBreadcrumb items={breadcrumbItems} />
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900">OSPEs</h1>
          <p className="text-sm text-gray-500 mt-1">Picture-based MCQs and viva (written) OSPEs for {module_.name}.</p>
        </div>
        <Link
          to={`/admin/resources/years/${yearId}/modules/${moduleId}/ospes/new`}
          className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl font-medium shadow-sm hover:shadow transition-colors"
        >
          <Plus className="w-5 h-5" /> Add OSPE
        </Link>
      </div>

      <div className="table-listing-wrapper">
        <table className="table-listing">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {ospes.map((ospe) => (
              <tr key={ospe._id}>
                <td>
                  <span className="cell-primary">{ospe.name}</span>
                </td>
                <td className="cell-muted">
                  {ospe.stations?.length ? `${ospe.stations.length} station(s)` : (ospe.type === 'viva_written' ? 'Viva (written)' : '—')}
                </td>
                <td className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      to={`/admin/resources/years/${yearId}/modules/${moduleId}/ospes/${ospe._id}/edit`}
                      className="p-2 text-gray-500 hover:text-primary hover:bg-primary/5 rounded-lg"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirm(ospe)}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {ospes.length === 0 && (
        <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No OSPEs yet</p>
          <p className="text-sm text-gray-400 mt-1">Add picture-based or viva-type OSPEs for this module.</p>
          <Link
            to={`/admin/resources/years/${yearId}/modules/${moduleId}/ospes/new`}
            className="mt-4 inline-block text-primary font-medium hover:underline"
          >
            Add first OSPE
          </Link>
        </div>
      )}

      {deleteConfirm && (
        <Modal open onClose={() => setDeleteConfirm(null)} title="Delete OSPE">
          <p className="text-gray-600 mb-4">Delete &quot;{deleteConfirm.name}&quot;? This will remove the OSPE and its questions.</p>
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={() => setDeleteConfirm(null)} className="px-4 py-2 border rounded-lg">Cancel</button>
            <button type="button" onClick={() => handleDelete(deleteConfirm._id)} className="px-4 py-2 bg-red-600 text-white rounded-lg">Delete</button>
          </div>
        </Modal>
      )}
    </>
  );
}
