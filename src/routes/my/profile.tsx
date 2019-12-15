import React, { useContext, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Global } from '../../globalState';

interface ConfirmProps extends RouteComponentProps<{ username: string }> {}

const Profile: React.FC<ConfirmProps> = (props: ConfirmProps) => {
  const { global } = useContext(Global);
  const username = props.match.params.username;

  const [state, setState] = useState({
    avatarId: '',
    bio: '',
    fullName: '',
    isMe: false,
    loading: true,
    webSite: '',
  });

  const { avatarId, bio, fullName, isMe, loading, webSite } = state;

  const profile = () => {
    props.history.push('/my/profile');
  };
  useEffect(() => {
    async function callApi() {
      const response = await fetch(`${global.env.apiUrl}/user/${username}`, {
        headers: {
          // prettier-ignore
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        method: 'GET',
      });
      const content = await response.json();
      if (response.status === 200) {
        setState((prev) => ({
          ...prev,
          avatarId: content.avatarId,
          bio: content.bio,
          fullName: content.fullName,
          isMe: global.shared.username === content.username ? true : false,
          loading: false,
          webSite: content.webSite,
        }));
      }
    }
    if (username) {
      callApi();
    }
  }, [global.env.apiUrl, global.shared.username, username]);
  return (
    <div className='profile'>
      {!loading && (
        <React.Fragment>
          <div>
            <img
              src={global.env.imgUrl + avatarId}
              className='profile--avatar'
              alt={fullName}
            />{' '}
            <br />
            <h1 className='profile--name'>{fullName}</h1>
            <h2 className='profile--username'>@{username}</h2>
            <p className='profile--bio'>{bio}</p>
            0 Followers
            <br />
            0 Following
            <br />
            <br />
            United States
            <br />
            <a href={webSite}>{webSite}</a>
          </div>
          <div>
            <div className='profile--header'>
              <div className='profile--cover'></div>
              <div className='profile--nav'>
                <div>
                  <button className='profile--button'>Items</button>
                  <button className='profile--button'>Games</button>
                </div>
                <div>
                  {isMe && (
                  <button className='profile--button' onClick={profile}>
                    Edit Profile
                  </button>
                  )}
                  {!isMe && (
                  <button className='profile--follow' onClick={profile}>
                    + Follow
                  </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </React.Fragment>
      )}
    </div>
  );
};

export { Profile };
