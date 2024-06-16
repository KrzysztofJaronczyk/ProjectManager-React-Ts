import React from 'react';
import { ToastContainer, toast, ToastContent, ToastOptions, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  message: ToastContent;
  type: ToastType;
}

export const showToast = (message: ToastContent, type: ToastType = 'info', options?: ToastOptions) => {
  toast(message, {
    type,
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'dark',
    transition: Slide,
    ...options,
  });
};

const ToastNotification: React.FC = () => {
  return <ToastContainer />;
};

export default ToastNotification;
