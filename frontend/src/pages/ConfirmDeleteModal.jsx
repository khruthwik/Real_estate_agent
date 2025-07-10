import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, AlertTriangle, Loader2 } from 'lucide-react';

const ConfirmDeleteModal = ({ event, onClose, onConfirmDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    await onConfirmDelete(); // Call the parent's delete function
    // The parent will handle closing this modal and refreshing data
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8, y: -50 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", damping: 20, stiffness: 300 } },
    exit: { opacity: 0, scale: 0.8, y: 50, transition: { duration: 0.2 } },
  };

  if (!event) return null; // Should not happen if passed correctly, but for safety

  return (
    <motion.div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 font-['Outfit',_sans-serif']"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-gray-900 rounded-3xl p-6 sm:p-8 shadow-3xl border border-gray-800 w-full max-w-sm max-h-[90vh] overflow-y-auto custom-scrollbar-dark"
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-800 mb-6">
          <h2 className="text-2xl font-bold text-gray-50 flex items-center">
            <AlertTriangle className="w-6 h-6 mr-3 text-red-500" />
            Confirm Deletion
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-800 transition-colors text-gray-400 hover:text-gray-50"
            aria-label="Close modal"
            disabled={isDeleting}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="text-gray-300 text-base mb-6">
          <p className="mb-4">Are you sure you want to delete the event:</p>
          <p className="font-semibold text-gray-50 text-lg">"{event.title}"</p>
          <p className="text-sm text-gray-400 mt-2">
            This action cannot be undone.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 transition-colors text-sm font-medium"
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="px-6 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors shadow-md flex items-center justify-center space-x-2"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <span>Delete</span>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ConfirmDeleteModal;
