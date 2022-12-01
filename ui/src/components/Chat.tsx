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
} from '@chatscope/chat-ui-kit-react';
import { ChannelDTO } from '../models/channel';

export default function Chat({
  channelList,
  selectChannel,
  channelSelected,
}: {
  channelList: ChannelDTO[];
  selectChannel: (channelID: number) => void;
  channelSelected: number | undefined;
}) {
  const [currentChannel, setCurrentChannel] = useState<ChannelDTO>();

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
                lastSenderName="Emily"
                info="Yes i can do it for you"
                unreadCnt={3}
                active={elem.id === channelSelected}
              >
                <Avatar
                  src={'https://picsum.photos/50/50'}
                  name={elem.name}
                  status="available"
                />
              </Conversation>
            ))}
          </ConversationList>
        </Sidebar>

        <ChatContainer>
          <ConversationHeader>
            <Avatar src={'https://picsum.photos/50/50'} name="Zoe" />
            <ConversationHeader.Content
              userName={currentChannel?.name}
              info="Active 10 mins ago"
            />
            <ConversationHeader.Actions>
              <EllipsisButton orientation="vertical" />
            </ConversationHeader.Actions>
          </ConversationHeader>
          <MessageList
            typingIndicator={<TypingIndicator content="Eliot is typing" />}
          >
            <Message
              model={{
                message: 'fadgasdg',
                sentTime: 'just now',
                sender: 'Joe',
                direction: 'incoming',
                position: 'first',
              }}
            >
              <Avatar src={'https://picsum.photos/50/50'} name="Akane" />
              <Message.Header sender="Emily" sentTime="just now" />
            </Message>
            <Message
              model={{
                message: 'fadgasdg',
                sentTime: 'just now',
                sender: 'Joe',
                direction: 'incoming',
                position: 'first',
              }}
            >
              <Avatar src={'https://picsum.photos/50/50'} name="Akane" />
              <Message.Header sender="Emily" sentTime="just now" />
            </Message>
            <Message
              model={{
                message: 'fadgasdg',
                sentTime: 'just now',
                sender: 'Joe',
                direction: 'incoming',
                position: 'first',
              }}
            >
              <Avatar src={'https://picsum.photos/50/50'} name="Akane" />
              <Message.Header sender="Emily" sentTime="just now" />
            </Message>
            <Message
              model={{
                message: 'fadgasdg',
                sentTime: 'just now',
                sender: 'Joe',
                direction: 'outgoing',
                position: 'first',
              }}
            >
              <Avatar src={'https://picsum.photos/50/50'} name="Akane" />
              <Message.Header sender="Emily" sentTime="just now" />
            </Message>
          </MessageList>
          <MessageInput placeholder="Type message here" />
        </ChatContainer>
      </MainContainer>
    </div>
  );
}
