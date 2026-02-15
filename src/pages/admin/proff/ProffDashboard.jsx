import { Link } from 'react-router-dom';
import { BookOpen, Building2 } from 'lucide-react';

export default function ProffDashboard() {
  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-heading font-bold text-gray-900">Proff structure</h1>
        <p className="text-sm text-gray-500 mt-1">Two main Proff types. Choose one to manage.</p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 max-w-3xl">
        <Link
          to="/admin/proff/jsmu"
          className="flex items-start gap-4 p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-primary/30 transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20">
            <BookOpen className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="font-heading font-semibold text-gray-900 group-hover:text-primary">JSMU</h2>
            <p className="text-sm text-gray-500 mt-0.5">Year-wise: Paper 1, Paper 2, OSPE 1, OSPE 2</p>
            <span className="inline-block mt-2 text-sm font-medium text-primary">Manage →</span>
          </div>
        </Link>
        <Link
          to="/admin/proff/other"
          className="flex items-start gap-4 p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-primary/30 transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20">
            <Building2 className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="font-heading font-semibold text-gray-900 group-hover:text-primary">Other University</h2>
            <p className="text-sm text-gray-500 mt-0.5">Years → subject-wise Mix MCQs and OSPE</p>
            <span className="inline-block mt-2 text-sm font-medium text-primary">Manage →</span>
          </div>
        </Link>
      </div>
    </>
  );
}
