import { Button, Card, ButtonGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { SnackbarHook } from '../customHooks/useSnackbar';
import { GetUserIt } from '../models/getUser';
import { addFriend } from '../services/Friends/addFriend';
import { deleteFriend } from '../services/Friends/removeFriend';
import '../css/Components/UserProfile.css';

interface UserCardProps {
  user: GetUserIt;
  loggedUser: GetUserIt;
  snackbar: SnackbarHook;
  isFriend: boolean;
  status: string;
}

export function UserCard(props: UserCardProps) {
  const navigate = useNavigate();
  let getFriendButton;

  if (props.isFriend) {
    getFriendButton = () => (
      <Button
        variant="danger"
        onClick={() =>
          deleteFriend(
            props.user.nickname,
            props.loggedUser!.nickname,
            props.snackbar,
            navigate,
          )
        }
      >
        Delete friend
      </Button>
    );
  } else {
    getFriendButton = () => (
      <Button
        variant="success"
        onClick={() =>
          addFriend(
            props.user.nickname,
            props.loggedUser!.nickname,
            props.snackbar,
            navigate,
          )
        }
      >
        Add friend
      </Button>
    );
  }
  return (
    <Card style={{ boxShadow: '-1px 1px 9px 2px rgba(0,0,0,0.8)' }}>
      <Card.Img
        height={300}
        width={300}
        variant="top"
        src={props.user.avatar}
      />
      <Card.Body className="cardBody">
        <div className="nameCont">
          <Card.Title>{props.user.nickname}</Card.Title>
          <span className={'dot ' + props.status}></span>
        </div>
        <Card.Text>
          Wins : {props.user.wins} / Losses: {props.user.losses}
        </Card.Text>
        <ButtonGroup aria-label="Basic example">
          {getFriendButton()}
        </ButtonGroup>
      </Card.Body>
    </Card>
  );
}
