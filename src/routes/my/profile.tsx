import React, { useContext, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Cover } from '../../components/cover';
import { Global } from '../../globalState';

interface ConfirmProps extends RouteComponentProps<{ username: string }> {}

const Profile: React.FC<ConfirmProps> = (props: ConfirmProps) => {
  const { global } = useContext(Global);
  const username = props.match.params.username;
  const placeholder = global.env.imgUrl + global.shared.coverId;

  const [state, setState] = useState({
    avatarId: '',
    bio: '',
    country: '',
    fullName: '',
    isMe: false,
    loading: true,
    webSite: '',
  });

  const { avatarId, bio, country, fullName, isMe, loading, webSite } = state;

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
          country: content.country,
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
            <p className='profile--followers'>
              <b>20</b> Followers
            </p>
            <p className='profile--following'>
              <b>32</b> Following
            </p>
            <br />
            <p className='profile--country'>{country}</p>
            <p className='profile--website'>
              <a href={webSite} target='_blank'>
                {webSite.replace(/(^\w+:|^)\/\//, '')}
              </a>
            </p>
          </div>
          <div>
            <div className='profile--header'>
              <Cover
                isMe={isMe}
                placeholder={placeholder}
                resizeTo={900}
                signedUrl={`${global.env.apiUrl}/upload/signed-url`}
                saveImg={`${global.env.apiUrl}/my/cover`}
              />
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
