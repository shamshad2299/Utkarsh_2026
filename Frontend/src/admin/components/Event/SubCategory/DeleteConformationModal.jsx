const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, itemName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-md p-6 bg-white rounded-2xl shadow-xl"
        onClick={(e) => e.stopPropagation()} // 🔥 FIX
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Confirm Delete</h3>
          <button onClick={onClose}>✕</button>
        </div>

        <p className="text-gray-600">
          Are you sure you want to delete
          <span className="font-semibold"> "{itemName}"</span>?
        </p>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 border rounded-lg py-2 text-amber-600 cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              onConfirm();   // ✅ now works
              onClose();
            }}
            className="flex-1 bg-red-600 text-white rounded-lg py-2 cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
export default DeleteConfirmationModal