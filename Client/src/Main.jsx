import { createRoot } from 'react-dom/client'
import './main.scss';
import './Tailwind.css';
import App from './App';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { HashRouter as Router } from "react-router-dom";

createRoot(document.getElementById('root')).render(
  <>
    <ToastContainer />
    <Router>
      <App />
    </Router>
  </>
)
