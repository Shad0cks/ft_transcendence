import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertColor, AlertProps } from '@mui/material/Alert';
import { socket } from '../services/socket';

interface SnackbarProps {
  open: boolean;
  setOpen: (c: boolean) => void;
  severity: AlertColor;
  message: string;
  senderInvite: string | undefined;
  username: string | undefined;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function TSSnackbar(props: SnackbarProps) {
  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    props.setOpen(false);
  };

  const joinGame = () => {
    if (props.severity === 'warning')
      socket.emit('InvitationAccepted', {
        InvitationSender: props.senderInvite,
        InvitationReceiver: props.username,
      });
  };

  return (
    <div>
      <Snackbar
        autoHideDuration={props.severity === 'warning' ? 10000 : 6000}
        onClose={handleClose}
        open={props.open}
      >
        <Alert
          onClose={handleClose}
          style={props.severity === 'warning' ? { cursor: 'pointer' } : {}}
          severity={props.severity}
          sx={{ width: '100%' }}
        >
          <div onClick={joinGame}>{props.message}</div>
        </Alert>
      </Snackbar>
    </div>
  );
}
