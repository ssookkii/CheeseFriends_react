import React from 'react';
<<<<<<< HEAD
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
=======
import ReactDOM from 'react-dom';
import ReactModal from 'react-modal';
import App from './App';
import './index.css';
>>>>>>> 6e94ae91f18d77189343696daaee6e09b43b5b58
import reportWebVitals from './reportWebVitals';
import EduAdd from './components/EduAdd';

const root = ReactDOM.createRoot(document.getElementById('root'));
<<<<<<< HEAD
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
=======
ReactModal.setAppElement('#root');
root.render(
  <React.StrictMode>
    <EduAdd/>
  </React.StrictMode>,
);

reportWebVitals();
>>>>>>> 6e94ae91f18d77189343696daaee6e09b43b5b58
