import useFriends from './useFriends.hook';

export function useIsFriend(
  nickname: string,
  otherUserNickname: string,
): boolean {
  const friendList = useFriends(nickname);
  const found = friendList.friendList.find(
    (element) => element.nickname === otherUserNickname,
  );

  return found !== undefined;
}
