import Home from './Landing Page/Home/Home';
import Login from './Landing Page/Login/Login';
import Reset from './Landing Page/Password Reset/Reset';
import DashboardLayout from './Dashboard/Landing Page/Dashboard Layout';

import { Routes, Route } from 'react-router-dom';
import {ToastContainer} from 'react-toastify'

import './App.css'
import './assets/css/table.css' 
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import './assets/css/toast.css'

function App() 
{
  return (
    <>
      <ToastContainer autoClose={2000} className="mx-1" pauseOnHover={false} pauseOnFocusLoss={false}/>
     <Routes>
        <Route exact path='/' element={<Home/>}></Route>
        <Route exact path='/login' element={<Login/>}></Route>
        <Route exact path='/reset' element={<Reset/>}></Route>
        <Route exact path='/dashboard/*' element={<DashboardLayout/>}></Route>
     </Routes>
    </>
  );
}

export default App;
