import { useState } from 'react';
import api from '../../api/client';
import Modal from './Modal';

export function YearForm({ year, onSave, onClose }) {
  const [name, setName] = useState(year?.name ?? '');
  const [order, setOrder] = useState(year?.order ?? 1);
  const [saving, setSaving] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (year?._id) await api.put(`/admin/years/${year._id}`, { name, order });
      else await api.post('/admin/years', { name, order });
      onSave?.();
      onClose?.();
    } catch (_) {}
    setSaving(false);
  };
  return (
    <Modal open onClose={onClose} title={year ? 'Edit Year' : 'Add Year'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-3 py-2 border rounded-lg" placeholder="e.g. First Year" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
          <input type="number" value={order} onChange={(e) => setOrder(Number(e.target.value))} className="w-full px-3 py-2 border rounded-lg" />
        </div>
        <div className="flex gap-2 justify-end">
          <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button>
          <button type="submit" disabled={saving} className="px-4 py-2 bg-primary text-white rounded-lg disabled:opacity-50">Save</button>
        </div>
      </form>
    </Modal>
  );
}

export function ModuleForm({ yearId, module, onSave, onClose }) {
  const [name, setName] = useState(module?.name ?? '');
  const [order, setOrder] = useState(module?.order ?? 1);
  const [saving, setSaving] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (module?._id) await api.put(`/admin/modules/${module._id}`, { name, order });
      else await api.post(`/admin/years/${yearId}/modules`, { name, order });
      onSave?.();
      onClose?.();
    } catch (_) {}
    setSaving(false);
  };
  return (
    <Modal open onClose={onClose} title={module ? 'Edit Module' : 'Add Module'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-3 py-2 border rounded-lg" placeholder="e.g. Foundation Module" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
          <input type="number" value={order} onChange={(e) => setOrder(Number(e.target.value))} className="w-full px-3 py-2 border rounded-lg" />
        </div>
        <div className="flex gap-2 justify-end">
          <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button>
          <button type="submit" disabled={saving} className="px-4 py-2 bg-primary text-white rounded-lg disabled:opacity-50">Save</button>
        </div>
      </form>
    </Modal>
  );
}

export function SubjectForm({ moduleId, subject, onSave, onClose }) {
  const [name, setName] = useState(subject?.name ?? '');
  const [order, setOrder] = useState(subject?.order ?? 1);
  const [saving, setSaving] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (subject?._id) await api.put(`/admin/subjects/${subject._id}`, { name, order });
      else await api.post(`/admin/modules/${moduleId}/subjects`, { name, order });
      onSave?.();
      onClose?.();
    } catch (_) {}
    setSaving(false);
  };
  return (
    <Modal open onClose={onClose} title={subject ? 'Edit Subject' : 'Add Subject'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-3 py-2 border rounded-lg" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
          <input type="number" value={order} onChange={(e) => setOrder(Number(e.target.value))} className="w-full px-3 py-2 border rounded-lg" />
        </div>
        <div className="flex gap-2 justify-end">
          <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button>
          <button type="submit" disabled={saving} className="px-4 py-2 bg-primary text-white rounded-lg disabled:opacity-50">Save</button>
        </div>
      </form>
    </Modal>
  );
}

export function TopicForm({ subjectId, topic, onSave, onClose }) {
  const [name, setName] = useState(topic?.name ?? '');
  const [order, setOrder] = useState(topic?.order ?? 1);
  const [videoUrl, setVideoUrl] = useState(topic?.videoUrl ?? '');
  const [content, setContent] = useState(topic?.content ?? '');
  const [saving, setSaving] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (topic?._id) await api.put(`/admin/topics/${topic._id}`, { name, order, videoUrl, content });
      else await api.post(`/admin/subjects/${subjectId}/topics`, { name, order, videoUrl, content });
      onSave?.();
      onClose?.();
    } catch (_) {}
    setSaving(false);
  };
  return (
    <Modal open onClose={onClose} title={topic ? 'Edit Topic' : 'Add Topic'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-3 py-2 border rounded-lg" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
          <input type="number" value={order} onChange={(e) => setOrder(Number(e.target.value))} className="w-full px-3 py-2 border rounded-lg" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">YouTube video URL</label>
          <input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} className="w-full px-3 py-2 border rounded-lg" placeholder="https://youtube.com/..." />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Content (optional)</label>
          <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={3} className="w-full px-3 py-2 border rounded-lg" />
        </div>
        <div className="flex gap-2 justify-end">
          <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button>
          <button type="submit" disabled={saving} className="px-4 py-2 bg-primary text-white rounded-lg disabled:opacity-50">Save</button>
        </div>
      </form>
    </Modal>
  );
}
