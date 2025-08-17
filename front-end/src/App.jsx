import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import AdminDashboard from './Componants/Admin/AdminDashboard'
import {Route, Routes } from 'react-router-dom'
import EditDoctor from './Componants/Admin/EditDoctor'
import Login from './Componants/Login'
import UserRegister from './Componants/User/UserRegister'
import Userhome from './Componants/User/Userhome'
import DoctorHome from './Componants/Doctor/DoctorHome'
import UserViewDoctor from './Componants/User/UserViewDoctor'
import UserViewBookings from './Componants/User/UserViewBookings'
import RentalShophome from './Componants/Shop/RentalShophome'
import UserViewProduct from './Componants/User/UserViewProduct'
import UserProductBooking from './Componants/User/UserProductBooking'
import Dashboard from './Componants/Lab/Dashboard'
import ViewLabs from './Componants/User/ViewLabs'
import CheckUps from './Componants/Lab/CheckUps'
import MyCheckups from './Componants/User/MyCheckups'
import Groceries from './Componants/User/Groceries'
import BoyHome from './Componants/DeliveryBoy/BoyHome'
// import CompanionHome from './Componants/Companion/CompanionHome'
// import UserCompanion from './Componants/User/UserCompanion'
import UserViewCompanion from './Componants/User/UserViewCompanion'
import RequestsUser from './Componants/Companion/Requestsuser'
import UserViewCompanionBooking from './Componants/User/UserViewCompanionBooking'
import CompanionAcceptedRequest from './Componants/Companion/CompanionAcceptedRequest'
function App() {
  return (
    <>
    <Routes>
      <Route path='/' element={<Login/>}/>
      <Route path='admin' element={<AdminDashboard/>}/>
      <Route path="/edit-doctor/:id" element={<EditDoctor/>} />
      <Route path='/user' element={<UserRegister/>}/>
      <Route path='/user-home' element={<Userhome/>}/>
      <Route path='/doctor-home' element={<DoctorHome/>}/>
      <Route path='/userviewdoctor' element={<UserViewDoctor/>}/>
      <Route path='/userviewbooking' element={<UserViewBookings/>}/>
      <Route path='/shophome' element={<RentalShophome/>}/>
      <Route path='/userviewproduct' element={<UserViewProduct/>}/>
      <Route path='/userproductbookings' element={<UserProductBooking/>}/>
      <Route path='/view-Lab'   element={<ViewLabs/>}/>
      <Route path='/labhome' element={<Dashboard/>}/>
      <Route path='/checkup' element={<CheckUps/>}/>
      <Route path='/mycheckups' element={<MyCheckups/>}/>
      <Route path='/groceries' element={<Groceries/>}/>
      <Route path='/deliveryboy' element={<BoyHome/>}/>
      {/* <Route path='/companion' element={<CompanionHome/>}/> */}
      <Route path='/userCompanion' element={<UserViewCompanion/>}/>
      <Route path='/usercompanionbookings' element={<UserViewCompanionBooking/>}/>
      <Route path='/requests' element={<RequestsUser/>}/>
      <Route path='/patients' element={<CompanionAcceptedRequest/>}/>
    
    </Routes>


     </>
  )
}


export default App
