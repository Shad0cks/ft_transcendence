import { MessageSend } from "./messageSend";

export type ChannelDTO = {
  id: number;
  name: string;
  privacy: string;
  password: string;
  lastMessage: MessageSend;
};
