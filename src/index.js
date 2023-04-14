import React from 'react';
import ReactDOM from 'react-dom';
import ReactModal from 'react-modal';
import App from './App';
import './index.css';
import reportWebVitals from './reportWebVitals';
import EduAdd from './components/EduAdd';

const root = ReactDOM.createRoot(document.getElementById('root'));
ReactModal.setAppElement('#root');
root.render(
  <React.StrictMode>
    <EduAdd/>
  </React.StrictMode>,
);

reportWebVitals();