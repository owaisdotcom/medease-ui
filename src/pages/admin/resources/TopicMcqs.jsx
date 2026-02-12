import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../../api/client';
import ResourceBreadcrumb from '../../../components/admin/ResourceBreadcrumb';
import McqForm from '../../../components/admin/McqForm';
import BulkMcqModal from '../../../components/admin/BulkMcqModal';
import Modal from '../../../components/admin/Modal';
import { Plus, Pencil, Trash2, Upload, HelpCircle } from 'lucide-react';

export default function TopicMcqs() {
  const { yearId, moduleId, subjectId, topicId } = useParams();
  const [year, setYear] = useState(null);
  const [module_, setModule_] = useState(null);
  const [subject, setSubject] = useState(null);
  const [topic, setTopic] = useState(null);
  const [mcqs, setMcqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mcqForm, setMcqForm] = useState(null);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const loadMeta = async () => {
    const [yearsRes, modulesRes, subjectsRes] = await Promise.all([
      api.get('/admin/years'),
      api.get(`/admin/years/${yearId}/modules`),
      api.get(`/admin/modules/${moduleId}/subjects`),
    ]);
    setYear(yearsRes.data.find((x) => x._id === yearId) || null);
    setModule_(modulesRes.data.find((x) => x._id === moduleId) || null);
    setSubject(subjectsRes.data.find((x) => x._id === subjectId) || null);
  };
  const loadTopic = () => api.get('/admin/subjects/' + subjectId + '/topics').then(({ data }) => setTopic(data.find((x) => x._id === topicId) || null)).catch(() => setTopic(null));
  const loadMcqs = () => api.get(`/admin/topics/${topicId}/mcqs`).then(({ data }) => setMcqs(data)).catch(() => setMcqs([]));

  useEffect(() => {
    if (!yearId || !moduleId || !subjectId || !topicId) return;
    Promise.all([loadMeta(), loadTopic(), loadMcqs()]).finally(() => setLoading(false));
  }, [yearId, moduleId, subjectId, topicId]);

  const handleDelete = async (mcqId) => {
    try { await api.delete(`/admin/topics/${topicId}/mcqs/${mcqId}`); loadMcqs(); setDeleteConfirm(null); } catch (_) {}
  };

  if (loading) return <div className="flex items-center justify-center py-12"><div className="animate-pulse text-gray-500">Loading...</div></div>;
  if (!year || !module_ || !subject || !topic) return <p className="text-gray-500">Not found.</p>;

  const breadcrumbItems = [
    { label: 'Resources', path: '/admin/resources' },
    { label: year.name, path: `/admin/resources/years/${yearId}` },
    { label: module_.name, path: `/admin/resources/years/${yearId}/modules/${moduleId}` },
    { label: subject.name, path: `/admin/resources/years/${yearId}/modules/${moduleId}/subjects/${subjectId}` },
    { label: topic.name, path: null },
  ];

  return (
    <>
      <ResourceBreadcrumb items={breadcrumbItems} />
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900">{topic.name}</h1>
          <p className="text-sm text-gray-500 mt-1">MCQs for this topic. Add single MCQs or bulk import (text, image-based, guess-until-correct).</p>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setBulkOpen(true)} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-primary/30 text-primary font-medium hover:bg-primary/5 transition-colors">
            <Upload className="w-5 h-5" /> Bulk import
          </button>
          <button type="button" onClick={() => setMcqForm({})} className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl font-medium shadow-sm hover:shadow transition-shadow">
            <Plus className="w-5 h-5" /> Add MCQ
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-heading font-semibold text-gray-900">MCQs ({mcqs.length})</h2>
        </div>
        <ul className="divide-y divide-gray-100">
          {mcqs.map((mcq, i) => (
            <li key={mcq._id} className="p-4 hover:bg-gray-50/50 flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 min-w-0 flex-1">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 text-sm font-medium text-primary">
                  {i + 1}
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-gray-900 line-clamp-2">{mcq.question}</p>
                  <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600">{mcq.type}</span>
                  {mcq.explanation && <p className="text-sm text-gray-500 mt-1 line-clamp-1">{mcq.explanation}</p>}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button type="button" onClick={() => setMcqForm({ mcq })} className="p-2 text-gray-500 hover:text-primary rounded-lg" title="Edit"><Pencil className="w-4 h-4" /></button>
                <button type="button" onClick={() => setDeleteConfirm(mcq)} className="p-2 text-gray-500 hover:text-red-600 rounded-lg" title="Delete"><Trash2 className="w-4 h-4" /></button>
              </div>
            </li>
          ))}
        </ul>
        {mcqs.length === 0 && (
          <div className="text-center py-16 bg-gray-50/50">
            <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No MCQs yet</p>
            <p className="text-sm text-gray-400 mt-1">Add an MCQ or use bulk import (Question / 4 options with one &quot;(correct)&quot; / explanation).</p>
            <div className="flex gap-2 justify-center mt-4">
              <button type="button" onClick={() => setMcqForm({})} className="text-primary font-medium hover:underline">Add MCQ</button>
              <button type="button" onClick={() => setBulkOpen(true)} className="text-primary font-medium hover:underline">Bulk import</button>
            </div>
          </div>
        )}
      </div>

      {mcqForm && <McqForm topicId={topicId} mcq={mcqForm.mcq || null} onSave={loadMcqs} onClose={() => setMcqForm(null)} />}
      {bulkOpen && <BulkMcqModal topicId={topicId} onSave={loadMcqs} onClose={() => setBulkOpen(false)} />}
      {deleteConfirm && (
        <Modal open onClose={() => setDeleteConfirm(null)} title="Delete MCQ">
          <p className="text-gray-600 mb-4">Delete this MCQ?</p>
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={() => setDeleteConfirm(null)} className="px-4 py-2 border rounded-lg">Cancel</button>
            <button type="button" onClick={() => handleDelete(deleteConfirm._id)} className="px-4 py-2 bg-red-600 text-white rounded-lg">Delete</button>
          </div>
        </Modal>
      )}
    </>
  );
}
