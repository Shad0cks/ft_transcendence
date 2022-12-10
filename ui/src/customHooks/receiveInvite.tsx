import { useEffect, useState } from 'react';
import { NavigateFunction } from 'react-router-dom';
import { socket } from '../services/socket';
import { SnackbarHook } from './useSnackbar';

export default function useReceiveInvite(snackbar: SnackbarHook, navigate: NavigateFunction) {
  const [sender, setSender] = useState<string>();

  useEffect(() => {
    socket.on('FindGame', (gameID: string) => {
      localStorage.removeItem('searcheGame');
      navigate('/game_' + gameID, { state: { gameid: gameID } });
    });
  }, [socket]); // eslint-disable-line react-hooks/exhaustive-deps

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
