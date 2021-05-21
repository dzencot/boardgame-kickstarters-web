import ReactDOM from 'react-dom';
import './index.scss';
import reportWebVitals from './reportWebVitals';
import init from './init.jsx';
import getLogger from './lib/logger.js';

localStorage.debug = 'board-kick:*';
const log = getLogger('index');

const app = async () => {
  // eslint-disable-next-line
  const vdom = await init();
  log('test');

  ReactDOM.render(vdom, document.getElementById('root'));

  // If you want to start measuring performance in your app, pass a function
  // to log results (for example: reportWebVitals(console.log))
  // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
  reportWebVitals();
};

app();
