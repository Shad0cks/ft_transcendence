import React, { useState, useEffect } from 'react';
import Chat from '../../components/Chat';
import '../../css/Pages/Channel.css';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import ListGroup from 'react-bootstrap/ListGroup';
import {useNavigate} from 'react-router-dom';
import Header from '../HomePage/Header';

const popover  =  (elem: number) => (
  <Popover id="popover-basic">
    <Popover.Header as="h3">Player Name</Popover.Header>
    <Popover.Body>
      <Button variant="success">Game</Button>{' '} 
      <Button variant="primary">DM</Button>
    </Popover.Body>
  </Popover>
);
const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

export default function Channel() {
  const navigate = useNavigate();
  const [playerClicked, setPlayerClicked] = useState<number>();

  function clickPlayer(e: React.MouseEvent, playerClickID: number) {
    e.preventDefault();
    if (playerClickID === playerClicked) setPlayerClicked(-1);
    else setPlayerClicked(playerClickID);
  }

  useEffect(() => {
    setPlayerClicked(-1);
  }, []);

  function needShowInfo(playerID: number): boolean {
    return playerID === playerClicked;
  }

  return (
    <div>
      <Header username='helo'/>
      <div className= "btnCont">
        <h1 className= "txtChannel">Chat Room</h1>
        <div className="ChannelContainer">
          <Chat />
          <div
            className="playerList"
            style={
              playerClicked === -1 ? { overflow: 'scroll' } : { overflow: 'hidden' }
            }
          >
            <ListGroup variant="flush">
              {array.map((elem) => (
                <ListGroup.Item key={elem} onClick={(e) => clickPlayer(e, elem)} style={playerClicked === -1 || playerClicked === elem ? {cursor:"pointer"} :  {cursor:""}}>    
                  <OverlayTrigger
                    show={needShowInfo(elem)}
                    trigger="click"
                    placement="bottom"  
                    overlay={popover(elem)}
                  >
                    <span
                      style={playerClicked === elem ? {color: "red"} : {color: "black"}} 
                      onMouseOver={(e) => e.preventDefault()}
                      className="playerListItem"
                    >
                      {'Player ' + elem}
                    </span>
                  </OverlayTrigger> 
                </ListGroup.Item> 
              ))}
            </ListGroup>
          </div>
        </div>
        <Button  onClick={() => {navigate('/channelManager')}} variant="success">Manage Channels</Button> 
      </div> 
    </div>
  );
}
