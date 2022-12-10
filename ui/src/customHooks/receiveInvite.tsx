import { useEffect, useState } from 'react';
import { socket } from '../services/socket';
import { SnackbarHook } from './useSnackbar';

export default function useReceiveInvite(snackbar: SnackbarHook) {
  const [sender, setSender] = useState<string>();
  useEffect(() => {
    socket.on('InvitationGame', (InvitationSender: string) => {
      setSender(InvitationSender);
      snackbar.setMessage(
        'Game Invite by ' + InvitationSender + ' | click to accepte',
      );
      snackbar.setSeverity('warning');
      snackbar.setOpen(true);
    });
  }, [socket]); // eslint-disable-line react-hooks/exhaustive-deps

  return sender;
}
