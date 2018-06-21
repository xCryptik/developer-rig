import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Rig } from './rig';
import { wrap } from './util/react';
import { store } from './core/rig';

ReactDOM.render(wrap(store, <Rig />), document.getElementById('root'));
