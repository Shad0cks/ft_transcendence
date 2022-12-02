import React, { useEffect, useState } from 'react';
import '../css/Components/Chat.css';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  Avatar,
  Conversation,
  ConversationList,
  Search,
  Sidebar,
  ConversationHeader,
  EllipsisButton,
  TypingIndicator,
  AvatarGroup,
} from '@chatscope/chat-ui-kit-react';
import { ChannelDTO } from '../models/channel';
import { Socket } from 'socket.io-client';
import { GetUserIt } from '../models/getUser';
import { MessageGetList } from '../models/messageGetList';
import { GetMessages } from '../services/Channel/getMessages';
import { UserLogout } from '../services/User/userDelog';
import { useNavigate } from 'react-router-dom';
import { MessageSend } from '../models/messageSend';

export default function Chat({
  SelfUser,
  channelList,
  selectChannel,
  channelSelected,
  socket,
  usersInChannel,
}: {
  SelfUser: GetUserIt;
  channelList: ChannelDTO[];
  selectChannel: (channelID: number) => void;
  channelSelected: number | undefined;
  socket: Socket | undefined;
  usersInChannel: GetUserIt[];
}) {
  const [currentChannel, setCurrentChannel] = useState<ChannelDTO>();
  const [messageList, setMessageList] = useState<MessageGetList[]>([]);
  const navigate = useNavigate();

  function getListMessage() {
    if (!channelSelected) return;

    GetMessages(channelSelected).then(async (e) => {
      if (e.status === 401) {
        await UserLogout();
        navigate('/');
      } else if (e.ok) e.text().then((i) => setMessageList(JSON.parse(i)));
    });
  }

  function getAvatar(username: string) {
    let user = usersInChannel.find((user) => user.nickname === username);
    if (user) return user.avatar;
    else
      return 'https://avataruserstorage.blob.core.windows.net/avatarimg/default.jpg';
  }

  function sendMessage(e: string) {
    console.log('message send', e);
    socket?.emit('addMessage', {
      message: e,
      channelName: currentChannel?.name,
      senderNickname: SelfUser.nickname,
    });
  }

  function getTime(time: string) {
    console.log(time);
    return new Date(time).toLocaleTimeString('fr-FR', {
      timeStyle: 'short',
      hour12: false,
      timeZone: 'Europe/Bucharest',
    });
  }

  useEffect(() => {
    socket?.on('connect', () => {
      socket?.on('messageAdded', function (e: MessageSend) {
        setMessageList((prev) => [
          ...prev,
          { author: e.senderNickname, message: e.message, sent_at: e.sent_at },
        ]);
      });
    });

    return () => {
      socket?.off('connect');
      socket?.off('messageAdded');
    };
  }, [socket]);

  useEffect(() => {
    setCurrentChannel(
      channelList.find((channel) => channel.id === channelSelected),
    );
    getListMessage();
  }, [selectChannel]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="chatContainer">
      <MainContainer>
        <Sidebar position="left" scrollable={false}>
          <Search placeholder="Search..." />

          <ConversationList>
            {channelList.map((elem, id) => (
              <Conversation
                onClick={() => selectChannel(elem.id)}
                key={id}
                name={elem.name}
                lastSenderName="Emily"
                info="Yes i can do it for you"
                unreadCnt={3}
                active={elem.id === channelSelected}
              >
                {/* <Avatar
                  src={'https://picsum.photos/50/50'}
                  name={elem.name}
                  status="available"
                /> */}
              </Conversation>
            ))}
          </ConversationList>
        </Sidebar>

        <ChatContainer>
          <ConversationHeader>
            {usersInChannel.length <= 1 ? (
              usersInChannel.length === 0 ? (
                <Avatar
                  src="https://avataruserstorage.blob.core.windows.net/avatarimg/alone.png"
                  name="alone"
                />
              ) : (
                <Avatar
                  src={usersInChannel[0].avatar}
                  name={usersInChannel[0].nickname}
                />
              )
            ) : (
              <AvatarGroup size="sm" max={4}>
                {usersInChannel.map((e) => (
                  <Avatar src={e.avatar} name="group" />
                ))}
              </AvatarGroup>
            )}

            <ConversationHeader.Content
              userName={currentChannel?.name}
              info="Channel"
            />
            <ConversationHeader.Actions>
              <EllipsisButton orientation="vertical" />
            </ConversationHeader.Actions>
          </ConversationHeader>

          <MessageList
            typingIndicator={<TypingIndicator content="Eliot is typing" />}
          >
            {messageList.map((e, id) => (
              <Message
                key={id}
                model={{
                  message: e.message,
                  sentTime: getTime(e.sent_at),
                  sender: e.author,
                  direction:
                    e.author === SelfUser.nickname ? 'incoming' : 'outgoing',
                  position: 'first',
                }}
              >
                <Avatar src={getAvatar(e.author)} name={e.author} />
                <Message.Header
                  sender={e.author}
                  sentTime={getTime(e.sent_at)}
                />
              </Message>
            ))}
          </MessageList>
          <MessageInput
            placeholder="Type message here"
            onSend={(e) => sendMessage(e)}
          />
        </ChatContainer>
      </MainContainer>
    </div>
  );
}
