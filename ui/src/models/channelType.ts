import { ChannelDTO } from './channel';
import { MessageGetList } from './messageGetList';

export type ChannelType = {
  channelBase: ChannelDTO;
  id: number;
  type: string;
  mpMessage: MessageGetList[];
};
