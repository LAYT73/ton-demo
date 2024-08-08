import './patch-local-storage-for-github-pages';
import './polyfills';
import eruda from "eruda";

import React, {StrictMode} from 'react'
import {render} from 'react-dom';
import App from './App'
import './index.scss'

eruda.init();

render(
    <StrictMode>
      <App/>
    </StrictMode>,
    document.getElementById('root') as HTMLElement
);
