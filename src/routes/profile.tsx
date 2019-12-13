import React, { useContext, useState } from 'react';
import { Error } from '../components/error';
import { Photo } from '../components/photo';
import { Global } from '../globalState';
import { Dispatch, SET_SHARED } from '../globalState';
import loadingImg from '../images/loading.svg';

const Profile: React.FC = () => {
  const { global } = useContext(Global);
  const { dispatch } = useContext(Dispatch);

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

  const onChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    event.persist();
    if (event.target.name === 'fullName' && state.fullNameError) {
      validate('fullName');
    }
    if (event.target.name === 'webSite' && state.webSiteError) {
      validate('webSite');
    }
    if (event.target.name === 'bio' && state.bioError) {
      validate('bio');
    }
    if (event.target.name === 'email' && state.emailError) {
      validate('email');
    }
    const { id, name, value, type } = event.target;

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
    const emailChanged = (props.email === global.shared.email) ? false : true;
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
              resizeTo={150}
              signedUrl={`${global.env.apiUrl}/upload/signed-url`}
              saveImg={`${global.env.apiUrl}/my/avatar`}
            />
            <label>
              Full Name
              <input
                type='text'
                name='fullName'
                value={fullName}
                onChange={onChange}
                className={fullNameError && 'form--error'}
                onBlur={onBlur}
                maxLength={70}
              />
              <Error error={fullNameError} />
            </label>

            <small>Your real name, so your friends can find you.</small>
            <label>
              Username
              <input
                type='text'
                name='username'
                value={username}
                onChange={onChange}
                disabled
              />
              <Error error={usernameError} />
            </label>
            <small>https://dicky.world/{username}</small>

            <label>
              Website
              <input
                type='text'
                name='webSite'
                value={webSite}
                onChange={onChange}
                className={webSiteError && 'form--error'}
                onBlur={onBlur}
                placeholder='https://www.'
              />
              <Error error={webSiteError} />
            </label>

            <label>
              Country
              <select name='country' value={country} onChange={onChange}>
                <option value=''>Select...</option>
                <option value='AX'>Aaland Islands</option>
                <option value='AF'>Afghanistan</option>
                <option value='AL'>Albania</option>
                <option value='DZ'>Algeria</option>
                <option value='AS'>American Samoa</option>
                <option value='AD'>Andorra</option>
                <option value='AO'>Angola</option>
                <option value='AI'>Anguilla</option>
                <option value='AQ'>Antarctica</option>
                <option value='AG'>Antigua And Barbuda</option>
                <option value='AR'>Argentina</option>
                <option value='AM'>Armenia</option>
                <option value='AW'>Aruba</option>
                <option value='AU'>Australia</option>
                <option value='AT'>Austria</option>
                <option value='AZ'>Azerbaijan</option>
                <option value='BS'>Bahamas</option>
                <option value='BH'>Bahrain</option>
                <option value='BD'>Bangladesh</option>
                <option value='BB'>Barbados</option>
                <option value='BY'>Belarus</option>
                <option value='BE'>Belgium</option>
                <option value='BZ'>Belize</option>
                <option value='BJ'>Benin</option>
                <option value='BM'>Bermuda</option>
                <option value='BT'>Bhutan</option>
                <option value='BO'>Bolivia</option>
                <option value='BA'>Bosnia And Herzegowina</option>
                <option value='BW'>Botswana</option>
                <option value='BV'>Bouvet Island</option>
                <option value='BR'>Brazil</option>
                <option value='IO'>British Indian Ocean Territory</option>
                <option value='BN'>Brunei Darussalam</option>
                <option value='BG'>Bulgaria</option>
                <option value='BF'>Burkina Faso</option>
                <option value='BI'>Burundi</option>
                <option value='KH'>Cambodia</option>
                <option value='CM'>Cameroon</option>
                <option value='CA'>Canada</option>
                <option value='CV'>Cape Verde</option>
                <option value='KY'>Cayman Islands</option>
                <option value='CF'>Central African Republic</option>
                <option value='TD'>Chad</option>
                <option value='CL'>Chile</option>
                <option value='CN'>China</option>
                <option value='CX'>Christmas Island</option>
                <option value='CC'>Cocos (Keeling) Islands</option>
                <option value='CO'>Colombia</option>
                <option value='KM'>Comoros</option>
                <option value='CD'>
                  Congo, Democratic Republic Of (Was Zaire)
                </option>
                <option value='CG'>Congo, Republic Of</option>
                <option value='CK'>Cook Islands</option>
                <option value='CR'>Costa Rica</option>
                <option value='CI'>Cote D'Ivoire</option>
                <option value='HR'>Croatia (Local Name: Hrvatska)</option>
                <option value='CU'>Cuba</option>
                <option value='CY'>Cyprus</option>
                <option value='CZ'>Czech Republic</option>
                <option value='DK'>Denmark</option>
                <option value='DJ'>Djibouti</option>
                <option value='DM'>Dominica</option>
                <option value='DO'>Dominican Republic</option>
                <option value='TL'>East Timor</option>
                <option value='EC'>Ecuador</option>
                <option value='EG'>Egypt</option>
                <option value='SV'>El Salvador</option>
                <option value='GQ'>Equatorial Guinea</option>
                <option value='ER'>Eritrea</option>
                <option value='EE'>Estonia</option>
                <option value='ET'>Ethiopia</option>
                <option value='FK'>Falkland Islands (Malvinas)</option>
                <option value='FO'>Faroe Islands</option>
                <option value='FJ'>Fiji</option>
                <option value='FI'>Finland</option>
                <option value='FR'>France</option>
                <option value='GF'>French Guiana</option>
                <option value='PF'>French Polynesia</option>
                <option value='TF'>French Southern Territories</option>
                <option value='GA'>Gabon</option>
                <option value='GM'>Gambia</option>
                <option value='GE'>Georgia</option>
                <option value='DE'>Germany</option>
                <option value='GH'>Ghana</option>
                <option value='GI'>Gibraltar</option>
                <option value='GR'>Greece</option>
                <option value='GL'>Greenland</option>
                <option value='GD'>Grenada</option>
                <option value='GP'>Guadeloupe</option>
                <option value='GU'>Guam</option>
                <option value='GT'>Guatemala</option>
                <option value='GN'>Guinea</option>
                <option value='GW'>Guinea-Bissau</option>
                <option value='GY'>Guyana</option>
                <option value='HT'>Haiti</option>
                <option value='HM'>Heard And Mc Donald Islands</option>
                <option value='HN'>Honduras</option>
                <option value='HK'>Hong Kong</option>
                <option value='HU'>Hungary</option>
                <option value='IS'>Iceland</option>
                <option value='IN'>India</option>
                <option value='ID'>Indonesia</option>
                <option value='IR'>Iran (Islamic Republic Of)</option>
                <option value='IQ'>Iraq</option>
                <option value='IE'>Ireland</option>
                <option value='IL'>Israel</option>
                <option value='IT'>Italy</option>
                <option value='JM'>Jamaica</option>
                <option value='JP'>Japan</option>
                <option value='JO'>Jordan</option>
                <option value='KZ'>Kazakhstan</option>
                <option value='KE'>Kenya</option>
                <option value='KI'>Kiribati</option>
                <option value='KP'>Korea, North</option>
                <option value='KR'>Korea, Republic Of</option>
                <option value='KW'>Kuwait</option>
                <option value='KG'>Kyrgyzstan</option>
                <option value='LA'>Lao People'S Democratic Republic</option>
                <option value='LV'>Latvia</option>
                <option value='LB'>Lebanon</option>
                <option value='LS'>Lesotho</option>
                <option value='LR'>Liberia</option>
                <option value='LY'>Libyan Arab Jamahiriya</option>
                <option value='LI'>Liechtenstein</option>
                <option value='LT'>Lithuania</option>
                <option value='LU'>Luxembourg</option>
                <option value='MO'>Macau</option>
                <option value='MK'>
                  Macedonia, The Former Yugoslav Republic Of
                </option>
                <option value='MG'>Madagascar</option>
                <option value='MW'>Malawi</option>
                <option value='MY'>Malaysia</option>
                <option value='MV'>Maldives</option>
                <option value='ML'>Mali</option>
                <option value='MT'>Malta</option>
                <option value='MH'>Marshall Islands</option>
                <option value='MQ'>Martinique</option>
                <option value='MR'>Mauritania</option>
                <option value='MU'>Mauritius</option>
                <option value='YT'>Mayotte</option>
                <option value='MX'>Mexico</option>
                <option value='FM'>Micronesia, Federated States Of</option>
                <option value='MD'>Moldova, Republic Of</option>
                <option value='MC'>Monaco</option>
                <option value='MN'>Mongolia</option>
                <option value='ME'>Montenegro</option>
                <option value='MS'>Montserrat</option>
                <option value='MA'>Morocco</option>
                <option value='MZ'>Mozambique</option>
                <option value='MM'>Myanmar</option>
                <option value='NA'>Namibia</option>
                <option value='NR'>Nauru</option>
                <option value='NP'>Nepal</option>
                <option value='NL'>Netherlands</option>
                <option value='AN'>Netherlands Antilles</option>
                <option value='NC'>New Caledonia</option>
                <option value='NZ'>New Zealand</option>
                <option value='NI'>Nicaragua</option>
                <option value='NE'>Niger</option>
                <option value='NG'>Nigeria</option>
                <option value='NU'>Niue</option>
                <option value='NF'>Norfolk Island</option>
                <option value='MP'>Northern Mariana Islands</option>
                <option value='NO'>Norway</option>
                <option value='OM'>Oman</option>
                <option value='PK'>Pakistan</option>
                <option value='PW'>Palau</option>
                <option value='PS'>Palestinian Territory</option>
                <option value='PA'>Panama</option>
                <option value='PG'>Papua New Guinea</option>
                <option value='PY'>Paraguay</option>
                <option value='PE'>Peru</option>
                <option value='PH'>Philippines</option>
                <option value='PN'>Pitcairn</option>
                <option value='PL'>Poland</option>
                <option value='PT'>Portugal</option>
                <option value='PR'>Puerto Rico</option>
                <option value='QA'>Qatar</option>
                <option value='RE'>Reunion</option>
                <option value='RO'>Romania</option>
                <option value='RU'>Russian Federation</option>
                <option value='RW'>Rwanda</option>
                <option value='SH'>Saint Helena</option>
                <option value='KN'>Saint Kitts And Nevis</option>
                <option value='LC'>Saint Lucia</option>
                <option value='PM'>Saint Pierre And Miquelon</option>
                <option value='VC'>Saint Vincent And The Grenadines</option>
                <option value='WS'>Samoa</option>
                <option value='SM'>San Marino</option>
                <option value='ST'>Sao Tome And Principe</option>
                <option value='SA'>Saudi Arabia</option>
                <option value='SN'>Senegal</option>
                <option value='RS'>Serbia</option>
                <option value='SC'>Seychelles</option>
                <option value='SL'>Sierra Leone</option>
                <option value='SG'>Singapore</option>
                <option value='SK'>Slovakia</option>
                <option value='SI'>Slovenia</option>
                <option value='SB'>Solomon Islands</option>
                <option value='SO'>Somalia</option>
                <option value='ZA'>South Africa</option>
                <option value='GS'>
                  South Georgia And The South Sandwich Islands
                </option>
                <option value='SS'>South Sudan</option>
                <option value='ES'>Spain</option>
                <option value='LK'>Sri Lanka</option>
                <option value='SD'>Sudan</option>
                <option value='SR'>Suriname</option>
                <option value='SJ'>Svalbard And Jan Mayen Islands</option>
                <option value='SZ'>Swaziland</option>
                <option value='SE'>Sweden</option>
                <option value='CH'>Switzerland</option>
                <option value='SY'>Syrian Arab Republic</option>
                <option value='TW'>Taiwan</option>
                <option value='TJ'>Tajikistan</option>
                <option value='TZ'>Tanzania, United Republic Of</option>
                <option value='TH'>Thailand</option>
                <option value='TL'>Timor-Leste</option>
                <option value='TG'>Togo</option>
                <option value='TK'>Tokelau</option>
                <option value='TO'>Tonga</option>
                <option value='TT'>Trinidad And Tobago</option>
                <option value='TN'>Tunisia</option>
                <option value='TR'>Turkey</option>
                <option value='TM'>Turkmenistan</option>
                <option value='TC'>Turks And Caicos Islands</option>
                <option value='TV'>Tuvalu</option>
                <option value='UG'>Uganda</option>
                <option value='UA'>Ukraine</option>
                <option value='AE'>United Arab Emirates</option>
                <option value='GB'>United Kingdom</option>
                <option value='US'>United States of America</option>
                <option value='UM'>United States Minor Outlying Islands</option>
                <option value='UY'>Uruguay</option>
                <option value='UZ'>Uzbekistan</option>
                <option value='VU'>Vanuatu</option>
                <option value='VA'>Vatican City State (Holy See)</option>
                <option value='VE'>Venezuela</option>
                <option value='VN'>Viet Nam</option>
                <option value='VG'>Virgin Islands (British)</option>
                <option value='VI'>Virgin Islands (U.S.)</option>
                <option value='WF'>Wallis And Futuna Islands</option>
                <option value='EH'>Western Sahara</option>
                <option value='YE'>Yemen</option>
                <option value='ZM'>Zambia</option>
                <option value='ZW'>Zimbabwe</option>
              </select>
            </label>

            <label>
              Bio
              <textarea
                name='bio'
                value={bio}
                onChange={onChange}
                className={bioError && 'form--error'}
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
                type='text'
                id='email'
                name='email'
                value={email}
                onChange={onChange}
                onBlur={onBlur}
                className={emailError && 'form--error'}
              />
              <Error error={emailError} />
            </label>
            <small>Email will not be publicly displayed.</small>

            <label>Birthday</label>
            <select
              className='form--dob-year'
              name='year'
              value={year}
              onChange={onChange}
            >
              <option value='0'>Year</option>
              <option value='2019'>2019</option>
              <option value='2018'>2018</option>
              <option value='2017'>2017</option>
              <option value='2016'>2016</option>
              <option value='2015'>2015</option>
              <option value='2014'>2014</option>
              <option value='2013'>2013</option>
              <option value='2012'>2012</option>
              <option value='2011'>2011</option>
              <option value='2010'>2010</option>
              <option value='2009'>2009</option>
              <option value='2008'>2008</option>
              <option value='2007'>2007</option>
              <option value='2006'>2006</option>
              <option value='2005'>2005</option>
              <option value='2004'>2004</option>
              <option value='2003'>2003</option>
              <option value='2002'>2002</option>
              <option value='2001'>2001</option>
              <option value='2000'>2000</option>
              <option value='1999'>1999</option>
              <option value='1998'>1998</option>
              <option value='1997'>1997</option>
              <option value='1996'>1996</option>
              <option value='1995'>1995</option>
              <option value='1994'>1994</option>
              <option value='1993'>1993</option>
              <option value='1992'>1992</option>
              <option value='1991'>1991</option>
              <option value='1990'>1990</option>
              <option value='1989'>1989</option>
              <option value='1988'>1988</option>
              <option value='1987'>1987</option>
              <option value='1986'>1986</option>
              <option value='1985'>1985</option>
              <option value='1984'>1984</option>
              <option value='1983'>1983</option>
              <option value='1982'>1982</option>
              <option value='1981'>1981</option>
              <option value='1980'>1980</option>
              <option value='1979'>1979</option>
              <option value='1978'>1978</option>
              <option value='1977'>1977</option>
              <option value='1976'>1976</option>
              <option value='1975'>1975</option>
              <option value='1974'>1974</option>
              <option value='1973'>1973</option>
              <option value='1972'>1972</option>
              <option value='1971'>1971</option>
              <option value='1970'>1970</option>
              <option value='1969'>1969</option>
              <option value='1968'>1968</option>
              <option value='1967'>1967</option>
              <option value='1966'>1966</option>
              <option value='1965'>1965</option>
              <option value='1964'>1964</option>
              <option value='1963'>1963</option>
              <option value='1962'>1962</option>
              <option value='1961'>1961</option>
              <option value='1960'>1960</option>
              <option value='1959'>1959</option>
              <option value='1958'>1958</option>
              <option value='1957'>1957</option>
              <option value='1956'>1956</option>
              <option value='1955'>1955</option>
              <option value='1954'>1954</option>
              <option value='1953'>1953</option>
              <option value='1952'>1952</option>
              <option value='1951'>1951</option>
              <option value='1950'>1950</option>
              <option value='1949'>1949</option>
              <option value='1948'>1948</option>
              <option value='1947'>1947</option>
              <option value='1946'>1946</option>
              <option value='1945'>1945</option>
              <option value='1944'>1944</option>
              <option value='1943'>1943</option>
              <option value='1942'>1942</option>
              <option value='1941'>1941</option>
              <option value='1940'>1940</option>
              <option value='1939'>1939</option>
              <option value='1938'>1938</option>
              <option value='1937'>1937</option>
              <option value='1936'>1936</option>
              <option value='1935'>1935</option>
              <option value='1934'>1934</option>
              <option value='1933'>1933</option>
              <option value='1932'>1932</option>
              <option value='1931'>1931</option>
              <option value='1930'>1930</option>
              <option value='1929'>1929</option>
              <option value='1928'>1928</option>
              <option value='1927'>1927</option>
              <option value='1926'>1926</option>
              <option value='1925'>1925</option>
              <option value='1924'>1924</option>
              <option value='1923'>1923</option>
              <option value='1922'>1922</option>
              <option value='1921'>1921</option>
              <option value='1920'>1920</option>
              <option value='1919'>1919</option>
              <option value='1918'>1918</option>
              <option value='1917'>1917</option>
              <option value='1916'>1916</option>
              <option value='1915'>1915</option>
              <option value='1914'>1914</option>
              <option value='1913'>1913</option>
              <option value='1912'>1912</option>
              <option value='1911'>1911</option>
              <option value='1910'>1910</option>
              <option value='1909'>1909</option>
              <option value='1908'>1908</option>
              <option value='1907'>1907</option>
              <option value='1906'>1906</option>
              <option value='1905'>1905</option>
              <option value='1904'>1904</option>
              <option value='1903'>1903</option>
              <option value='1902'>1902</option>
              <option value='1901'>1901</option>
              <option value='1900'>1900</option>
            </select>
            <select
              className='form--dob-month'
              name='month'
              value={month}
              onChange={onChange}
            >
              <option value='0'>Month</option>
              <option value='1'>January</option>
              <option value='2'>February</option>
              <option value='3'>March</option>
              <option value='4'>April</option>
              <option value='5'>May</option>
              <option value='6'>June</option>
              <option value='7'>July</option>
              <option value='8'>August</option>
              <option value='9'>September</option>
              <option value='10'>October</option>
              <option value='11'>November</option>
              <option value='12'>December</option>
            </select>
            <select
              name='day'
              value={day}
              onChange={onChange}
              className={`form--dob-day ${dobError && 'form--error'}`}
            >
              <option value='0'>Day</option>
              <option value='1'>1</option>
              <option value='2'>2</option>
              <option value='3'>3</option>
              <option value='4'>4</option>
              <option value='5'>5</option>
              <option value='6'>6</option>
              <option value='7'>7</option>
              <option value='8'>8</option>
              <option value='9'>9</option>
              <option value='10'>10</option>
              <option value='11'>11</option>
              <option value='12'>12</option>
              <option value='13'>13</option>
              <option value='14'>14</option>
              <option value='15'>15</option>
              <option value='16'>16</option>
              <option value='17'>17</option>
              <option value='18'>18</option>
              <option value='19'>19</option>
              <option value='20'>20</option>
              <option value='21'>21</option>
              <option value='22'>22</option>
              <option value='23'>23</option>
              <option value='24'>24</option>
              <option value='25'>25</option>
              <option value='26'>26</option>
              <option value='27'>27</option>
              <option value='28'>28</option>
              <option value='29'>29</option>
              <option value='30'>30</option>
              <option value='31'>31</option>
            </select>

            <label>Gender</label>
            <label className='form--radio-label'>
              <input
                type='radio'
                name='gender'
                id='male'
                checked={gender === 'male'}
                onChange={onChange}
              />
              <span>Male</span>
            </label>
            <label className='form--radio-label'>
              <input
                type='radio'
                name='gender'
                id='female'
                checked={gender === 'female'}
                onChange={onChange}
              />
              <span>Female</span>
            </label>
            <label className='form--radio-label'>
              <input
                type='radio'
                name='gender'
                id='other'
                checked={gender === 'other'}
                onChange={onChange}
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

export { Profile };