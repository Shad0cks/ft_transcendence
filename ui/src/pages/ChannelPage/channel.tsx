import React, { useState, useEffect } from 'react';
import Chat from '../../components/Chat';
import '../../css/Pages/Channel.css';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import ListGroup from 'react-bootstrap/ListGroup';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import { GetUserInfo } from '../../services/User/getUserInfo';
import { GetUserIt } from '../../models/getUser';
import { UserLogout } from '../../services/User/userDelog';
import { GetInChannels } from '../../services/Channel/getInChannels';
import { ChannelDTO } from '../../models/channel';
import { socket, statusMap } from '../../services/socket';
import { ChannelJoin } from '../../models/channelJoined';
import { MessageGetList } from '../../models/messageGetList';
import { GetMessages } from '../../services/Channel/getMessages';
import { GetDM } from '../../services/Channel/getDM';
import { ChannelType } from '../../models/channelType';
import { GetMPsList } from '../../services/Channel/getMPsList';
import { GetAdmins } from '../../services/Channel/getAdmis';
import { AiTwotoneCrown } from 'react-icons/ai';
import { ModalUserProfile } from '../../components/ModalUserProfile';
import useSnackbar from '../../customHooks/useSnackbar';
import { searchUser } from '../SearchPage/searchPage';
import ModalBlockUser from '../../components/modalBlockUser';
import useReceiveInvite from '../../customHooks/receiveInvite';
import TSSnackbar from '../../components/TSSnackbar';
import RestrictionPopUp from '../../components/restrictionPopUp';
import { resType } from '../../models/res';

export default function Channel() {
  const navigate = useNavigate();
  const location = useLocation();
  const [playerClicked, setPlayerClicked] = useState<number>();
  const [username, setUsername] = useState<string | null>(null);
  const [user, setUser] = useState<GetUserIt>();
  const [channelUsersList, setChannelUsersList] = useState<ChannelType[]>([]);
  const [channelSelected, setChannelSelected] = useState<string>();
  const [usersInChannel, setUsersInChannel] = useState<string[]>([]);
  const [usersInfos, setUsersInfos] = useState<GetUserIt[]>([]);
  const [messageList, setMessageList] = useState<MessageGetList[]>([]);
  const [admins, setAdmins] = useState<{ nickname: string }[]>();
  const [openProfileModal, setOpenProfileModal] = useState(false);
  const [openBlockUsers, setOpenBlockUsers] = useState(false);
  const [openRestriction, setOpenRestriction] = useState(false);
  const [applyRes, setApplyRes] = useState<resType>();

  const snackbar = useSnackbar();
  const sender = useReceiveInvite(snackbar, navigate);
  const [searchedUser, setSearchedUser] = useState<
    GetUserIt | undefined | null
  >();
  // const [usersInfosInChannel, setUserInfoInChannel] = useState<GetUserIt[][]>();

  // async function getUsersInfoChannel(channelID: number)
  // {
  //   channelUsersList[channelID].forEach(async (user) => {

  //     let userInfo = await GetUserInfo(user).then(async (e) => {
  //       if (e.ok)
  //       {
  //         const res = await e.text();
  //         return JSON.parse(res);
  //       }
  //       return undefined;
  //     })
  //     setUsersInfos([...usersInfos, userInfo])
  //   });
  // }

  const openProfile = (nickname: string) => {
    searchUser(nickname, setSearchedUser, snackbar);
    setOpenProfileModal(true);
  };

  const popover = (player: string) => {
    const currChannel = channelUsersList.find((x) => x.id === channelSelected);
    if (!currChannel) return <></>;
    const isAdminUser = isUserAmin(player);
    return (
      <Popover id="popover-basic">
        <Popover.Header as="h3">{player}</Popover.Header>
        <Popover.Body>
          {statusMap.get(player) !== 'ingame' ? (
            <Button
              variant="success"
              onClick={() => {
                socket.emit('InvitationGame', {
                  InvitationSender: username,
                  InvitationReceiver: player,
                });
              }}
            >
              Game
            </Button>
          ) : (
            <Button
              variant="success"
              onClick={() => {
                socket.emit('getGameByPseudo', {
                  player: player,
                });
              }}
            >
              View Game
            </Button>
          )}{' '}
          <Button variant="primary" onClick={() => AddChannelDM(player)}>
            DM
          </Button>{' '}
          <Button variant="primary" onClick={() => openProfile(player)}>
            Profile
          </Button>
          {currChannel.type === 'channel' && isUserAmin(username!) ? (
            <Button
              variant="danger"
              onClick={() => {
                setOpenRestriction(true);
                setApplyRes({
                  userNickname: player,
                  adminNickname: user?.nickname,
                  channelName: currChannel.channelBase.name,
                  restriction: 'ban',
                  end: 'none',
                });
              }}
            >
              ban
            </Button>
          ) : null}{' '}
          {currChannel.type === 'channel' && isUserAmin(username!) ? (
            <Button
              variant="primary"
              onClick={() => {
                setOpenRestriction(true);
                setApplyRes({
                  userNickname: player,
                  adminNickname: user?.nickname,
                  channelName: currChannel.channelBase.name,
                  restriction: 'mute',
                  end: 'none',
                });
              }}
            >
              mute
            </Button>
          ) : null}{' '}
          {!isAdminUser &&
          isUserAmin(username!) &&
          currChannel.type === 'channel' ? (
            <Button
              variant="primary"
              onClick={() => {
                socket?.emit('AddAdmin', {
                  userNickname: player,
                  channelName: currChannel.channelBase.name,
                });
              }}
            >
              Set Admin
            </Button>
          ) : null}
        </Popover.Body>
      </Popover>
    );
  };

  function getListMessage() {
    const currChannel = channelUsersList.find((x) => x.id === channelSelected);
    if (!currChannel) return;

    GetMessages(currChannel.channelBase.name).then(async (e) => {
      if (e.status === 401) {
        await UserLogout();
        navigate('/');
      } else if (e.ok) e.text().then((i) => setMessageList(JSON.parse(i)));
    });
  }

  function getListMpslocal() {
    const currChannel = channelUsersList.find((x) => x.id === channelSelected);
    if (!currChannel) return;

    GetMPsList(currChannel.channelBase.name).then(async (e) => {
      if (e.status === 401) {
        await UserLogout();
        navigate('/');
      } else if (e.ok) e.text().then((i) => setMessageList(JSON.parse(i)));
    });
  }

  function AddChannelDM(target: string) {
    const targetChannel = channelUsersList.find(
      (x) => x.channelBase.name === target && x.type === 'mp',
    );
    if (!targetChannel) {
      setChannelUsersList((prev) => [
        ...prev,
        {
          id: target + 'mp',
          channelBase: {
            name: target,
            id: prev.length + 1,
            privacy: '(null)',
            password: '(null)',
            whitelist: [],
          },
          type: 'mp',
          mpMessage: [],
        },
      ]);
    }
    setChannelSelected(target + 'mp');
  }

  async function getAllChannels() {
    let tmpSelected = false;
    setChannelUsersList([]);
    if (location.state && location.state.startDM) {
      AddChannelDM(location.state.startDM);
      tmpSelected = true;
    }
    await getDMs().then(async (map) => {
      Object.keys(map).forEach((key: string, id: number) => {
        if (id === 0 && !tmpSelected) {
          tmpSelected = true;
          setChannelSelected(key + 'mp');
        }
        if (
          !(
            location &&
            location.state &&
            location.state.startDM &&
            location.state.startDM === key
          )
        )
          setChannelUsersList((prev) => [
            ...prev,
            {
              id: key + 'mp',
              channelBase: {
                name: key,
                id: id,
                privacy: '(null)',
                password: '(null)',
                whitelist: [],
              },
              type: 'mp',
              mpMessage: map[key].messages,
            },
          ]);
      });
    });

    await getListInChannel().then((e) => {
      e.map((elem: ChannelDTO, id: number) => {
        if (id === 0 && !tmpSelected) setChannelSelected(elem.name + 'channel');
        return setChannelUsersList((prev) => [
          ...prev,
          {
            id: elem.name + 'channel',
            channelBase: elem,
            type: 'channel',
            mpMessage: [],
          },
        ]);
      });
    });
  }

  function clickPlayer(e: React.MouseEvent, playerClickID: number) {
    e.preventDefault();
    if (playerClickID === playerClicked) setPlayerClicked(-1);
    else setPlayerClicked(playerClickID);
  }

  function selectChannel(channelID: string) {
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

  async function getDMs() {
    const requete = await GetDM();
    if (requete.status === 401) {
      await UserLogout();
      navigate('/');
    }
    const txt = await requete.text();
    return JSON.parse(txt);
  }
  function getUsersInfoChat(users: string[]) {
    setUsersInfos([]);
    users.forEach(async (user) => {
      let userInfo = await GetUserInfo(user).then(async (e) => {
        if (e.ok) {
          const res = await e.text();
          return JSON.parse(res);
        }
        return undefined;
      });
      setUsersInfos((prev) => [...prev, userInfo]);
    });
  }

  function getAdminListChannel(channel: string) {
    GetAdmins(channel).then(async (e) => {
      if (e.status === 401) {
        await UserLogout();
        navigate('/');
      } else if (e.ok) e.text().then((i) => setAdmins(JSON.parse(i)));
    });
  }

  function isUserAmin(name: string) {
    if (admins && admins.find((x) => x.nickname === name)) return true;
    else return false;
  }

  useEffect(() => {
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
    (async () => {
      await getAllChannels();
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    socket?.on('GetUserFromChannel', (users: string[]) => {
      const listWithoutSelf = users.filter((user) => user !== username);
      setUsersInChannel(listWithoutSelf);
      getUsersInfoChat(listWithoutSelf);
    });

    socket?.on('joinChannel', function (e: ChannelJoin) {
      if (e.userNickname !== username)
        setUsersInChannel((usersInChannel) => [
          ...usersInChannel,
          e.userNickname,
        ]);
      setUsersInChannel(usersInChannel.filter((user) => user !== username));
    });

    socket?.on('getGameByPseudo', function (gameid: string) {
      navigate('/game_' + gameid, { state: { gameid: gameid } });
    });

    socket?.on('NewAdmin', function (e) {
      const currChannel = channelUsersList.find(
        (x) => x.id === channelSelected,
      );

      if (currChannel?.channelBase.name === e.channelName)
        getAdminListChannel(e.channelName);
    });

    return () => {
      socket?.off('GetUserFromChannel');
      socket?.off('NewAdmin');
    };
  }, [socket, channelUsersList]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const currentChannel = channelUsersList.find(
      (x) => x.id === channelSelected,
    );
    if (currentChannel?.type === 'channel') {
      socket?.emit(
        'GetUserFromChannel',
        channelUsersList.find((x) => x.id === channelSelected)?.channelBase
          .name,
      );
      getListMessage();
      getAdminListChannel(currentChannel.channelBase.name);
    } else if (currentChannel?.type === 'mp') {
      setAdmins(undefined);
      getListMpslocal();
      setUsersInChannel([currentChannel.channelBase.name]);
      getUsersInfoChat([currentChannel.channelBase.name]);
    }
  }, [channelSelected]); // eslint-disable-line react-hooks/exhaustive-deps

  function needShowInfo(playerID: number): boolean {
    return playerID === playerClicked;
  }

  return username ? (
    <div>
      <Header username={username} iconUser={user?.avatar} />
      <div className="btnCont">
        <div className="ChannelContainer">
          <Chat
            SelfUser={user!}
            channelList={channelUsersList}
            selectChannel={selectChannel}
            channelSelected={channelSelected}
            usersInChannel={usersInfos}
            messageList={messageList}
            setMessageList={setMessageList}
            refreshChannel={getAllChannels}
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
              <ListGroup.Item>User in Channel :</ListGroup.Item>
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
                        overlay={popover(elem)}
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
                          {elem} {isUserAmin(elem) ? <AiTwotoneCrown /> : null}
                        </span>
                      </OverlayTrigger>
                    </ListGroup.Item>
                  ))
                : null}
            </ListGroup>
          </div>
        </div>
        <div style={{ zIndex: 1 }}>
          <Button
            onClick={() => {
              navigate('/channelManager');
            }}
            variant="dark"
          >
            Manage Channels
          </Button>
          <span> </span>
          <Button onClick={() => setOpenBlockUsers(true)} variant="warning">
            Users Blocked
          </Button>
        </div>
      </div>
      <ModalUserProfile
        searchedUser={searchedUser}
        user={user}
        snackbar={snackbar}
        open={openProfileModal}
        setOpen={setOpenProfileModal}
      />

      <ModalBlockUser
        snackbar={snackbar}
        open={openBlockUsers}
        setOpen={setOpenBlockUsers}
      />

      <TSSnackbar
        open={snackbar.open}
        setOpen={snackbar.setOpen}
        severity={snackbar.severity}
        message={snackbar.message}
        senderInvite={sender}
        username={username}
      />
      <RestrictionPopUp
        applyRes={applyRes!}
        open={openRestriction}
        setOpen={setOpenRestriction}
      />
    </div>
  ) : null;
}
