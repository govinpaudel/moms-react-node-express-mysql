import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { createRoot } from 'react-dom/client';
import { HashRouter as Router } from "react-router-dom";

import App from './App';
import './Main.scss';

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AuthProvider } from "./Context/AuthContext";

createRoot(document.getElementById('root')).render(
  <>
    <ToastContainer />
    <Router>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Router>
  </>
);
