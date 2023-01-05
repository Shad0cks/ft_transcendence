import Popup from 'reactjs-popup';
import { SnackbarHook } from '../customHooks/useSnackbar';
import { GetUserIt } from '../models/getUser';
import UserProfile from './UserProfile';

interface ModalUserProfileProps {
  searchedUser: GetUserIt | undefined | null;
  user: GetUserIt | undefined;
  snackbar: SnackbarHook;
  open: boolean;
  setOpen: (c: boolean) => void;
}

export function ModalUserProfile(props: ModalUserProfileProps) {
  let getUserProfile;
  const contentStyle = { border: 'none', padding: '0', width: 'auto' };
  if (!props.searchedUser) {
    getUserProfile = () => {
      return <div></div>;
    };
  } else {
    getUserProfile = () => {
      return (
        <UserProfile
          searchedUser={props.searchedUser}
          user={props.user}
          snackbar={props.snackbar}
        />
      );
    };
  }
  return (
    <Popup
      open={props.open}
      closeOnDocumentClick
      onClose={() => props.setOpen(false)}
      {...{ contentStyle }}
    >
      <div>{getUserProfile()}</div>
    </Popup>
  );
}
