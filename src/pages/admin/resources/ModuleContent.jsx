import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../../api/client';
import ResourceBreadcrumb from '../../../components/admin/ResourceBreadcrumb';
import { SubjectForm } from '../../../components/admin/ResourceForms';
import Modal from '../../../components/admin/Modal';
import OspeForm from '../../../components/admin/OspeForm';
import { Plus, Pencil, Trash2, FileText, List } from 'lucide-react';

export default function ModuleContent() {
  const { yearId, moduleId } = useParams();
  const [year, setYear] = useState(null);
  const [module_, setModule_] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [ospes, setOspes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subjectForm, setSubjectForm] = useState(null);
  const [ospeForm, setOspeForm] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const loadYear = () => api.get('/admin/years').then(({ data }) => setYear(data.find((x) => x._id === yearId) || null)).catch(() => setYear(null));
  const loadModule = () => api.get('/admin/years/' + yearId + '/modules').then(({ data }) => setModule_(data.find((x) => x._id === moduleId) || null)).catch(() => setModule_(null));
  const loadSubjects = () => api.get(`/admin/modules/${moduleId}/subjects`).then(({ data }) => setSubjects(data)).catch(() => setSubjects([]));
  const loadOspes = () => api.get(`/admin/modules/${moduleId}/ospes`).then(({ data }) => setOspes(data)).catch(() => setOspes([]));

  useEffect(() => {
    if (!yearId || !moduleId) return;
    Promise.all([loadYear(), loadModule(), loadSubjects(), loadOspes()]).finally(() => setLoading(false));
  }, [yearId, moduleId]);

  const handleDeleteSubject = async (id) => {
    try { await api.delete(`/admin/subjects/${id}`); loadSubjects(); setDeleteConfirm(null); } catch (_) {}
  };
  const handleDeleteOspe = async (id) => {
    try { await api.delete(`/admin/ospes/${id}`); loadOspes(); setDeleteConfirm(null); } catch (_) {}
  };

  if (loading) return <div className="flex items-center justify-center py-12"><div className="animate-pulse text-gray-500">Loading...</div></div>;
  if (!year || !module_) return <p className="text-gray-500">Not found.</p>;

  const breadcrumbItems = [
    { label: 'Resources', path: '/admin/resources' },
    { label: year.name, path: `/admin/resources/years/${yearId}` },
    { label: module_.name, path: null },
  ];

  return (
    <>
      <ResourceBreadcrumb items={breadcrumbItems} />
      <div className="mb-6">
        <h1 className="text-2xl font-heading font-bold text-gray-900">{module_.name}</h1>
        <p className="text-sm text-gray-500 mt-1">Subjects (with topics & MCQs) and OSPEs for this module.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h2 className="font-heading font-semibold text-gray-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" /> Subjects
            </h2>
            <button type="button" onClick={() => setSubjectForm({})} className="inline-flex items-center gap-1 text-primary text-sm font-medium hover:underline">
              <Plus className="w-4 h-4" /> Add subject
            </button>
          </div>
          <ul className="divide-y divide-gray-100">
            {subjects.map((sub) => (
              <li key={sub._id} className="flex items-center justify-between p-4 hover:bg-gray-50/50">
                <Link to={`/admin/resources/years/${yearId}/modules/${moduleId}/subjects/${sub._id}`} className="font-medium text-gray-900 hover:text-primary flex-1">
                  {sub.name}
                </Link>
                <div className="flex items-center gap-1">
                  <button type="button" onClick={() => setSubjectForm(sub)} className="p-2 text-gray-500 hover:text-primary rounded-lg"><Pencil className="w-4 h-4" /></button>
                  <button type="button" onClick={() => setDeleteConfirm({ type: 'subject', id: sub._id, name: sub.name })} className="p-2 text-gray-500 hover:text-red-600 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                  <Link to={`/admin/resources/years/${yearId}/modules/${moduleId}/subjects/${sub._id}`} className="text-sm text-primary font-medium">Open →</Link>
                </div>
              </li>
            ))}
          </ul>
          {subjects.length === 0 && <p className="p-6 text-center text-gray-500 text-sm">No subjects. Add one to create topics and MCQs.</p>}
        </section>

        <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h2 className="font-heading font-semibold text-gray-900 flex items-center gap-2">
              <List className="w-5 h-5 text-primary" /> OSPEs
            </h2>
            <button type="button" onClick={() => setOspeForm({})} className="inline-flex items-center gap-1 text-primary text-sm font-medium hover:underline">
              <Plus className="w-4 h-4" /> Add OSPE
            </button>
          </div>
          <ul className="divide-y divide-gray-100">
            {ospes.map((ospe) => (
              <li key={ospe._id} className="flex items-center justify-between p-4 hover:bg-gray-50/50">
                <span className="font-medium text-gray-900">{ospe.name}</span>
                <div className="flex items-center gap-1">
                  <button type="button" onClick={() => setOspeForm({ ospe })} className="p-2 text-gray-500 hover:text-primary rounded-lg"><Pencil className="w-4 h-4" /></button>
                  <button type="button" onClick={() => setDeleteConfirm({ type: 'ospe', id: ospe._id, name: ospe.name })} className="p-2 text-gray-500 hover:text-red-600 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                </div>
              </li>
            ))}
          </ul>
          {ospes.length === 0 && <p className="p-6 text-center text-gray-500 text-sm">No OSPEs. Add picture-based or viva-type OSPEs.</p>}
        </section>
      </div>

      {subjectForm && <SubjectForm moduleId={moduleId} subject={subjectForm._id ? subjectForm : null} onSave={loadSubjects} onClose={() => setSubjectForm(null)} />}
      {ospeForm && <OspeForm moduleId={moduleId} ospe={ospeForm.ospe || null} onSave={loadOspes} onClose={() => setOspeForm(null)} />}
      {deleteConfirm && (
        <Modal open onClose={() => setDeleteConfirm(null)} title="Confirm delete">
          <p className="text-gray-600 mb-4">Delete &quot;{deleteConfirm.name}&quot;?</p>
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={() => setDeleteConfirm(null)} className="px-4 py-2 border rounded-lg">Cancel</button>
            <button type="button" onClick={() => deleteConfirm.type === 'subject' ? handleDeleteSubject(deleteConfirm.id) : handleDeleteOspe(deleteConfirm.id)} className="px-4 py-2 bg-red-600 text-white rounded-lg">Delete</button>
          </div>
        </Modal>
      )}
    </>
  );
}
