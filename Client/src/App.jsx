import './App.scss'
import { Route, Routes } from "react-router-dom";
import React, { lazy, Suspense } from "react";

import Login from './Pages/Login';
import Register from './Pages/Register';
import Logout from './Pages/Logout';

// Voucher
import Listvoucher from './Pages/Voucher/Listvoucher';
import Addvoucher from './Pages/Voucher/Addvoucher';
import VoucherMonthly from './Pages/Voucher/VoucherMonthly';
import VoucherFant from './Pages/Voucher/VoucherFant';
import Editvoucher from './Pages/Voucher/Editvoucher';
import VoucherByDate from './Pages/Voucher/VoucherByDate';
import VoucherHome from './Pages/Voucher/VoucherHome';
import VoucherOfficeSum from './Pages/Voucher/VoucherOfficeSum';
import Voucherdaily from './Pages/Voucher/Voucherdaily';
import VoucherPalika from './Pages/Voucher/VoucherPalika';

// Misil
import MisilSearch from './Pages/Misil/MisilSearch';
import ListPoka from './Pages/Misil/ListPoka';
import MisilHome from './Pages/Misil/MisilHome';
import ViewPoka from './Pages/Misil/ViewPoka';

// Bargikaran
import Bargikaran from './Pages/Bargikaran/bargikaran';
import BargikaranHome from './Pages/Bargikaran/BargikaranHome';
import BargikaranAdd from './Pages/Bargikaran/bargikaranAdd';
import Bargikarandownload from './Pages/Bargikaran/Bargikarandownload';

// Admin
import Admin from './Pages/Admin/Admin';
import ListUsers from './Pages/Admin/ListUsers';
import ListNapas from './Pages/Admin/ListNapas';
import ListParms from './Pages/Admin/ListParms';
import ListFants from './Pages/Admin/ListFants';

// Super Admin
import SuperAdmin from './Pages/SuperAdmin/SuperAdmin';
import ListAdminUsers from './Pages/SuperAdmin/ListAdminUsers';
import ListBadhfand from './Pages/SuperAdmin/ListBadhfand';
import ListOffices from './Pages/SuperAdmin/ListOffices';

// Misc
import AppHome from './Pages/AppHome';
import ChangePassword from './Pages/ChangePassword';
import ResetPassword from './Pages/ResetPassword';
import CalcMainPage from './Pages/Calculator/CalcMainPage';
import Protected_route from './Utils/Protected_route';

function App() {
  return (
    <>
      <div className="App__main-page-content">
        <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route element={<Protected_route />}>
            <Route path="/" element={<AppHome />} />
            {/* App Routes Starts */}
            <Route path="/apphome" element={<AppHome />} />
            <Route path='changepassword' element={<ChangePassword />} />
            {/* Voucher routes starts */}
            <Route path='voucher' element={<VoucherHome />} >            
            <Route path='' element={<Listvoucher />} />
              <Route path='listvoucher' element={<Listvoucher />} />
              <Route path='addvoucher' element={<Addvoucher />} />
              <Route path='editvoucher' element={<Editvoucher />} />
              <Route path='vouchermonthly' element={<VoucherMonthly />} />              
              <Route path='voucherfant' element={<VoucherFant />} />              
              <Route path='voucherbydate' element={<VoucherByDate />} />        
              <Route path='officesum' element={<VoucherOfficeSum />} /> 
              <Route path='voucherdaily' element={<Voucherdaily/>} /> 
              <Route path='voucherpalika' element={<VoucherPalika/>} /> 
            </Route>
            {/* Voucher routes ends */}
            {/* bargikaran route starts */}
            <Route path='bargikaran' element={<BargikaranHome />} >
            <Route path='' element={<Bargikaran />} />
            <Route path='search' element={<Bargikaran />} />
            <Route path='add' element={<BargikaranAdd />} />
            <Route path='download' element={<Bargikarandownload/>}/>
            </Route>
            {/* bargikaran route ends */}
            {/* Misil route Starts */}
            <Route path='misil' element={<MisilHome />} > 
            <Route path='' element={<MisilSearch />} />           
            <Route path='listpoka' element={<ListPoka />} />
            <Route path='misilsearch' element={<MisilSearch />} />      
            
            <Route path='viewpoka' element={<ViewPoka />} />
            </Route>
            {/* Misil route Ends */}          
            {/* Admin Route Starts */}
            <Route path="/admin" element={<Admin />} >              
              <Route path='listusers' element={<ListUsers />} />
              <Route path='listfants' element={<ListFants />} />
              <Route path='listnapas' element={<ListNapas />} />
              <Route path='listparms' element={<ListParms />} />
              <Route path='logout' element={<Logout />} />
            </Route>
            {/* Admin Route Ends */}
            {/* Super Admin Route Starts */}
            <Route path="/superadmin" element={<SuperAdmin />} >              
              <Route path='listadminusers' element={<ListAdminUsers />} />
              <Route path='listbadhfand' element={<ListBadhfand />} />
              <Route path='listoffices' element={<ListOffices />} />
              <Route path='logout' element={<Logout />} />
            </Route>
            {/* Super Admin Route Ends */}
           
          </Route>
          <Route path='/logout' element={<Logout />} />
          <Route path='/register' element={<Register />} />
          <Route path='/calculator' element={<CalcMainPage />} />
          <Route path='/resetpassword' element={<ResetPassword />} />
          <Route path='/login' element={<Login />} />
          
        </Routes>
        </Suspense>
      </div>
    </>
  )
}

export default App
