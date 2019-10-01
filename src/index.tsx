import React from 'react';
import ReactDOM from 'react-dom';
import './scss/index.scss';
import { Router } from './Router';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<Router />, document.getElementById('shell'));
serviceWorker.register();
