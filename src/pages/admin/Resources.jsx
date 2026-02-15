import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import { YearForm, ModuleForm, SubjectForm, TopicForm } from '../../components/admin/ResourceForms';
import Modal from '../../components/admin/Modal';
import McqForm from '../../components/admin/McqForm';
import BulkMcqModal from '../../components/admin/BulkMcqModal';
import { ChevronDown, ChevronRight, Pencil, Trash2, Plus, FileText, List } from 'lucide-react';

export default function AdminResources() {
  const [years, setYears] = useState([]);
  const [modulesByYear, setModulesByYear] = useState({});
  const [subjectsByModule, setSubjectsByModule] = useState({});
  const [topicsBySubject, setTopicsBySubject] = useState({});
  const [ospesByModule, setOspesByModule] = useState({});
  const [mcqsByTopic, setMcqsByTopic] = useState({});
  const [expanded, setExpanded] = useState({});
  const [loading, setLoading] = useState(true);

  const loadYears = () => api.get('/admin/years').then(({ data }) => setYears(data)).catch(() => setYears([]));
  const loadModules = (yearId) => api.get(`/admin/years/${yearId}/modules`).then(({ data }) => setModulesByYear((p) => ({ ...p, [yearId]: data })));
  const loadSubjects = (moduleId) => api.get(`/admin/modules/${moduleId}/subjects`).then(({ data }) => setSubjectsByModule((p) => ({ ...p, [moduleId]: data })));
  const loadTopics = (subjectId) => api.get(`/admin/subjects/${subjectId}/topics`).then(({ data }) => setTopicsBySubject((p) => ({ ...p, [subjectId]: data })));
  const loadOspes = (moduleId) => api.get(`/admin/modules/${moduleId}/ospes`).then(({ data }) => setOspesByModule((p) => ({ ...p, [moduleId]: data })));
  const loadMcqs = (topicId) => api.get(`/admin/topics/${topicId}/mcqs`).then(({ data }) => setMcqsByTopic((p) => ({ ...p, [topicId]: data })));

  useEffect(() => {
    loadYears().finally(() => setLoading(false));
  }, []);

  const toggle = (key) => setExpanded((e) => ({ ...e, [key]: !e[key] }));

  // Modals state
  const [yearForm, setYearForm] = useState(null);
  const [moduleForm, setModuleForm] = useState(null);
  const [subjectForm, setSubjectForm] = useState(null);
  const [topicForm, setTopicForm] = useState(null);
  const [mcqForm, setMcqForm] = useState(null);
  const [bulkMcqTopicId, setBulkMcqTopicId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const refreshModules = (yearId) => loadModules(yearId);
  const refreshSubjects = (moduleId) => loadSubjects(moduleId);
  const refreshTopics = (subjectId) => loadTopics(subjectId);
  const refreshOspes = (moduleId) => loadOspes(moduleId);
  const refreshMcqs = (topicId) => loadMcqs(topicId);

  const deleteYear = async (id) => {
    try { await api.delete(`/admin/years/${id}`); await loadYears(); setDeleteConfirm(null); } catch (_) {}
  };
  const deleteModule = async (id, yearId) => {
    try { await api.delete(`/admin/modules/${id}`); refreshModules(yearId); setDeleteConfirm(null); } catch (_) {}
  };
  const deleteSubject = async (id, moduleId) => {
    try { await api.delete(`/admin/subjects/${id}`); refreshSubjects(moduleId); setDeleteConfirm(null); } catch (_) {}
  };
  const deleteTopic = async (id, subjectId) => {
    try { await api.delete(`/admin/topics/${id}`); refreshTopics(subjectId); setDeleteConfirm(null); } catch (_) {}
  };
  const deleteMcq = async (topicId, mcqId) => {
    try { await api.delete(`/admin/topics/${topicId}/mcqs/${mcqId}`); refreshMcqs(topicId); setDeleteConfirm(null); } catch (_) {}
  };
  const deleteOspe = async (id, moduleId) => {
    try { await api.delete(`/admin/ospes/${id}`); refreshOspes(moduleId); setDeleteConfirm(null); } catch (_) {}
  };

  if (loading) return <p className="text-gray-500">Loading...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-bold text-gray-900">Resource management</h1>
        <button type="button" onClick={() => setYearForm({})} className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-medium text-sm">
          <Plus className="w-4 h-4" /> Add year
        </button>
      </div>
      <p className="text-sm text-gray-600 mb-6">Academic structure: Years → Modules → Subjects → Topics. Each topic has MCQs; each module can have OSPEs (picture MCQs or viva written).</p>

      <div className="space-y-1">
        {years.map((year) => (
          <div key={year._id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between p-4 hover:bg-gray-50">
              <button type="button" onClick={() => { toggle(`y-${year._id}`); loadModules(year._id); }} className="flex items-center gap-2 font-semibold text-gray-900">
                {expanded[`y-${year._id}`] ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                {year.name}
              </button>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setYearForm(year)} className="p-2 text-gray-500 hover:text-primary" title="Edit"><Pencil className="w-4 h-4" /></button>
                <button type="button" onClick={() => setModuleForm({ yearId: year._id })} className="text-primary text-sm font-medium">+ Module</button>
                <button type="button" onClick={() => setDeleteConfirm({ type: 'year', id: year._id })} className="p-2 text-gray-500 hover:text-red-600" title="Delete"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>

            {expanded[`y-${year._id}`] && (modulesByYear[year._id] || []).map((mod) => (
              <div key={mod._id} className="border-t border-gray-100 bg-gray-50/50">
                <div className="flex items-center justify-between px-4 py-3 pl-8">
                  <button type="button" onClick={() => { toggle(`m-${mod._id}`); loadSubjects(mod._id); loadOspes(mod._id); }} className="flex items-center gap-2 text-gray-800 font-medium">
                    {expanded[`m-${mod._id}`] ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    {mod.name}
                  </button>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => setModuleForm({ yearId: year._id, module: mod })} className="p-1.5 text-gray-500 hover:text-primary" title="Edit"><Pencil className="w-4 h-4" /></button>
                    <Link to={`/admin/resources/years/${year._id}/modules/${mod._id}/ospes`} className="text-primary text-sm font-medium">+ OSPE</Link>
                    <button type="button" onClick={() => setSubjectForm({ moduleId: mod._id })} className="text-primary text-sm font-medium">+ Subject</button>
                    <button type="button" onClick={() => setDeleteConfirm({ type: 'module', id: mod._id, parentId: year._id })} className="p-1.5 text-gray-500 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>

                {expanded[`m-${mod._id}`] && (
                  <>
                    {(ospesByModule[mod._id] || []).length > 0 && (
                      <div className="pl-12 pr-4 pb-2">
                        <p className="text-xs font-medium text-gray-500 mb-1">OSPEs</p>
                        <div className="flex flex-wrap gap-2">
                          {(ospesByModule[mod._id] || []).map((ospe) => (
                            <div key={ospe._id} className="flex items-center gap-2 bg-white border rounded-lg px-3 py-2 text-sm">
                              <List className="w-4 h-4 text-primary" />
                              <span>{ospe.name}</span>
                              <Link to={`/admin/resources/years/${year._id}/modules/${mod._id}/ospes/${ospe._id}/edit`} className="text-primary hover:underline">Edit</Link>
                              <button type="button" onClick={() => setDeleteConfirm({ type: 'ospe', id: ospe._id, parentId: mod._id })} className="text-red-600">Delete</button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {(subjectsByModule[mod._id] || []).map((sub) => (
                      <div key={sub._id} className="border-t border-gray-100 pl-8">
                        <div className="flex items-center justify-between px-4 py-2">
                          <button type="button" onClick={() => { toggle(`s-${sub._id}`); loadTopics(sub._id); }} className="flex items-center gap-2 text-gray-700">
                            {expanded[`s-${sub._id}`] ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                            {sub.name}
                          </button>
                          <div className="flex items-center gap-2">
                            <button type="button" onClick={() => setSubjectForm({ moduleId: mod._id, subject: sub })} className="p-1.5 text-gray-500 hover:text-primary"><Pencil className="w-4 h-4" /></button>
                            <button type="button" onClick={() => setTopicForm({ subjectId: sub._id })} className="text-primary text-sm">+ Topic</button>
                            <button type="button" onClick={() => setDeleteConfirm({ type: 'subject', id: sub._id, parentId: mod._id })} className="p-1.5 text-gray-500 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </div>
                        {expanded[`s-${sub._id}`] && (topicsBySubject[sub._id] || []).map((topic) => (
                          <div key={topic._id} className="border-t border-gray-100 pl-12 bg-white">
                            <div className="flex items-center justify-between px-4 py-2">
                              <button type="button" onClick={() => { toggle(`t-${topic._id}`); loadMcqs(topic._id); }} className="flex items-center gap-2 text-gray-700 text-sm">
                                {expanded[`t-${topic._id}`] ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                <FileText className="w-4 h-4 text-primary" />
                                {topic.name}
                                {topic.videoUrl && <span className="text-xs text-gray-400">(video)</span>}
                              </button>
                              <div className="flex items-center gap-2">
                                <button type="button" onClick={() => setTopicForm({ subjectId: sub._id, topic })} className="p-1.5 text-gray-500 hover:text-primary"><Pencil className="w-4 h-4" /></button>
                                <button type="button" onClick={() => setMcqForm({ topicId: topic._id })} className="text-primary text-sm">+ MCQ</button>
                                <button type="button" onClick={() => setBulkMcqTopicId(topic._id)} className="text-gray-600 text-sm">Bulk MCQs</button>
                                <button type="button" onClick={() => setDeleteConfirm({ type: 'topic', id: topic._id, parentId: sub._id })} className="p-1.5 text-gray-500 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                              </div>
                            </div>
                            {expanded[`t-${topic._id}`] && (
                              <div className="px-4 pb-3 pl-16">
                                <p className="text-xs font-medium text-gray-500 mb-1">MCQs ({(mcqsByTopic[topic._id] || []).length})</p>
                                <ul className="space-y-1">
                                  {(mcqsByTopic[topic._id] || []).map((mcq) => (
                                    <li key={mcq._id} className="flex items-center justify-between text-sm py-1.5 px-2 rounded bg-gray-50">
                                      <span className="truncate flex-1">{mcq.question}</span>
                                      <span className="text-xs text-gray-500 mr-2">({mcq.type})</span>
                                      <button type="button" onClick={() => setMcqForm({ topicId: topic._id, mcq })} className="text-primary text-xs">Edit</button>
                                      <button type="button" onClick={() => setDeleteConfirm({ type: 'mcq', id: mcq._id, topicId: topic._id })} className="text-red-600 text-xs">Delete</button>
                                    </li>
                                  ))}
                                </ul>
                                {(mcqsByTopic[topic._id] || []).length === 0 && <p className="text-xs text-gray-400">No MCQs yet. Add one or use Bulk import.</p>}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ))}
                  </>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      {years.length === 0 && <p className="text-gray-500 py-8">No years. Click &quot;Add year&quot; to start.</p>}

      {/* Forms */}
      {yearForm && <YearForm year={yearForm._id ? yearForm : null} onSave={loadYears} onClose={() => setYearForm(null)} />}
      {moduleForm && <ModuleForm yearId={moduleForm.yearId} module={moduleForm.module ?? null} onSave={() => refreshModules(moduleForm.yearId)} onClose={() => setModuleForm(null)} />}
      {subjectForm && <SubjectForm moduleId={subjectForm.moduleId} subject={subjectForm.subject ?? null} onSave={() => refreshSubjects(subjectForm.moduleId)} onClose={() => setSubjectForm(null)} />}
      {topicForm && <TopicForm subjectId={topicForm.subjectId} topic={topicForm.topic ?? null} onSave={() => refreshTopics(topicForm.subjectId)} onClose={() => setTopicForm(null)} />}
      {mcqForm && <McqForm topicId={mcqForm.topicId} mcq={mcqForm.mcq ?? null} onSave={() => refreshMcqs(mcqForm.topicId)} onClose={() => setMcqForm(null)} />}
      {bulkMcqTopicId && <BulkMcqModal topicId={bulkMcqTopicId} onSave={() => { refreshMcqs(bulkMcqTopicId); }} onClose={() => setBulkMcqTopicId(null)} />}

      {/* Delete confirmation */}
      {deleteConfirm && (
        <Modal open onClose={() => setDeleteConfirm(null)} title="Confirm delete">
          <p className="text-gray-600 mb-4">Are you sure you want to delete this? This may remove nested data.</p>
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={() => setDeleteConfirm(null)} className="px-4 py-2 border rounded-lg">Cancel</button>
            <button
              type="button"
              onClick={() => {
                if (deleteConfirm.type === 'year') deleteYear(deleteConfirm.id);
                if (deleteConfirm.type === 'module') deleteModule(deleteConfirm.id, deleteConfirm.parentId);
                if (deleteConfirm.type === 'subject') deleteSubject(deleteConfirm.id, deleteConfirm.parentId);
                if (deleteConfirm.type === 'topic') deleteTopic(deleteConfirm.id, deleteConfirm.parentId);
                if (deleteConfirm.type === 'mcq') deleteMcq(deleteConfirm.topicId, deleteConfirm.id);
                if (deleteConfirm.type === 'ospe') deleteOspe(deleteConfirm.id, deleteConfirm.parentId);
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg"
            >
              Delete
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
