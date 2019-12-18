import React, { useContext, useState } from 'react';
import { Error } from '../../components/error';
import { Photo } from '../../components/photo';
import { Global } from '../../globalState';
import { Dispatch, SET_SHARED } from '../../globalState';
import loadingImg from '../../images/loading.svg';
import { COUNTRIES } from '../../translations/countries';
import { MONTHS } from '../../translations/months';

const Settings: React.FC = () => {
  const { global } = useContext(Global);
  const { dispatch } = useContext(Dispatch);

  const countries = COUNTRIES[global.shared.language];
  const months = MONTHS[global.shared.language];

  const dob = global.shared.dob
    ? new Date(global.shared.dob)
    : new Date('0-0-0');
  const dobDay = dob.getDate() || 0;
  const dobMonth = dob.getMonth() + 1 || 0;
  const dobYear = dob.getFullYear() || 0;

  let placeholder: string;
  if (!global.shared.avatarId) {
    const initial = global.shared.fullName
      .split(' ')[0]
      .charAt(0)
      .toLowerCase();
    placeholder = global.env.imgUrl + `initials/${initial}.png`;
  } else {
    placeholder = global.env.imgUrl + global.shared.avatarId;
  }

  const [state, setState] = useState({
    apiError: '',
    bio: global.shared.bio || '',
    bioError: '',
    country: global.shared.country,
    day: dobDay.toString(),
    dobError: '',
    email: global.shared.email,
    emailError: '',
    fullName: global.shared.fullName,
    fullNameError: '',
    gender: global.shared.gender || 'other',
    loading: false,
    month: dobMonth.toString(),
    username: global.shared.username || '',
    usernameError: '',
    webSite: global.shared.webSite || '',
    webSiteError: '',
    year: dobYear.toString(),
  });
  const {
    apiError,
    bio,
    bioError,
    country,
    day,
    dobError,
    email,
    emailError,
    fullName,
    fullNameError,
    gender,
    loading,
    month,
    username,
    usernameError,
    webSite,
    webSiteError,
    year,
  } = state;

  const generateYearOptions = () => {
    const arr = [];
    const startYear = 1900;
    const endYear = new Date().getFullYear();
    for (let i = endYear; i >= startYear; i--) {
      arr.push(<option value={i}>{i}</option>);
    }
    return arr;
  };

  const generateDayOptions = () => {
    const arr = [];
    const startDay = 1;
    const endDay = 31;
    for (let i = startDay; i <= endDay; i++) {
      arr.push(<option value={i}>{i}</option>);
    }
    return arr;
  };

  const onChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    event.persist();
    const { id, name, value, type } = event.target;

    if (name === 'fullName' && fullNameError) {
      validate('fullName');
    }
    if (name === 'webSite' && webSiteError) {
      validate('webSite');
    }
    if (name === 'bio' && bioError) {
      validate('bio');
    }
    if (name === 'email' && emailError) {
      validate('email');
    }
    if (type === 'radio') {
      setState((prev) => ({ ...prev, gender: id }));
    } else {
      setState((prev) => ({ ...prev, [name]: value }));
    }
  };

  interface PropsInterface {
    bio: string;
    country: string;
    day: string;
    email: string;
    fullName: string;
    gender: string;
    month: string;
    webSite: string;
    year: string;
  }
  const callApi = async (props: PropsInterface) => {
    setState((prev) => ({ ...prev, loading: true }));
    const emailChanged = props.email === global.shared.email ? false : true;
    const response = await fetch(`${global.env.apiUrl}/my/profile`, {
      body: JSON.stringify({
        bio: props.bio,
        country: props.country || '',
        day: props.day,
        email: props.email,
        emailChanged,
        fullName: props.fullName,
        gender: props.gender,
        jwtToken: localStorage.getItem('jwtToken'),
        month: props.month,
        webSite: props.webSite || '',
        year: props.year,
      }),
      headers: {
        // prettier-ignore
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });
    const content = await response.json();
    setState((prev) => ({ ...prev, loading: false }));
    if (response.status === 200) {
      localStorage.setItem('jwtToken', content.jwtToken);
      dispatch({ type: SET_SHARED, value: content.shared });
    } else {
      setState((prev) => ({ ...prev, apiError: content.error }));
    }
  };

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const fullNameValidation = validate('fullName');
    const webSiteValidation = validate('webSite');
    const bioValidation = validate('bio');
    const emailValidation = validate('email');

    if (
      fullNameValidation &&
      webSiteValidation &&
      bioValidation &&
      emailValidation
    ) {
      callApi({
        bio: state.bio,
        country: state.country,
        day: state.day,
        email: state.email,
        fullName: state.fullName,
        gender: state.gender,
        month: state.month,
        webSite: state.webSite,
        year: state.year,
      });
    }
  };

  const onBlur = (event: React.ChangeEvent<HTMLInputElement>) => {
    validate(event.target.name);
  };

  const validate = (name: string) => {
    if (name === 'fullName') {
      if (!/^.{2,}$/.test(fullName)) {
        setState((prev) => ({
          ...prev,
          fullNameError: '2 charectors or longer',
        }));
        return false;
      } else {
        setState((prev) => ({ ...prev, fullNameError: '' }));
        return true;
      }
    }
    if (name === 'webSite') {
      if (
        webSite &&
        webSite.length > 0 &&
        !/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/.test(
          webSite
        )
      ) {
        setState((prev) => ({
          ...prev,
          webSiteError: 'Must start with http:// or https://',
        }));
        return false;
      } else {
        setState((prev) => ({ ...prev, webSiteError: '' }));
        return true;
      }
    }
    if (name === 'bio') {
      if (bio && bio.length > 0 && bio.length > 256) {
        setState((prev) => ({
          ...prev,
          bioError: 'Must be less than 256 charectors',
        }));
        return false;
      } else {
        setState((prev) => ({ ...prev, bioError: '' }));
        return true;
      }
    }
    if (name === 'email') {
      if (!/\S+@\S+\.\S+/.test(email)) {
        setState((prev) => ({
          ...prev,
          emailError: 'A valid email address is required.',
        }));
        return false;
      } else {
        setState((prev) => ({ ...prev, emailError: '' }));
        return true;
      }
    }
  };

  return (
    <span className='page'>
      <form onSubmit={onSubmit} className='form'>
        <h4 className='form--title'>Edit Profile</h4>
        <div className='form--body'>
          <div>Profile</div>
          <div className='form--relative'>
            {apiError && <div className='error--api'>{apiError}</div>}
            <label>Photo</label>
            <Photo
              placeholder={placeholder}
              resizeTo={180}
              signedUrl={`${global.env.apiUrl}/upload/signed-url`}
              saveImg={`${global.env.apiUrl}/my/avatar`}
            />
            <label>
              Full Name
              <input
                autoFocus
                className={fullNameError && 'form--error'}
                maxLength={70}
                name='fullName'
                onBlur={onBlur}
                onChange={onChange}
                type='text'
                value={fullName}
              />
              <Error error={fullNameError} />
            </label>

            <small>Your real name, so your friends can find you.</small>
            <label>
              Username
              <input
                disabled
                name='username'
                onChange={onChange}
                type='text'
                value={username}
              />
              <Error error={usernameError} />
            </label>
            <small>https://dicky.world/{username}</small>

            <label>
              Website
              <input
                className={webSiteError && 'form--error'}
                name='webSite'
                onBlur={onBlur}
                onChange={onChange}
                placeholder='https://www.'
                type='text'
                value={webSite}
              />
              <Error error={webSiteError} />
            </label>

            <label>
              Country
              <select name='country' value={country} onChange={onChange}>
                <option key='' value=''>
                  Select...
                </option>
                {Object.entries(countries).map(([key, display]) => (
                  <option key={key} value={key}>
                    {display}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Bio
              <textarea
                className={bioError && 'form--error'}
                name='bio'
                onChange={onChange}
                value={bio}
              />
              <Error error={bioError} />
            </label>
          </div>
        </div>
        <div className='form--body'>
          <div>Account</div>
          <div>
            <label>
              Email Address
              <input
                className={emailError && 'form--error'}
                id='email'
                name='email'
                onBlur={onBlur}
                onChange={onChange}
                type='text'
                value={email}
              />
              <Error error={emailError} />
            </label>
            <small>Email will not be publicly displayed.</small>

            <label>Birthday</label>
            <select
              className='form--dob-year'
              name='year'
              onChange={onChange}
              value={year}
            >
              <option value='0'>Year</option>
              {generateYearOptions()}
            </select>
            <select
              className='form--dob-month'
              name='month'
              onChange={onChange}
              value={month}
            >
              {Object.entries(months).map(([key, display]) => (
                <option key={key} value={key}>
                  {display}
                </option>
              ))}
            </select>
            <select
              className={`form--dob-day ${dobError && 'form--error'}`}
              name='day'
              onChange={onChange}
              value={day}
            >
              <option value='0'>Day</option>
              {generateDayOptions()}
            </select>

            <label>Gender</label>
            <label className='form--radio-label'>
              <input
                checked={gender === 'male'}
                id='male'
                name='gender'
                onChange={onChange}
                type='radio'
              />
              <span>Male</span>
            </label>
            <label className='form--radio-label'>
              <input
                checked={gender === 'female'}
                id='female'
                name='gender'
                onChange={onChange}
                type='radio'
              />
              <span>Female</span>
            </label>
            <label className='form--radio-label'>
              <input
                checked={gender === 'other'}
                id='other'
                name='gender'
                onChange={onChange}
                type='radio'
              />
              <span>Other</span>
            </label>
          </div>
        </div>
        <div className='form--footer'>
          <small></small>
          <div>
            <button color='primary'>
              {!loading ? (
                'Save Changes'
              ) : (
                <img src={loadingImg} alt='loading' className='loading' />
              )}
            </button>
          </div>
        </div>
      </form>
    </span>
  );
};

export { Settings };
