import React, { useContext, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Cover } from '../../components/cover';
import { Global } from '../../globalState';
import { Dispatch, SET_MODAL } from '../../globalState';
import loadingImg from '../../images/loading.svg';
import { COUNTRIES } from '../../translations/countries';

interface ConfirmProps extends RouteComponentProps<{ username: string }> {}

const Photos: React.FC<ConfirmProps> = (props: ConfirmProps) => {
  const { global } = useContext(Global);
  const { dispatch } = useContext(Dispatch);
  const username = props.match.params.username;
  const countries = COUNTRIES[global.shared.language];

  const [state, setState] = useState({
    followLoading: false,
    pageLoading: true,
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
      }
    }
    if (username) {
      callApi();
    }
  }, [global.env.apiUrl, global.shared.username, username]);
  return (
    <div className='photos'>
Photos
    </div>
  );
};

export { Photos };
