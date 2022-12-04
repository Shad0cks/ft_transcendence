import { Button, Card, ButtonGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { SnackbarHook } from '../customHooks/useSnackbar';
import { GetUserIt } from '../models/getUser';
import { addFriend } from '../services/Friends/addFriend';
import { deleteFriend } from '../services/Friends/removeFriend';

interface UserCardProps {
  user: GetUserIt;
  loggedUser: GetUserIt;
  snackbar: SnackbarHook;
  isFriend: boolean;
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
    <Card style={{ width: '18rem' }} border="primary">
      <Card.Img variant="top" src={props.user.avatar} />
      <Card.Body className="cardBody">
        <Card.Title>{props.user.nickname}</Card.Title>
        <Card.Text>
          Wins : {props.user.wins} / Losses: {props.user.losses}
        </Card.Text>
        <ButtonGroup aria-label="Basic example">
          <Button variant="secondary">Play</Button>
          <Button variant="secondary">Profile</Button>
          <Button variant="secondary">DM</Button>
          <span
            style={{
              color: 'red',
              marginRight: '.05em',
              display: 'inline-block',
            }}
          >
            &nbsp;
          </span>
          {getFriendButton()}
        </ButtonGroup>
      </Card.Body>
    </Card>
  );
}
