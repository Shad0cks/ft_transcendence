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
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#282c34',
        }}
      >
        {getUserProfile()}
      </div>
    </Popup>
  );
}
