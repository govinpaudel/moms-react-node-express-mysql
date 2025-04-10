import './App.scss'
import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Login from './Pages/Login';
import Register from './Pages/Register';
import Logout from './Pages/Logout';
import Listvoucher from './Pages/Voucher/Listvoucher';
import Addvoucher from './Pages/Voucher/Addvoucher';
import MisilSearch from './Pages/Misil/MisilSearch';
import Protected_route from './Utils/Protected_route';
import KittaSearch from './Pages/Kitta/KittaSearch';
import Bargikaran from './Pages/Bargikaran/bargikaran';
import VoucherSummary from './Pages/Voucher/VoucherSummary';
import VoucherMonthly from './Pages/Voucher/VoucherMonthly';
import VoucherFant from './Pages/Voucher/VoucherFant';
import Editvoucher from './Pages/Voucher/Editvoucher';
import Voucherdetails from './Pages/Voucher/Voucherdetails';
import ListPoka from './Pages/Misil/ListPoka';
import AddPoka from './Pages/Misil/AddPoka';
import AddMisil from './Pages/Misil/AddMisil';
import Admin from './Pages/Admin/Admin';
import ListUsers from './Pages/Admin/ListUsers';
import ListNapas from './Pages/Admin/ListNapas';
import ListParms from './Pages/Admin/ListParms';
import ListFants from './Pages/Admin/ListFants';
import ChangePassword from './Pages/ChangePassword';
import ResetPassword from './Pages/ResetPassword';
import SuperAdmin from './Pages/SuperAdmin/SuperAdmin';
import ListAdminUsers from './Pages/SuperAdmin/ListAdminUsers';
import ListBadhfand from './Pages/SuperAdmin/ListBadhfand';
import ListOffices from './Pages/SuperAdmin/ListOffices';

function App() {
  return (
    <>
      <div className="App__main-page-content">
        <Routes>
          <Route element={<Protected_route />}>
            <Route path="/" element={<Home />} />            
            {/* App Routes Starts */}
            <Route path="/home" element={<Home />} >
            {/* Voucher routes starts */}
              <Route path='' element={<Listvoucher />} />
              <Route path='listvoucher' element={<Listvoucher />} />
              <Route path='addvoucher' element={<Addvoucher />} />
              <Route path='editvoucher' element={<Editvoucher />} />
              <Route path='vouchermonthly' element={<VoucherMonthly />} />
              <Route path='voucherfant' element={<VoucherFant />} />
              <Route path='vouchersummary' element={<VoucherSummary />} />
              <Route path='voucherdetails' element={<Voucherdetails />} />
            {/* misil routes starts  */}
              <Route path='listpoka' element={<ListPoka />} />
              <Route path='addpoka' element={<AddPoka />} />
              <Route path='addmisil' element={<AddMisil />} />
              <Route path='misilsearch' element={<MisilSearch />} />
              <Route path='kittasearch' element={<KittaSearch />} />
              <Route path='bargikaran' element={<Bargikaran />} />
              <Route path='changepassword' element={<ChangePassword/>}/>              
              <Route path='logout' element={<Logout />} />
            </Route>
            {/* App Routes Ends */}
            {/* Admin Route Starts */}
            <Route path="/admin" element={<Admin />} >
            <Route path='' element={<ListUsers/>}/>
            <Route path='listusers' element={<ListUsers/>}/>
            <Route path='listfants' element={<ListFants/>}/>            
            <Route path='listnapas' element={<ListNapas/>}/>
            <Route path='listparms' element={<ListParms/>}/>
            <Route path='logout' element={<Logout />} />
            </Route>
            {/* Admin Route Ends */}

            <Route path="/superadmin" element={<SuperAdmin />} >
            <Route path='' element={<ListAdminUsers/>}/>
            <Route path='listadminusers' element={<ListAdminUsers/>}/>
            <Route path='listbadhfand' element={<ListBadhfand/>}/>
            <Route path='listoffices' element={<ListOffices/>}/>
            </Route>

          </Route>
          <Route path='/register' element={<Register />} />
          <Route path='/resetpassword' element={<ResetPassword />} />
          <Route path='/login' element={<Login />} />
        </Routes>
      </div>
    </>
  )
}

export default App
