import React from 'react';
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
  TypingIndicator,
} from '@chatscope/chat-ui-kit-react';

export default function Chat() {
  return (
    <div className="chatContainer">
      <MainContainer>
        <Sidebar position="left" scrollable={false}>
          <Search placeholder="Search..." />
          <ConversationList>
            <Conversation
              name="Global"
              lastSenderName="Lilly"
              info="Yes i can do it for you"
            >
              <AvatarGroup size="sm" max={4}>
                <Avatar src={'https://picsum.photos/50/50'} name="Eliot" />
                <Avatar src={'https://picsum.photos/50/50'} name="Akane" />
                <Avatar src={'https://picsum.photos/50/50'} name="Joe" />
                <Avatar src={'https://picsum.photos/50/50'} name="Zoe" />
                <Avatar src={'https://picsum.photos/50/50'} name="Eliot" />
                <Avatar src={'https://picsum.photos/50/50'} name="Akane" />
                <Avatar src={'https://picsum.photos/50/50'} name="Joe" />
                <Avatar src={'https://picsum.photos/50/50'} name="Zoe" />
                <Avatar src={'https://picsum.photos/50/50'} name="Eliot" />
                <Avatar src={'https://picsum.photos/50/50'} name="Akane" />
                <Avatar src={'https://picsum.photos/50/50'} name="Joe" />
                <Avatar src={'https://picsum.photos/50/50'} name="Zoe" />
                <Avatar src={'https://picsum.photos/50/50'} name="Eliot" />
                <Avatar src={'https://picsum.photos/50/50'} name="Akane" />
                <Avatar src={'https://picsum.photos/50/50'} name="Joe" />
                <Avatar src={'https://picsum.photos/50/50'} name="Zoe" />
              </AvatarGroup>
            </Conversation>

            <Conversation
              name="Joe"
              lastSenderName="Joe"
              info="Yes i can do it for you"
            >
              <Avatar
                src={'https://picsum.photos/50/50'}
                name="Joe"
                status="dnd"
              />
            </Conversation>

            <Conversation
              name="Emily"
              lastSenderName="Emily"
              info="Yes i can do it for you"
              unreadCnt={3}
            >
              <Avatar
                src={'https://picsum.photos/50/50'}
                name="Emily"
                status="available"
              />
            </Conversation>

            <Conversation
              name="Kai"
              lastSenderName="Kai"
              info="Yes i can do it for you"
              unreadDot
            >
              <Avatar
                src={'https://picsum.photos/50/50'}
                name="Kai"
                status="unavailable"
              />
            </Conversation>

            <Conversation
              name="Akane"
              lastSenderName="Akane"
              info="Yes i can do it for you"
            >
              <Avatar
                src={'https://picsum.photos/50/50'}
                name="Akane"
                status="eager"
              />
            </Conversation>

            <Conversation
              name="Eliot"
              lastSenderName="Eliot"
              info="Yes i can do it for you"
            >
              <Avatar
                src={'https://picsum.photos/50/50'}
                name="Eliot"
                status="away"
              />
            </Conversation>

            <Conversation
              name="Zoe"
              lastSenderName="Zoe"
              info="Yes i can do it for you"
            >
              <Avatar
                src={'https://picsum.photos/50/50'}
                name="Zoe"
                status="dnd"
              />
            </Conversation>

            <Conversation
              name="Patrik"
              lastSenderName="Patrik"
              info="Yes i can do it for you"
            >
              <Avatar
                src={'https://picsum.photos/50/50'}
                name="Patrik"
                status="invisible"
              />
            </Conversation>
            <Conversation
              name="Patrik"
              lastSenderName="Patrik"
              info="Yes i can do it for you"
            >
              <Avatar
                src={'https://picsum.photos/50/50'}
                name="Patrik"
                status="invisible"
              />
            </Conversation>
            <Conversation
              name="Patrik"
              lastSenderName="Patrik"
              info="Yes i can do it for you"
            >
              <Avatar
                src={'https://picsum.photos/50/50'}
                name="Patrik"
                status="invisible"
              />
            </Conversation>
            <Conversation
              name="Patrik"
              lastSenderName="Patrik"
              info="Yes i can do it for you"
            >
              <Avatar
                src={'https://picsum.photos/50/50'}
                name="Patrik"
                status="invisible"
              />
            </Conversation>
            <Conversation
              name="Patrik"
              lastSenderName="Patrik"
              info="Yes i can do it for you"
            >
              <Avatar
                src={'https://picsum.photos/50/50'}
                name="Patrik"
                status="invisible"
              />
            </Conversation>
            <Conversation
              name="Patrik"
              lastSenderName="Patrik"
              info="Yes i can do it for you"
            >
              <Avatar
                src={'https://picsum.photos/50/50'}
                name="Patrik"
                status="invisible"
              />
            </Conversation>
            <Conversation
              name="Patrik"
              lastSenderName="Patrik"
              info="Yes i can do it for you"
            >
              <Avatar
                src={'https://picsum.photos/50/50'}
                name="Patrik"
                status="invisible"
              />
            </Conversation>
            <Conversation
              name="Patrik"
              lastSenderName="Patrik"
              info="Yes i can do it for you"
            >
              <Avatar
                src={'https://picsum.photos/50/50'}
                name="Patrik"
                status="invisible"
              />
            </Conversation>
            <Conversation
              name="Patrik"
              lastSenderName="Patrik"
              info="Yes i can do it for you"
            >
              <Avatar
                src={'https://picsum.photos/50/50'}
                name="Patrik"
                status="invisible"
              />
            </Conversation>
          </ConversationList>
        </Sidebar>

        <ChatContainer>
          <ConversationHeader>
            <Avatar src={'https://picsum.photos/50/50'} name="Zoe" />
            <ConversationHeader.Content
              userName="Zoe"
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
