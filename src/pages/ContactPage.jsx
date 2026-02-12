import { useState } from 'react';
import api from '../api/client';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await api.post('/contact', form);
      setStatus('sent');
      setForm({ name: '', email: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <section className="py-12 sm:py-16 container mx-auto px-4">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-heading font-bold text-gray-900 text-center mb-2">Contact Us</h1>
        <p className="text-gray-600 font-body text-center mb-8">Send us a message and we will get back to you.</p>
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea
              required
              rows={5}
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
          {status === 'sent' && <p className="text-green-600 text-sm">Message sent successfully.</p>}
          {status === 'error' && <p className="text-red-600 text-sm">Failed to send. Try again.</p>}
          <button
            type="submit"
            disabled={status === 'sending'}
            className="w-full bg-gradient-to-r from-primary to-primary/90 text-white font-heading font-semibold py-3 rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
          >
            {status === 'sending' ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
    </section>
  );
}
