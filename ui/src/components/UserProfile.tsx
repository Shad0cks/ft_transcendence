import React, { useEffect, useState } from 'react';
import { GetUserIt } from '../models/getUser';
import { UserCard } from './UserCard';
import { SnackbarHook } from '../customHooks/useSnackbar';
import { useIsFriend } from '../customHooks/useIsFriend.hook';
import { socket, statusMap } from '../services/socket';

interface UserProfileProps {
  searchedUser: GetUserIt | undefined | null;
  user: GetUserIt | undefined;
  snackbar: SnackbarHook;
}

export default function UserProfile(props: UserProfileProps) {
  const isFriend = useIsFriend(
    props.user!.nickname,
    props.searchedUser!.nickname,
  );
  const [status, setStatus] = useState<string>('');

  useEffect(() => {
    if (!statusMap.get(props.searchedUser!.nickname)) {
      setStatus('Offline');
    } else {
      setStatus(statusMap.get(props.searchedUser!.nickname)!);
    }
  }, [status, props.searchedUser]);

  socket?.on('StatusUpdate', function (e: any) {
    setStatus('');
  });

  if (props.searchedUser === undefined || props.searchedUser === null) {
    return <div></div>;
  }
  return (
    <UserCard
      user={props.searchedUser}
      snackbar={props.snackbar}
      isFriend={isFriend}
      loggedUser={props.user!}
      status={status}
    />
  );
}
