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
  AvatarGroup,
} from '@chatscope/chat-ui-kit-react';
import { Socket } from 'socket.io-client';
import { GetUserIt } from '../models/getUser';
import { MessageGetList } from '../models/messageGetList';
import { MessageSend } from '../models/messageSend';
import { ChannelType } from '../models/channelType';
import { PrivateMessageDTO } from '../models/privateMessageDTO';

export default function Chat({
  SelfUser,
  channelList,
  selectChannel,
  channelSelected,
  socket,
  usersInChannel,
  messageList,
  setMessageList,
}: {
  SelfUser: GetUserIt;
  channelList: ChannelType[];
  selectChannel: (channelID: string) => void;
  channelSelected: string | undefined;
  socket: Socket | undefined;
  usersInChannel: GetUserIt[];
  messageList: MessageGetList[];
  setMessageList: React.Dispatch<React.SetStateAction<MessageGetList[]>>;
}) {
  const [currentChannel, setCurrentChannel] = useState<ChannelType>();

  function getAvatar(username: string) {
    let user = usersInChannel.find((user) => user.nickname === username);
    if (user) return user.avatar;
    else
      return 'https://avataruserstorage.blob.core.windows.net/avatarimg/default.jpg';
  }

  function sendMessage(e: string) {
    if (currentChannel?.type === 'channel')
      socket?.emit('addMessage', {
        message: e,
        channelName: currentChannel?.channelBase.name,
        senderNickname: SelfUser.nickname,
      });
    else {
      socket?.emit('addMessagePrivate', {
        message: e,
        receiverNickname: currentChannel?.channelBase.name,
        senderNickname: SelfUser.nickname,
      });
    }
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
        setMessageList((prev) => [
          ...prev,
          { author: e.senderNickname, message: e.message, sent_at: e.sent_at },
        ]);
      });
      socket?.on('messageprivateAdded', function (e: PrivateMessageDTO) {
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
                onClick={() => selectChannel(elem.channelBase.name + elem.type)}
                key={id}
                name={elem.channelBase.name}
                lastSenderName="Type"
                info={elem.type === 'channel' ? 'Channel' : 'Private Message'}
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
              userName={currentChannel?.channelBase.name}
              info={
                currentChannel?.type === 'channel'
                  ? 'Channel'
                  : 'Private Message'
              }
            />
            <ConversationHeader.Actions>
              <EllipsisButton orientation="vertical" />
            </ConversationHeader.Actions>
          </ConversationHeader>

          <MessageList>
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
