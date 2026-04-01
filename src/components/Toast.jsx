import React from "react";
import { Toaster, toast } from "sonner";

export { toast };

export const ToastProvider = () => {
  return (
    <Toaster
      position="top-right"
      theme="light"
      richColors
      closeButton
      duration={4000}
    />
  );
};
