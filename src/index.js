import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Rig } from './rig';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<Rig />, document.getElementById('root'));
registerServiceWorker();
