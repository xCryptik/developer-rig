import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './index.css';
import { Rig } from './rig';
import { wrap } from './util/react';
import { RigStore } from './core/rig-store';

const store = new RigStore();

ReactDOM.render(wrap(store, <Rig />), document.getElementById('root'));
