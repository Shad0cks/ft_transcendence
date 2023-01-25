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
import { socket } from '../services/socket';
import { GetUserIt } from '../models/getUser';
import { MessageGetList } from '../models/messageGetList';
import { MessageSend } from '../models/messageSend';
import { ChannelType } from '../models/channelType';
import { PrivateMessageDTO } from '../models/privateMessageDTO';
import { SnackbarHook } from '../customHooks/useSnackbar';

export default function Chat({
  SelfUser,
  channelList,
  selectChannel,
  channelSelected,
  usersInChannel,
  messageList,
  setMessageList,
  refreshChannel,
  snackbar,
}: {
  SelfUser: GetUserIt;
  channelList: ChannelType[];
  selectChannel: (channelID: string) => void;
  channelSelected: string | undefined;
  usersInChannel: GetUserIt[];
  messageList: MessageGetList[];
  setMessageList: React.Dispatch<React.SetStateAction<MessageGetList[]>>;
  refreshChannel: () => Promise<void>;
  snackbar: SnackbarHook;
}) {
  const [currentChannel, setCurrentChannel] = useState<ChannelType>();
  const [inputSearch, setInputSearch] = useState('');

  function getAvatar(username: string) {
    let user = usersInChannel.find((user) => user.nickname === username);
    if (user) return user.avatar;
    else if (SelfUser.nickname === username) return SelfUser.avatar;
    else
      return 'https://avataruserstorage.blob.core.windows.net/avatarimg/default.jpg';
  }
  function sendMessage(e: string) {
    var withoutBR = e.replace('<br>', '');
    if (withoutBR.length > 255) {
      snackbar.setMessage('Max message charactere : 255');
      snackbar.setSeverity('error');
      snackbar.setOpen(true);
      return;
    }
    if (withoutBR.includes('<')) {
      snackbar.setMessage('No HTML Balise allowed');
      snackbar.setSeverity('error');
      snackbar.setOpen(true);
      return;
    }

    if (currentChannel?.type === 'channel') {
      socket?.emit('addMessage', {
        message: e,
        channelName: currentChannel?.channelBase.name,
        senderNickname: SelfUser?.nickname,
      });
    } else {
      socket?.emit('addMessagePrivate', {
        message: e,
        receiverNickname: currentChannel?.channelBase.name,
        senderNickname: SelfUser?.nickname,
      });
    }
  }
  function getTime(time: string) {
    const hour = new Date(time).toLocaleTimeString('fr-FR', {
      timeStyle: 'short',
      hour12: false,
      timeZone: 'Europe/Bucharest',
    });
    const date = new Date(time);
    let day = date.getDate().toString();

    if (day.length === 1) day = '0' + day;
    return hour + ' ' + day + '/' + date.getMonth() + 1;
  }

  useEffect(() => {
    socket?.on('messageAdded', function (e: MessageSend) {
      if (e.channelName !== currentChannel?.channelBase.name) return;
      setMessageList((prev) => [
        ...prev,
        { author: e.senderNickname, message: e.message, sent_at: e.sent_at },
      ]);
    });
    socket?.on('messageprivateAdded', function (e: PrivateMessageDTO) {
      if (
        e.senderNickname === SelfUser?.nickname ||
        currentChannel?.id === e.senderNickname + 'mp'
      ) {
        setMessageList((prev) => [
          ...prev,
          { author: e.senderNickname, message: e.message, sent_at: e.sent_at },
        ]);
      } else if (!channelList.find((x) => x.channelBase.name === e.senderNickname && x.type === 'mp')) refreshChannel();
    });
    return () => {
      socket?.off('messageAdded');
      socket?.off('messageprivateAdded');
    };
  }, [socket, currentChannel, channelList, SelfUser]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setCurrentChannel(
      channelList.find((channel) => channel.id === channelSelected),
    );
  }, [selectChannel]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="chatContainer">
      <MainContainer>
        <Sidebar position="left" scrollable={false}>
          <Search
            placeholder="Search chat..."
            onChange={(e) => setInputSearch(e)}
          />

          <ConversationList>
            {channelList.map((elem, id) =>
              elem.channelBase.name.startsWith(inputSearch) ? (
                <Conversation
                  onClick={() =>
                    selectChannel(elem.channelBase.name + elem.type)
                  }
                  key={id}
                  name={elem.channelBase.name}
                  lastSenderName="Type"
                  info={elem.type === 'channel' ? 'Channel' : 'Private Message'}
                  active={elem.id === channelSelected}
                ></Conversation>
              ) : null,
            )}
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
              <AvatarGroup size="xs" max={9}>
                {usersInChannel.map((e, i) => (
                  <Avatar key={i} src={e.avatar} name={e.nickname} />
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
                    e.author === SelfUser?.nickname ? 'outgoing' : 'incoming',
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
            disabled={channelList.length === 0}
            attachButton={false}
          />
        </ChatContainer>
      </MainContainer>
    </div>
  );
}
