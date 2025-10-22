import { createRoot } from 'react-dom/client';
import React from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';

// Global alert state
let globalAlertRoot: any = null;
let globalAlertContainer: HTMLElement | null = null;
let isAlertOpen = false;

const createAlertContainer = () => {
  if (globalAlertContainer) return globalAlertContainer;
  
  globalAlertContainer = document.createElement('div');
  globalAlertContainer.id = 'global-alert-container';
  globalAlertContainer.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 9999;
    pointer-events: none;
  `;
  document.body.appendChild(globalAlertContainer);
  
  globalAlertRoot = createRoot(globalAlertContainer);
  return globalAlertContainer;
};

// Clean up alert
export const cleanupGlobalAlert = () => {
  if (globalAlertRoot) {
    globalAlertRoot.unmount();
    globalAlertRoot = null;
  }
  
  if (globalAlertContainer && document.body.contains(globalAlertContainer)) {
    document.body.removeChild(globalAlertContainer);
    globalAlertContainer = null;
  }
  
  isAlertOpen = false;
};

// Show token expired alert
export const showTokenExpiredAlert = (onConfirm: () => void | Promise<void>) => {
  if (isAlertOpen) return;
  
  isAlertOpen = true;
  createAlertContainer();
  
  if (globalAlertRoot) {
    const AlertComponent = React.createElement(TokenExpiredAlertComponent, {
      onConfirm: async () => {
        cleanupGlobalAlert();
        await onConfirm();
      }
    });
    
    globalAlertRoot.render(AlertComponent);
  }
};

// Token Expired Alert Component - Modern Black & White Design
const TokenExpiredAlertComponent: React.FC<{ onConfirm: () => void | Promise<void> }> = ({ onConfirm }) => {
  const [open, setOpen] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    setOpen(false);
    
    setTimeout(async () => {
      try {
        await onConfirm();
      } catch (error) {
        console.error('Alert confirm error:', error);
      } finally {
        setIsLoading(false);
      }
    }, 200);
  };

  return React.createElement(AlertDialog, {
    open: open,
    onOpenChange: (isOpen: boolean) => {
      if (!isOpen) return;
    }
  }, React.createElement(AlertDialogContent, {
    className: "max-w-md border-0 shadow-2xl bg-white dark:bg-gray-950 rounded-2xl p-0 overflow-hidden"
  }, [
    React.createElement('div', {
      key: 'header-bg',
      className: "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark:from-gray-800 dark:via-gray-900 dark:to-black px-6 pt-8 pb-6"
    }, [
      React.createElement('div', {
        key: 'icon-wrapper',
        className: "flex justify-center mb-4"
      }, React.createElement('div', {
        className: "w-16 h-16 bg-white dark:bg-gray-100 rounded-full flex items-center justify-center shadow-lg ring-2 ring-white/20"
      }, React.createElement('svg', {
        className: "w-8 h-8 text-gray-900",
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24",
        xmlns: "http://www.w3.org/2000/svg"
      }, [
        React.createElement('path', {
          key: 'path1',
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: 2,
          d: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
        })
      ]))),
      
      React.createElement(AlertDialogTitle, {
        key: 'title',
        className: "text-2xl font-bold text-white text-center mb-2"
      }, 'เซสชันหมดอายุ'),
      
      React.createElement(AlertDialogDescription, {
        key: 'description',
        className: "text-gray-300 dark:text-gray-400 text-center text-sm leading-relaxed"
      }, 'กรุณาเข้าสู่ระบบใหม่อีกครั้ง เพื่อความปลอดภัยของข้อมูลของคุณ')
    ]),
    
    // Footer with action button
    React.createElement(AlertDialogFooter, {
      key: 'footer',
      className: "px-6 py-6 bg-gray-50 dark:bg-gray-900/50"
    }, React.createElement(AlertDialogAction, {
      onClick: handleConfirm,
      disabled: isLoading,
      className: "w-full bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 dark:text-gray-900 text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
    }, isLoading ? 'กำลังออกจากระบบ...' : 'เข้าสู่ระบบใหม่'))
  ]));
};


export const handleTokenExpired = async (
  signOut: any,
  isSigningOut: { current: boolean },
  isTokenExpiredAlertShowing: { current: boolean }
) => {
  showTokenExpiredAlert(async () => {
    try {
      await signOut({ redirect: false });
      
      setTimeout(() => {
        window.location.replace('/login');
      }, 300);
    } catch (err) {
      console.error("SignOut error:", err);
      // Force redirect แม้เกิด error
      window.location.replace('/login');
    } finally {
      // Reset flag หลัง 2 วินาที
      setTimeout(() => {
        isSigningOut.current = false;
        isTokenExpiredAlertShowing.current = false;
      }, 2000);
    }
  });
};