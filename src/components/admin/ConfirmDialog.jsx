export default function ConfirmDialog({
  open,
  onClose,
  title = 'Confirm',
  message,
  confirmLabel = 'Delete',
  onConfirm,
  danger = true,
}) {
  if (!open) return null;
  const handleConfirm = () => {
    onConfirm?.();
    onClose();
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-xl max-w-sm w-full p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-heading font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-sm text-gray-600 mb-4">{message}</p>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className={`px-3 py-2 text-sm font-medium rounded-lg ${danger ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-primary text-white hover:bg-primary/90'}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
