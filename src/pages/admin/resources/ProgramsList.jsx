import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../api/client';
import ResourceBreadcrumb from '../../../components/admin/ResourceBreadcrumb';
import { ProgramForm } from '../../../components/admin/ResourceForms';
import Modal from '../../../components/admin/Modal';
import { Plus, Pencil, Trash2, GraduationCap } from 'lucide-react';

export default function ProgramsList() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const load = () => api.get('/admin/programs').then(({ data }) => setPrograms(data)).catch(() => setPrograms([]));

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/admin/programs/${id}`);
      load();
      setDeleteConfirm(null);
    } catch (_) {}
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-pulse text-gray-500">Loading programs...</div>
      </div>
    );
  }

  return (
    <>
      <ResourceBreadcrumb items={[{ label: 'Resources', path: null }]} />
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900">Programs</h1>
          <p className="text-sm text-gray-500 mt-1">Select a program (e.g. MBBS, BDS, PharmD) to manage its years and content.</p>
        </div>
        <button
          type="button"
          onClick={() => setFormOpen('new')}
          className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl font-medium shadow-sm hover:shadow transition-shadow"
        >
          <Plus className="w-5 h-5" /> Add program
        </button>
      </div>

      {/* Desktop: table listing */}
      <div className="hidden lg:block bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50/80">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Name</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Order</th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {programs.map((program) => (
              <tr key={program._id} className="border-b border-gray-100 hover:bg-gray-50/50">
                <td className="py-3 px-4">
                  <Link to={`/admin/resources/programs/${program._id}`} className="font-medium text-gray-900 hover:text-primary">
                    {program.name}
                  </Link>
                </td>
                <td className="py-3 px-4 text-sm text-gray-500">{program.order}</td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => setFormOpen(program)}
                      className="p-2 text-gray-500 hover:text-primary hover:bg-primary/5 rounded-lg"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirm(program)}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <Link
                      to={`/admin/resources/programs/${program._id}`}
                      className="text-sm font-medium text-primary hover:underline ml-1"
                    >
                      Open →
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:hidden">
        {programs.map((program) => (
          <div
            key={program._id}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
          >
            <Link to={`/admin/resources/programs/${program._id}`} className="block p-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="font-heading font-semibold text-gray-900 group-hover:text-primary transition-colors">{program.name}</h2>
                  <p className="text-xs text-gray-500">Order: {program.order}</p>
                </div>
              </div>
            </Link>
            <div className="flex items-center gap-2 px-5 pb-4 border-t border-gray-100 pt-3">
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); setFormOpen(program); }}
                className="p-2 text-gray-500 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                title="Edit"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); setDeleteConfirm(program); }}
                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <Link
                to={`/admin/resources/programs/${program._id}`}
                className="ml-auto text-sm font-medium text-primary hover:underline"
              >
                Open →
              </Link>
            </div>
          </div>
        ))}
      </div>

      {programs.length === 0 && (
        <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <GraduationCap className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No programs yet</p>
          <p className="text-sm text-gray-400 mt-1">Add a program (MBBS, BDS, PharmD, etc.) to start building the academic structure.</p>
          <button type="button" onClick={() => setFormOpen('new')} className="mt-4 text-primary font-medium hover:underline">
            Add first program
          </button>
        </div>
      )}

      {formOpen && <ProgramForm program={formOpen === 'new' ? null : formOpen} onSave={load} onClose={() => setFormOpen(null)} />}
      {deleteConfirm && (
        <Modal open onClose={() => setDeleteConfirm(null)} title="Delete program">
          <p className="text-gray-600 mb-4">Delete &quot;{deleteConfirm.name}&quot;? Years and content under it will remain but will no longer be grouped under this program.</p>
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={() => setDeleteConfirm(null)} className="px-4 py-2 border rounded-lg">Cancel</button>
            <button type="button" onClick={() => handleDelete(deleteConfirm._id)} className="px-4 py-2 bg-red-600 text-white rounded-lg">Delete</button>
          </div>
        </Modal>
      )}
    </>
  );
}
