import React, { useContext, useState } from 'react';
import { Global } from '../../globalState';
import { Dispatch, SET_SHARED } from '../../globalState';
import loadingImg from '../../images/loading.svg';

const Preferences: React.FC = () => {
  const { global } = useContext(Global);
  const { dispatch } = useContext(Dispatch);

  const [state, setState] = useState({
    apiError: '',
    language: global.shared.language,
    currency: global.shared.currency,
    loading: false,
  });
  const {
    apiError,
    language,
    currency,
    loading,
  } = state;


  const onChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    event.persist();
    const { name, value } = event.target;
    setState((prev) => ({ ...prev, [name]: value }));
  };

  interface PropsInterface {
    language: string;
    currency: string;
  }
  const callApi = async (props: PropsInterface) => {
    setState((prev) => ({ ...prev, loading: true }));
    const response = await fetch(`${global.env.apiUrl}/my/preferences`, {
      body: JSON.stringify({
        currency: props.currency,
        jwtToken: localStorage.getItem('jwtToken'),
        language: props.language,
      }),
      headers: {
        // prettier-ignore
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });
    const content = await response.json();
    setState((prev) => ({ ...prev, loading: false, apiError: '' }));
    if (response.status === 200) {
      localStorage.setItem('jwtToken', content.jwtToken);
      dispatch({ type: SET_SHARED, value: content.shared });
    } else {
      setState((prev) => ({ ...prev, apiError: content.error }));
    }
  };

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    callApi({language, currency})
  };

  return (
    <span className='page'>
      <form onSubmit={onSubmit} className='form'>
        <h4 className='form--title'>Edit Preferences</h4>
        <div className='form--body'>
          <div>Localization</div>
          <div className='form--relative'>
            {apiError && <div className='error--api'>{apiError}</div>}

            <label>
              Language
              <select
                autoFocus
                name='language'
                onChange={onChange}
                value={language}
              >
                <option value='ca'>Català</option>
                <option value='cs'>Česky</option>
                <option value='da'>Dansk</option>
                <option value='de'>Deutsch</option>
                <option value='el'>Ελληνικά</option>
                <option value='en'>English</option>
                <option value='es'>Español</option>
                <option value='et'>Eesti</option>
                <option value='eu'>Basque</option>
                <option value='fil'>Filipino</option>
                <option value='fr'>Français</option>
                <option value='id'>Indonesian</option>
                <option value='is'>Íslenska</option>
                <option value='it'>Italiano</option>
                <option value='lt'>Lietuviškai</option>
                <option value='nl'>Nederlands</option>
                <option value='no'>Norsk</option>
                <option value='pl'>Polski</option>
                <option value='pt-br'>Português (Br)</option>
                <option value='pt'>Português (Pt)</option>
                <option value='ro'>Română</option>
                <option value='ru'>Русский</option>
                <option value='sk'>Slovensky</option>
                <option value='fi'>Suomi</option>
                <option value='sv'>Svenska</option>
                <option value='th'>ภาษาไทย</option>
                <option value='tr'>Türkçe</option>
                <option value='ja'>日本語</option>
                <option value='zh-hans'>简体中文</option>
                <option value='zh-hant'>繁體中文</option>
                <option value='ko'>한국어</option>
                <option value='sr'>Српски</option>
                <option value='sr-latn'>Srpski (Latinica)</option>
              </select>
            </label>

            <label>
              Currency
              <select
                name='currency'
                onChange={onChange}
                value={currency}
              >
                <option value='AUD'>Australian dollars ($)</option>
                <option value='BHD'>Bahrain dinars (BD)</option>
                <option value='BTC'>Bitcoin (Ƀ)</option>
                <option value='BRL'>Brazil reals (R$)</option>
                <option value='GBP'>British pounds (£)</option>
                <option value='BND'>Brunei dollars ($)</option>
                <option value='CAD'>Canadian dollars ($)</option>
                <option value='CNY'>Chinese yuan (¥)</option>
                <option value='CZK'>Czech koruny (Kč)</option>
                <option value='DKK'>Danish kroner (kr)</option>
                <option value='EGP'>Egyptian pounds (£)</option>
                <option value='EUR'>Euros (€)</option>
                <option value='HKD'>Hong Kong dollars ($)</option>
                <option value='HUF'>Hungarian forints (Ft)</option>
                <option value='INR'>Indian rupees (₹)</option>
                <option value='IDR'>Indonesian rupiahs (Rp)</option>
                <option value='ILS'>Israeli shekels (₪)</option>
                <option value='JPY'>Japanese yen (¥)</option>
                <option value='JOD'>Jordanian dinars (JD)</option>
                <option value='KZT'>Kazakh tenge (лв)</option>
                <option value='KWD'>Kuwaiti dinars (K.D.)</option>
                <option value='LTL'>Lithuanian litai (Lt)</option>
                <option value='MYR'>Malaysian ringgits (RM)</option>
                <option value='MXN'>Mexican pesos ($)</option>
                <option value='NZD'>New Zealand dollars ($)</option>
                <option value='NOK'>Norwegian kroner (kr)</option>
                <option value='PKR'>Pakistan rupees (₨)</option>
                <option value='PHP'>Philippine pesos (₱)</option>
                <option value='PLN'>Polish zloty (zł)</option>
                <option value='QAR'>Qatar riyals (﷼)</option>
                <option value='RON'>Romanian leu (L)</option>
                <option value='RUB'>Russian rubles (руб)</option>
                <option value='SAR'>Saudi riyals (﷼)</option>
                <option value='RSD'>Serbian dinars (Дин.)</option>
                <option value='SGD'>Singapore dollars ($)</option>
                <option value='ZAR'>South African rands (R)</option>
                <option value='KRW'>South Korean won (₩)</option>
                <option value='SEK'>Swedish kronor (kr)</option>
                <option value='CHF'>Swiss francs (CHF)</option>
                <option value='TWD'>Taiwan dollars (NT$)</option>
                <option value='THB'>Thai baht (฿)</option>
                <option value='TRY'>Turkish liras (₤)</option>
                <option value='USD'>U.S. dollars ($)</option>
                <option value='AED'>United Arab Emirates dirhams (AED)</option>
                <option value='VND'>Vietnamese dong (₫)</option>
              </select>
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

export { Preferences };
