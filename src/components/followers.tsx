import React, { useContext, useEffect } from 'react';
import { Global } from '../globalState';

const Followers: React.FC = () => {
  const { global } = useContext(Global);
  const username = window.location.pathname.substr(1);
  useEffect(() => {
    async function getFollowers() {
      const response = await fetch(`${global.env.apiUrl}/user/followers`, {
        body: JSON.stringify({ username }),
        headers: {
          // prettier-ignore
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        method: 'POST',
      });
      const content = await response.json();
      if (response.status === 200) {
        // tslint:disable-next-line: no-console
        console.log(content);
      }
    }
    if (username) {
      getFollowers();
    }
  }, [username, global.env.apiUrl]);

  return (
    <div className='followers'>
      <h2>Followers</h2>
    </div>
  );
};

export { Followers };
