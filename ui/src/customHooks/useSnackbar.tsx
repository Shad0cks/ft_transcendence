import { AlertColor } from '@mui/material';
import { useState } from 'react';

export interface SnackbarHook {
  open: boolean;
  message: string;
  severity: AlertColor;
  setOpen: (c: boolean) => void;
  setMessage: (c: string) => void;
  setSeverity: (c: AlertColor) => void;
}

export default function useSnackbar() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<AlertColor>('success');
  const snackbar: SnackbarHook = {
    open: open,
    message: message,
    severity: severity,
    setOpen: setOpen,
    setMessage: setMessage,
    setSeverity: setSeverity,
  };

  return snackbar;
}
