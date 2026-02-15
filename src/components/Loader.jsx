import { Loader2 } from 'lucide-react';

export default function Loader() {
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/20 backdrop-blur-[2px]"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex flex-col items-center gap-3 rounded-2xl bg-white px-8 py-6 shadow-xl">
        <Loader2 className="h-10 w-10 animate-spin text-primary" aria-hidden="true" />
        <span className="text-sm font-medium text-gray-600">Loading...</span>
      </div>
    </div>
  );
}
