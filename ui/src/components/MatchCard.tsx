import { Image, ListGroup } from 'react-bootstrap';
import { AiFillTrophy } from 'react-icons/ai';
interface MatchProps {
  nickname1: string;
  avatar1: string;
  score1: number;
  nickname2: string;
  avatar2: string;
  score2: number;
  created_at: Date;
  winner: string;
}

export function MatchCard(props: MatchProps) {
  return (
    <ListGroup.Item>
      <Image
        style={{ width: '50px', height: '50px', cursor: 'pointer' }}
        src={props.avatar1}
        roundedCircle
      />{' '}
      {props.winner === props.nickname1 ? (
        <AiFillTrophy color="#D68910" />
      ) : null}{' '}
      {props.nickname1} {props.score1} - {props.score2} {props.nickname2}{' '}
      {props.winner === props.nickname2 ? (
        <AiFillTrophy color="#D68910" />
      ) : null}
      <Image
        style={{ width: '50px', height: '50px', cursor: 'pointer' }}
        src={props.avatar2}
        roundedCircle
      />
    </ListGroup.Item>
  );
}
