import React, { useContext, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Cover } from '../../components/cover';
import { Global } from '../../globalState';
import { Dispatch, SET_MODAL } from '../../globalState';
import loadingImg from '../../images/loading.svg';
import { COUNTRIES } from '../../translations/countries';

interface ConfirmProps extends RouteComponentProps<{ username: string }> {}

const Profile: React.FC<ConfirmProps> = (props: ConfirmProps) => {
  const { global } = useContext(Global);
  const { dispatch } = useContext(Dispatch);
  const username = props.match.params.username;
  const countries = COUNTRIES[global.shared.language];

  const [state, setState] = useState({
    followLoading: false,
    pageLoading: true,
  });

  interface DataProps {
    category: string;
    published: boolean;
    previewId: string;
    thumbnailId: string;
  }

  interface StateInterface {
    array: DataProps[];
  }

  const [photos, setPhotos] = useState<StateInterface>({
    array: [],
  });

  const [user, setUser] = useState({
    avatarId: '',
    bio: '',
    canFollow: true,
    country: '',
    coverId: '',
    followers: 0,
    following: 0,
    fullName: '',
    isMe: false,
    loading: true,
    webSite: '',
  });

  const { followLoading, pageLoading } = state;
  const {
    avatarId,
    bio,
    canFollow,
    coverId,
    country,
    fullName,
    isMe,
    webSite,
    followers,
    following,
  } = user;

  const openFollowers = () => {
    dispatch({ type: SET_MODAL, value: 'followers' });
  };
  const openFollowing = () => {
    dispatch({ type: SET_MODAL, value: 'following' });
  };
  const callApi2 = async (path: string) => {
    setState((prev) => ({ ...prev, followLoading: true }));
    const response = await fetch(`${global.env.apiUrl}/user/${path}`, {
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
      setState((prev) => ({ ...prev, followLoading: false }));
      setUser(() => content.shared);
    }
  };
  const profile = () => {
    props.history.push('/my/profile');
  };
  const follow = () => {
    if (global.shared.loggedIn) {
      if (!followLoading) callApi2('follow');
    } else {
      dispatch({ type: SET_MODAL, value: 'login' });
    }
  };
  const unfollow = () => {
    if (global.shared.loggedIn) {
      if (!followLoading) callApi2('unfollow');
    } else {
      dispatch({ type: SET_MODAL, value: 'login' });
    }
  };

  useEffect(() => {
    async function callApi() {
      const response = await fetch(`${global.env.apiUrl}/user/profile`, {
        body: JSON.stringify({
          jwtToken: localStorage.getItem('jwtToken') || '',
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
        setState((prev) => ({ ...prev, pageLoading: false }));
        setUser(() => content.shared);
        setPhotos(() => ({ array: content.photos }));
      }
    }
    if (username) {
      callApi();
    }
  }, [global.env.apiUrl, global.shared.username, username]);

  const bgImage = (imageUrl: string) => {
    return {
      backgroundImage: `url(${imageUrl})`,
      backgroundSize: 'cover',
      height: '205px',
      width: '205px',
    };
  };
  const getRows = () => {
    const arr = [];
    for (let i = 0; i <= photos.array.length; i++) {
      if (photos.array[i]) {
        arr.push(
          <React.Fragment>
            <div className='profile--image'
              style={bgImage(global.env.imgUrl + photos.array[i].previewId)}
            ></div>
          </React.Fragment>
        );
      }
    }
    return arr;
  };
  return (
    <div className='profile'>
      {!pageLoading && (
        <React.Fragment>
          <div>
            {!avatarId && (
              <img
                src={global.env.imgUrl + 'initials/' + fullName.toLowerCase().charAt(0) + '.png'}
                className='profile--avatar'
                alt={fullName}
              />
            )}
            {avatarId && (
              <img
                src={global.env.imgUrl + avatarId}
                className='profile--avatar'
                alt={fullName}
              />
            )}
            <br />
            <h1 className='profile--name'>{fullName}</h1>
            <h2 className='profile--username'>@{username}</h2>
            <p className='profile--bio'>{bio}</p>
            <p className='profile--followers' onClick={openFollowers}>
              <b>{followers}</b> Followers
            </p>
            <p className='profile--following' onClick={openFollowing}>
              <b>{following}</b> Following
            </p>
            <br />
            {country && (
              <p className='profile--country'>{countries[country]}</p>
            )}
            {webSite && (
              <p className='profile--website'>
                <a href={webSite} target='_blank' rel='noopener noreferrer'>
                  {webSite.replace(/(^\w+:|^)\/\//, '')}
                </a>
              </p>
            )}
          </div>
          <div>
            <div className='profile--header'>
              <Cover
                isMe={isMe}
                placeholder={global.env.imgUrl + coverId}
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
                  {!isMe && canFollow && (
                    <button className='profile--follow' onClick={follow}>
                      {!followLoading ? (
                        <span className='profile--followIcon'>+ Follow</span>
                      ) : (
                        <img
                          src={loadingImg}
                          alt='loading'
                          className='loading'
                        />
                      )}
                    </button>
                  )}
                  {!isMe && !canFollow && (
                    <button className='profile--follow' onClick={unfollow}>
                      {!followLoading ? (
                        <span className='profile--unfollowIcon'>
                          X Unfollow
                        </span>
                      ) : (
                        <img
                          src={loadingImg}
                          alt='loading'
                          className='loading'
                        />
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className='profile--image-grid'>{getRows()}</div>
          </div>
        </React.Fragment>
      )}
    </div>
  );
};

export { Profile };
