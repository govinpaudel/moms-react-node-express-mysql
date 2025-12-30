import './App.scss';
import { Route, Routes, Navigate } from "react-router-dom";
import React, { Suspense } from "react";

// Pages
import Login from './Pages/Login';
import Register from './Pages/Register';
import Logout from './Pages/Logout';
import CalcMainPage from './Pages/Calculator/CalcMainPage';

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
import Datasync from './Pages/SuperAdmin/Datasync';

// Misc
import AppHome from './Pages/AppHome';
import ChangePassword from './Pages/ChangePassword';
import ResetPassword from './Pages/ResetPassword';
import Unauthorized from './Pages/Unauthorized';

// Routes utils
import Protected_route from './Utils/Protected_route';
import RoleProtectedRoute from './Utils/RoleProtectedRoute';

// Role constants
const ROLES = { SUPER_ADMIN: 1, ADMIN: 2, USER: 3 };

function App() {
  return (
    <div className="App__main-page-content">
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>

          {/* 🔓 PUBLIC ROUTES */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/resetpassword" element={<ResetPassword />} />
          <Route path="/logout" element={<Logout />} />

          {/* 🔁 ROOT REDIRECT */}
          <Route path="/" element={<Navigate to="/apphome" replace />} />

          {/* 🔒 PROTECTED ROUTES */}
          <Route element={<Protected_route />}>

            {/* App Home */}
            <Route path="/apphome" element={<AppHome />} />
            <Route path="/calculator" element={<CalcMainPage />} />
            <Route path="/changepassword" element={<ChangePassword />} />

            {/* Voucher (accessible by all logged-in users) */}
            <Route path="/voucher" element={<VoucherHome />}>
              <Route index element={<Listvoucher />} />
              <Route path="listvoucher" element={<Listvoucher />} />
              <Route path="addvoucher" element={<Addvoucher />} />
              <Route path="editvoucher" element={<Editvoucher />} />
              <Route path="vouchermonthly" element={<VoucherMonthly />} />
              <Route path="voucherfant" element={<VoucherFant />} />
              <Route path="voucherbydate" element={<VoucherByDate />} />
              <Route path="officesum" element={<VoucherOfficeSum />} />
              <Route path="voucherdaily" element={<Voucherdaily />} />
              <Route path="voucherpalika" element={<VoucherPalika />} />
            </Route>

            {/* Admin routes (Admin + Super Admin only) */}
            <Route
              path="/admin/*"
              element={
                <RoleProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ADMIN]}>
                  <Admin />
                </RoleProtectedRoute>
              }
            >
              <Route path="listusers" element={<ListUsers />} />
              <Route path="listfants" element={<ListFants />} />
              <Route path="listnapas" element={<ListNapas />} />
              <Route path="listparms" element={<ListParms />} />
              <Route path="logout" element={<Logout />} />
            </Route>

            {/* Super Admin routes (Super Admin only) */}
            <Route
              path="/superadmin/*"
              element={
                <RoleProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN]}>
                  <SuperAdmin />
                </RoleProtectedRoute>
              }
            >
              <Route path="listadminusers" element={<ListAdminUsers />} />
              <Route path="listbadhfand" element={<ListBadhfand />} />
              <Route path="listoffices" element={<ListOffices />} />
              <Route path="datasync" element={<Datasync />} />
              <Route path="logout" element={<Logout />} />
            </Route>

          </Route>

          {/* Unauthorized fallback */}
          <Route path="/unauthorized" element={<Unauthorized />} />

        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
