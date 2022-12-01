import React, { useState, useEffect } from 'react';
import Chat from '../../components/Chat';
import '../../css/Pages/Channel.css';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import ListGroup from 'react-bootstrap/ListGroup';
import { useNavigate } from 'react-router-dom';
import Header from '../HomePage/Header';
import { GetUserInfo } from '../../services/User/getUserInfo';
import { GetUserIt } from '../../models/getUser';
import { UserLogout } from '../../services/User/userDelog';
import { GetInChannels } from '../../services/Channel/getInChannels';
import { ChannelDTO } from '../../models/channel';
import socketIOClient, { Socket } from 'socket.io-client';

const popover = (elem: number) => (
  <Popover id="popover-basic">
    <Popover.Header as="h3">Player Name</Popover.Header>
    <Popover.Body>
      <Button variant="success">Game</Button>{' '}
      <Button variant="primary">DM</Button>
    </Popover.Body>
  </Popover>
);

export default function Channel() {
  const navigate = useNavigate();
  const [playerClicked, setPlayerClicked] = useState<number>();
  const [username, setUsername] = useState<string | null>(null);
  const [user, setUser] = useState<GetUserIt>();
  const [channelUsersList, setChannelUsersList] = useState<ChannelDTO[]>([]);
  const [channelSelected, setChannelSelected] = useState<number>();
  const [usersInChannel, setUsersInChannel] = useState<string[]>([]);
  const [socket, setSocket] = useState<Socket>();

  function clickPlayer(e: React.MouseEvent, playerClickID: number) {
    e.preventDefault();
    if (playerClickID === playerClicked) setPlayerClicked(-1);
    else setPlayerClicked(playerClickID);
  }

  function selectChannel(channelID: number) {
    setChannelSelected(channelID);
  }

  async function getListInChannel() {
    const requete = await GetInChannels();
    if (requete.status === 401) {
      await UserLogout();
      navigate('/');
    }
    const txt = await requete.text();
    return JSON.parse(txt);
  }

  useEffect(() => {
    setSocket(
      socketIOClient('http://localhost:8080', { withCredentials: true }),
    );
    setPlayerClicked(-1);
    const usernameStorage = localStorage.getItem('nickname');
    setUsername(usernameStorage);
    if (usernameStorage === null) navigate('/');
    else
      GetUserInfo(localStorage.getItem('nickname')!).then(async (e) => {
        if (e.status === 401) {
          await UserLogout();
          navigate('/');
        } else if (e.ok) e.text().then((i) => setUser(JSON.parse(i)));
      });
    getListInChannel().then((e) => {
      setChannelUsersList(e);
      setChannelSelected(e[0].id);
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    socket?.on('connect', () => {
      socket?.on('GetUserFromChannel', (users: string[]) => {
        console.log('usrs:', users);
        setUsersInChannel(users);
      });
    });

    return () => {
      socket?.off('connect');
      socket?.off('GetUserFromChannel');
    };
  }, [socket]);

  useEffect(() => {
    socket?.emit(
      'GetUserFromChannel',
      channelUsersList.find((x) => x.id === channelSelected)?.name,
    );
  }, [channelSelected]); // eslint-disable-line react-hooks/exhaustive-deps

  function needShowInfo(playerID: number): boolean {
    return playerID === playerClicked;
  }

  return username ? (
    <div>
      <Header username={username} iconUser={user?.avatar} />
      <div className="btnCont">
        <h1 className="txtChannel">Chat Room</h1>
        <div className="ChannelContainer">
          <Chat
            channelList={channelUsersList}
            selectChannel={selectChannel}
            channelSelected={channelSelected}
          />
          <div
            className="playerList"
            style={
              playerClicked === -1
                ? { overflow: 'scroll' }
                : { overflow: 'hidden' }
            }
          >
            <ListGroup variant="flush">
              {usersInChannel.length >= 1
                ? usersInChannel.map((elem, id) => (
                    <ListGroup.Item
                      key={id}
                      onClick={(e: React.MouseEvent) => clickPlayer(e, id)}
                      style={
                        playerClicked === -1 || playerClicked === id
                          ? { cursor: 'pointer' }
                          : { cursor: '' }
                      }
                    >
                      <OverlayTrigger
                        show={needShowInfo(id)}
                        trigger="click"
                        placement="bottom"
                        overlay={popover(id)}
                      >
                        <span
                          style={
                            playerClicked === id
                              ? { color: 'red' }
                              : { color: 'black' }
                          }
                          onMouseOver={(e) => e.preventDefault()}
                          className="playerListItem"
                        >
                          {elem}
                        </span>
                      </OverlayTrigger>
                    </ListGroup.Item>
                  ))
                : null}
            </ListGroup>
          </div>
        </div>
        <Button
          onClick={() => {
            navigate('/channelManager');
          }}
          variant="success"
        >
          Manage Channels
        </Button>
      </div>
    </div>
  ) : null;
}
