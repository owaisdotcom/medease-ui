import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { BookOpen, User, CreditCard, FileText } from 'lucide-react';

export default function StudentDashboard() {
  const { user } = useAuth();

  return (
    <section className="py-12 container mx-auto px-4">
      <h1 className="text-2xl font-heading font-bold text-gray-900 mb-2">Dashboard</h1>
      <p className="text-gray-600 mb-8">Welcome back, {user?.name}.</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link
          to="/student/resources"
          className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-primary/50 hover:shadow-md transition-all"
        >
          <BookOpen className="w-8 h-8 text-primary" />
          <div>
            <span className="font-semibold text-gray-900">My resources</span>
            <p className="text-sm text-gray-500">Topics & OSPEs</p>
          </div>
        </Link>
        <Link
          to="/student/profile"
          className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-primary/50 hover:shadow-md transition-all"
        >
          <User className="w-8 h-8 text-primary" />
          <div>
            <span className="font-semibold text-gray-900">Profile</span>
            <p className="text-sm text-gray-500">Info & attempts</p>
          </div>
        </Link>
        <Link
          to="/student/packages"
          className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-primary/50 hover:shadow-md transition-all"
        >
          <CreditCard className="w-8 h-8 text-primary" />
          <div>
            <span className="font-semibold text-gray-900">Packages</span>
            <p className="text-sm text-gray-500">Apply & subscribe</p>
          </div>
        </Link>
        <Link
          to="/student/payments"
          className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-primary/50 hover:shadow-md transition-all"
        >
          <FileText className="w-8 h-8 text-primary" />
          <div>
            <span className="font-semibold text-gray-900">Payments</span>
            <p className="text-sm text-gray-500">Receipts & status</p>
          </div>
        </Link>
      </div>
      <div className="mt-8 p-4 bg-primary/10 rounded-xl">
        <p className="text-sm text-gray-700">
          {user?.packages?.length ? (
            <>You have access to {user.packages.length} package(s). Open <Link to="/student/resources" className="text-primary font-medium">Resources</Link> to start.</>
          ) : user?.freeTrialUsed ? (
            <>You used your free trial. Purchase a package for full access.</>
          ) : (
            <>Try one topic free, or <Link to="/student/packages" className="text-primary font-medium">apply for a package</Link>.</>
          )}
        </p>
      </div>
    </section>
  );
}
