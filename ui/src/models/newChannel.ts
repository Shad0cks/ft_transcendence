import { ChannelPrivacyType } from './channelPrivacyType';

export interface CreateChannelDTO {
  channelName: string;
  creatorNickname: string;
  privacy: ChannelPrivacyType;
  password: string;
}
