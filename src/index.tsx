import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from './Router';
import './scss/index.scss';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<Router />, document.getElementById('shell'));
serviceWorker.register();
