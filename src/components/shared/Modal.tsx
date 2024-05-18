import React from 'react';
import ReactDOM from 'react-dom';
import { XMarkIcon } from '@heroicons/react/24/outline'; // Change import to XIcon

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  if (!isOpen) return null;

  const handleClose = () => {
    onClose();
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded-md w-3/4 relative">
        <button
          className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full bg-red-500 text-white"
          onClick={handleClose}
        >
          <XMarkIcon className="w-4 h-4" />
        </button>
        {children}
      </div>
    </div>,
    document.getElementById('root') as HTMLElement,
  );
};

export default Modal;