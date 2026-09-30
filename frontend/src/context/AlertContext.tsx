import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { ThemeAlertModal, AlertVariant } from '../components/common/ThemeAlertModal';

export interface AlertOptions {
  title?: string;
  message: string;
  variant?: AlertVariant;
  primaryActionText?: string;
  onPrimaryAction?: () => void;
  secondaryActionText?: string;
  onSecondaryAction?: () => void;
  showCancelButton?: boolean;
  cancelText?: string;
}

interface AlertContextType {
  showAlert: (options: AlertOptions | string) => void;
  showAuthPrompt: (message?: string) => void;
  hideAlert: () => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    options: AlertOptions;
  }>({
    isOpen: false,
    options: {
      message: '',
      variant: 'info',
    },
  });

  const hideAlert = useCallback(() => {
    setModalState((prev) => ({
      ...prev,
      isOpen: false,
    }));
  }, []);

  const showAlert = useCallback((options: AlertOptions | string) => {
    if (typeof options === 'string') {
      // Check if the message is auth-related
      const isAuthText = /sign\s*in|log\s*in|authenticated/i.test(options);
      setModalState({
        isOpen: true,
        options: {
          title: isAuthText ? 'Sign In Required' : 'Notification',
          message: options,
          variant: isAuthText ? 'auth' : 'info',
        },
      });
    } else {
      setModalState({
        isOpen: true,
        options,
      });
    }
  }, []);

  const showAuthPrompt = useCallback(
    (message: string = 'Please sign in to ask problems or participate in discussions!') => {
      showAlert({
        title: 'Sign In Required',
        message,
        variant: 'auth',
        primaryActionText: 'Sign In to Continue',
        secondaryActionText: 'Create Free Account',
      });
    },
    [showAlert]
  );

  // Seamlessly intercept window.alert so even unexpected native alerts become theme popups
  useEffect(() => {
    const originalAlert = window.alert;

    window.alert = (msg?: any) => {
      const messageStr = String(msg ?? '');
      showAlert(messageStr);
    };

    return () => {
      window.alert = originalAlert;
    };
  }, [showAlert]);

  return (
    <AlertContext.Provider value={{ showAlert, showAuthPrompt, hideAlert }}>
      {children}
      <ThemeAlertModal
        isOpen={modalState.isOpen}
        onClose={hideAlert}
        title={modalState.options.title}
        message={modalState.options.message}
        variant={modalState.options.variant}
        primaryActionText={modalState.options.primaryActionText}
        onPrimaryAction={modalState.options.onPrimaryAction}
        secondaryActionText={modalState.options.secondaryActionText}
        onSecondaryAction={modalState.options.onSecondaryAction}
        showCancelButton={modalState.options.showCancelButton}
        cancelText={modalState.options.cancelText}
      />
    </AlertContext.Provider>
  );
};

export const useAlert = (): AlertContextType => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};

export default AlertProvider;
