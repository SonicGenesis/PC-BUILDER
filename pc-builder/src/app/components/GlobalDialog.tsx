"use client";
import React from 'react';
import { createContext, useContext, useState } from 'react';
import { FiX, FiAlertCircle, FiCheckCircle, FiHelpCircle } from 'react-icons/fi';

type DialogType = 'success' | 'error' | 'confirm' | 'alert';

export interface DialogOptions {
  title?: string;
  message: string | React.ReactNode;
  type?: DialogType;
  onConfirm?: () => void;
  onCancel?: () => void;
}

interface DialogContextType {
  showDialog: (options: DialogOptions) => void;
  hideDialog: () => void;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export function DialogProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [dialogOptions, setDialogOptions] = useState<DialogOptions | null>(null);

  const showDialog = (options: DialogOptions) => {
    setDialogOptions(options);
    setIsOpen(true);
  };

  const hideDialog = () => {
    setIsOpen(false);
    setTimeout(() => setDialogOptions(null), 200); // Clear after animation
  };

  const handleConfirm = () => {
    dialogOptions?.onConfirm?.();
    hideDialog();
  };

  const handleCancel = () => {
    dialogOptions?.onCancel?.();
    hideDialog();
  };

  const getIcon = () => {
    switch (dialogOptions?.type) {
      case 'success':
        return <FiCheckCircle className="w-6 h-6 text-green-500" />;
      case 'error':
        return <FiAlertCircle className="w-6 h-6 text-red-500" />;
      case 'confirm':
        return <FiHelpCircle className="w-6 h-6 text-blue-500" />;
      default:
        return <FiAlertCircle className="w-6 h-6 text-yellow-500" />;
    }
  };

  return (
    <DialogContext.Provider value={{ showDialog, hideDialog }}>
      {children}
      {/* Dialog Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/50 transition-opacity"
              onClick={handleCancel}
            />

            {/* Dialog Panel */}
            <div 
              className={`
                relative bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6
                transform transition-all duration-200
                ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
              `}
            >
              {/* Close Button */}
              <button
                onClick={hideDialog}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
              >
                <FiX className="w-5 h-5" />
              </button>

              {/* Content */}
              <div className="flex items-center gap-4">
                {getIcon()}
                <div className="flex-1">
                  {dialogOptions?.title && (
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      {dialogOptions.title}
                    </h3>
                  )}
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {dialogOptions?.message}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex justify-end gap-3">
                {(dialogOptions?.type === 'confirm') && (
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                )}
                <button
                  onClick={handleConfirm}
                  className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2
                    ${dialogOptions?.type === 'error' ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' :
                    dialogOptions?.type === 'success' ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500' :
                    'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'}`}
                >
                  {dialogOptions?.type === 'confirm' ? 'Confirm' : 'OK'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DialogContext.Provider>
  );
}

export function useDialog() {
  const context = useContext(DialogContext);
  if (context === undefined) {
    throw new Error('useDialog must be used within a DialogProvider');
  }
  return context;
} 