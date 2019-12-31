import React, { useContext, useEffect, useState } from 'react';
import { Global } from '../globalState';

const Followers: React.FC = () => {
  const { global } = useContext(Global);
  const username = window.location.pathname.substr(1);

  interface Follower {
    fullName: string;
    username: string;
    avatarId?: string;
    imFollowing: boolean;
  }

  const [state, setState] = useState({
    followers: [],
  });
  const { followers } = state;

  useEffect(() => {
    async function getFollowers() {
      const response = await fetch(`${global.env.apiUrl}/user/followers`, {
        body: JSON.stringify({
          jwtToken: localStorage.getItem('jwtToken'),
          username,
        }),
        headers: {
          // prettier-ignore
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        method: 'POST',
      });
      const content = await response.json();
      if (response.status === 200) {
        setState((prev) => ({ ...prev, followers: content.followers }));
      }
    }
    if (username) {
      getFollowers();
    }
  }, [username, global.env.apiUrl]);

  const gotoUser = (user: string) => {
    window.location.href = `/${user}`;
  };
  const getAvatar = (fullName: string) => {
    return (
      global.env.imgUrl +
      'initials/' +
      fullName.charAt(0).toLowerCase() +
      '.png'
    );
  };
  return (
    <div className='followers'>
      <h2>Followers</h2>

      {followers.map((person: Follower, iterator: number) => (
        <div className='followers--grid' key={iterator}>
          <div onClick={() => gotoUser(person.username)}>
            {person.avatarId && (
              <img
                src={global.env.imgUrl + person.avatarId}
                className='followers--image'
                alt='Avatar'
              />
            )}
            {!person.avatarId && (
              <img
                src={getAvatar(person.fullName)}
                className='followers--image'
                alt='Avatar'
              />
            )}
          </div>
          <div onClick={() => gotoUser(person.username)}>
            <p className='followers--name'>{person.fullName}</p>
            <p className='followers--username'>@{person.username} </p>
          </div>
          <div className='followers--follow'>
          {!person.imFollowing && '+ Follow'}
          {person.imFollowing && '- Unfollow'}
          </div>
        </div>
      ))}
    </div>
  );
};

export { Followers };
