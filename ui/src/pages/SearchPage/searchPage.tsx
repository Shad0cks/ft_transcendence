import React from 'react';
import useLoggedUser from '../../customHooks/useLoggedUser.hook';

export default function SearchUser() {
  const user = useLoggedUser();
  console.log(user);
  return <div></div>;
}
