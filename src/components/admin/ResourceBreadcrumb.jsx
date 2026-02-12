import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function ResourceBreadcrumb({ items }) {
  return (
    <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6 flex-wrap">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-2">
          {i > 0 && <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />}
          {item.path ? (
            <Link to={item.path} className="hover:text-primary transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
