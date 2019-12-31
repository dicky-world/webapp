import React, { useContext } from 'react';
import { Global } from '../../globalState';
// import { Dispatch } from '../../globalState';

// import ScatterJS from 'scatterjs-core';
// import ScatterEOS from 'scatterjs-plugin-eosjs2';
// ScatterJS.plugins(new ScatterEOS());

// declare global {
//   interface Window {
//     // tslint:disable-next-line: no-any
//     ScatterJS: any;
//   }
// }

const Verification: React.FC = () => {
  const { global } = useContext(Global);
  // const { dispatch } = useContext(Dispatch);

  // const userAgent = window.navigator.userAgent;
  // const platform = window.navigator.platform;
  // const macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'];
  // const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];
  // const iosPlatforms = ['iPhone', 'iPad', 'iPod'];
  // let downloadLink = '';
  // if (macosPlatforms.indexOf(platform) !== -1) {
  //   downloadLink =
  //     'https://download.lynxwallet.io/Lynx-Wallet-2-10-1-048585c.dmg';
  // } else if (iosPlatforms.indexOf(platform) !== -1) {
  //   downloadLink = 'iOS';
  // } else if (windowsPlatforms.indexOf(platform) !== -1) {
  //   downloadLink =
  //     'https://download.lynxwallet.io/Lynx-Wallet-Setup-2-10-1-048585c.exe';
  // } else if (/Android/.test(userAgent)) {
  //   downloadLink = 'Android';
  // } else if (!downloadLink && /Linux/.test(platform)) {
  //   downloadLink =
  //     'https://download.lynxwallet.io/Lynx-Wallet-2-10-1-048585c.AppImage';
  // }

  // ScatterJS.scatter.connect('Dicky').then((connected: boolean) => {
  //   if (!connected) return false;
  //   const scatter = ScatterJS.scatter;
  //   window.ScatterJS = null;
  //   // push scatter to state
  // });

  return (
    <span className='page'>
      <form className='form'>
        <h4 className='form--title'>Verification</h4>
        <div className='form--body'>
          <div>Contacts</div>
          <div className='form--relative'>
            <label>Verify Email</label>
            <small>{global.shared.email}</small>
            <label>Verify Mobile</label>
            <small>Resend</small>
          </div>
        </div>
        <div className='form--body'>
          <div>Documents</div>
          <div className='form--relative'>
            <label>Government issued identification</label>
            <small>Drivers licence, passport or national Id</small>
            <label>Proof of address</label>
            <small>Utility bill or rental contract</small>
          </div>
        </div>
        <div className='form--body'>
          <div>Selfie</div>
          <div className='form--relative'>
            <label>Full frame face</label>
            <small>No hat, glasses or backgorund</small>
            <label>Holding Id</label>
            <small>Face and ID must be fully visable</small>
          </div>
        </div>
        <div className='form--footer'>
          <small>
            Providing false information is considered a breach of Dicky.world
            Terms of Service
          </small>
          <div>{/* <button color='primary'>Verify Identity</button> */}</div>
        </div>
      </form>
    </span>
  );
};

export { Verification };
