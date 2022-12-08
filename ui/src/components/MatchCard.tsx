import { Image, ListGroup } from 'react-bootstrap';

interface MatchProps {
  nickname1: string;
  avatar1: string;
  score1: number;
  nickname2: string;
  avatar2: string;
  score2: number;
  created_at: Date;
}

export function MatchCard(props: MatchProps) {
  return (
    <ListGroup.Item>
      <Image
        style={{ width: '50px', height: '50px', cursor: 'pointer' }}
        src={props.avatar1}
        roundedCircle
      />{' '}
      {props.nickname1} {props.score1} - {props.score2} {props.nickname2}{' '}
      <Image
        style={{ width: '50px', height: '50px', cursor: 'pointer' }}
        src={props.avatar2}
        roundedCircle
      />
    </ListGroup.Item>
  );
}
