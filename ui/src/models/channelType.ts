import { ChannelDTO } from './channel';
import { MessageGetList } from './messageGetList';

export type ChannelType = {
  channelBase: ChannelDTO;
  id: string;
  type: string;
  mpMessage: MessageGetList[];
};
