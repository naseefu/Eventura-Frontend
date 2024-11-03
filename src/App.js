import './App.css';
import {BrowserRouter as Router,Routes,Route, Navigate} from 'react-router-dom'
import Home from './component/Home/Home';
import Loading from './component/Commons/Loading';
import EachEvent from './component/Events/EachEvent';
import Register from './component/Auth/Register';
import Notfound from './component/Notfound/Notfound';
import Signin from './component/Auth/Signin';
import { LoggedInRoute, ProtectedRoute } from './service/Guard';
import Contact from './component/contact/Contact';
import Profile from './component/User Profile/Profile';
import ProfileUser from './component/User Profile/ProfileUser';
import YourEvents from './component/User Profile/YourEvents';
import Test from './component/Test/Test';
import Otp from './component/Auth/Otp';
import Test2 from './component/Test/Test2';
import HostEvent from './component/Events/HostEvent';
import PaymentForm from './component/Test/Paytest';
import PayUserDetails from './component/Payment/PayUserDetails';
import Bookings from './component/User Profile/Bookings';
import Paytest from './component/Test/Paytest';
import Ticket from './component/Payment/Ticket';
import BookingManagement from './component/User Profile/BookingManagement';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path='/' element={<Home/>}/>
        <Route exact path='/signup' element={<LoggedInRoute element={<Register/>}/>}/>
        <Route exact path='/Login'  element={<LoggedInRoute element={<Signin/>}/>}/>
        <Route exact path='/otp/:id'  element={<LoggedInRoute element={<Otp/>}/>}/>
        <Route exact path='/payment/:id'  element={<ProtectedRoute element={<PayUserDetails/>}/>}></Route>
        <Route exact path='/profile'  element={<ProtectedRoute element={<Profile/>}/>}>
          <Route index element={<Navigate to="user" />}/>
          <Route path='bookings' element={<Bookings/>}></Route>
          <Route path='user' element={<ProfileUser/>}/>
          <Route path='your-events' element={<YourEvents/>}/>
          <Route path='your-events/:name/user-bookings/:userId/:eventId' element={<BookingManagement/>}/>
        </Route>
        <Route path='/loading' element={<Loading/>}/>
        <Route path='/contact' element={<Contact/>}/>
        <Route path='/event/:id' element={<EachEvent/>}/>
        <Route path='/ticket/:id' element={<Ticket/>}/>
        <Route path='/test/:id' element={<Test/>}/>
        <Route path='/test2' element={<Test2/>}/>
        <Route path='/paytest' element={<Paytest/>}/>
        <Route path='/host-events' element={<ProtectedRoute element={<HostEvent/>}/>}/>
        <Route path='*' element={<Notfound/>}/>
      </Routes>
    </Router>
  );
}

export default App;
