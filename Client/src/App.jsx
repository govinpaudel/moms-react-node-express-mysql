import './App.scss'
import {Route,Routes} from "react-router-dom";
import Home from "./Pages/Home";
import Login from './Pages/Login';
import Register from './Pages/Register';
import Logout from './Pages/Logout';
import Listvoucher from './Pages/Voucher/Listvoucher';
import Addvoucher from './Pages/Voucher/addvoucher';
import MisilSearch from './Pages/Misil/MisilSearch';

function App() {
  return (
    <>
    <div className="App__main-page-content">
        <Routes>
          <Route path="/" element={<Home />} />          
          <Route path='/register' element={<Register/>}/>
          <Route path='/login' element={<Login/>} />
          <Route path='/logout' element={<Logout/>}/>
          {/* App Routes Starts */}
          <Route path="/home" element={<Home />} >
          <Route path='' element={<Listvoucher/>}/>
          <Route path='listvoucher' element={<Listvoucher/>}/>
          <Route path='addvoucher' element={<Addvoucher/>}/>
          <Route path='misilsearch' element={<MisilSearch/>}/>
          </Route>
          {/* App Routes Ends */}
          </Routes>
          </div>
    </>
  )
}

export default App
