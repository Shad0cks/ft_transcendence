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
import { MessageSend } from '../models/messageSend';

export default function Chat({
  SelfUser,
  channelList,
  selectChannel,
  channelSelected,
  socket,
  usersInChannel,
  messageList,
  setMessageList,
  setLastMessage
}: {
  SelfUser: GetUserIt;
  channelList: ChannelDTO[];
  selectChannel: (channelID: number) => void;
  channelSelected: number | undefined;
  socket: Socket | undefined;
  usersInChannel: GetUserIt[];
  messageList: MessageSend[];
  setMessageList: React.Dispatch<React.SetStateAction<MessageSend[]>>;
  setLastMessage: (message: MessageSend, channelName: string) => void;
}) {
  const [currentChannel, setCurrentChannel] = useState<ChannelDTO>();

  console.log(messageList);
  function getAvatar(username: string) {
    let user = usersInChannel.find((user) => user.nickname === username);
    if (user) return user.avatar;
    else
      return 'https://avataruserstorage.blob.core.windows.net/avatarimg/default.jpg';
  }

  function sendMessage(e: string) {
    socket?.emit('addMessage', {
      message: e,
      channelName: currentChannel?.name,
      senderNickname: SelfUser.nickname,
    });
  }

  function getTime(time: string) {
    return new Date(time).toLocaleTimeString('fr-FR', {
      timeStyle: 'short',
      hour12: false,
      timeZone: 'Europe/Bucharest',
    });
  }

  useEffect(() => {
    socket?.on('connect', () => {
      socket?.on('messageAdded', function (e: MessageSend) {
        setLastMessage(e, e.channelName)
        setMessageList((prev) => [
          ...prev,
          { senderNickname: e.senderNickname, message: e.message, sent_at: e.sent_at, channelName: "" },
        ]);
      });
    });

    return () => {
      socket?.off('connect');
      socket?.off('messageAdded');
    };
  }, [socket]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setCurrentChannel(
      channelList.find((channel) => channel.id === channelSelected),
    );
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
                lastSenderName={elem.lastMessage ? elem.lastMessage.senderNickname : "Click to refresh"}
                info={elem.lastMessage ? elem.lastMessage.message : null}
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
                  sender: e.senderNickname,
                  direction:
                    e.senderNickname === SelfUser.nickname ? 'incoming' : 'outgoing',
                  position: 'first',
                }}
              >
                <Avatar src={getAvatar(e.senderNickname)} name={e.senderNickname} />
                <Message.Header
                  sender={e.senderNickname}
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
