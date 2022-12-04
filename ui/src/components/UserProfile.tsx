import React from 'react';
import { GetUserIt } from '../models/getUser';
import { UserCard } from './UserCard';
import { SnackbarHook } from '../customHooks/useSnackbar';
import { useIsFriend } from '../customHooks/useIsFriend.hook';

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

  if (props.searchedUser === undefined || props.searchedUser === null) {
    return <div></div>;
  }
  return (
    <div className="containerRow">
      <UserCard
        user={props.searchedUser}
        snackbar={props.snackbar}
        isFriend={isFriend}
        loggedUser={props.user!}
      />
    </div>
  );
}
