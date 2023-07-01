
import './App.css';
import { BrowserRouter as Router,Route,Routes,Navigate} from 'react-router-dom';
import Login from './Pages/Login';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SignUp from './Pages/SignUp';
import Home from './Components/Home/Home';
import PrivateRoutes from './Helpers/PrivateRoutesUser';


function App() {
  const token=localStorage.getItem("token");
  return (
    
    <div className="App">
      <Router>
      <ToastContainer />

     <Routes>
     <Route path='/' exact  element={!token ? <Login /> : <Navigate to="/home"/>} ></Route>
     <Route path='/signup' element={<SignUp/>} ></Route>
     <Route element={<PrivateRoutes/>} >
       <Route path='/home' element={<Home/>} ></Route> 
       </Route>
      </Routes>

     </Router>
    </div>
  );
}

export default App;
