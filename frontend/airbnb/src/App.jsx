import React from 'react'
import { BrowserRouter ,Route,Routes,Link} from 'react-router-dom'
import HomePage from '../pages/HomePage'
import Login from '../pages/Login'
import Signup from '../pages/Signup'
import Navbar from '../components/Navbar'
import './App.css'



const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Navbar/>

        <Routes>
          <Route path="/" element={<HomePage />}/>
          <Route path="/login" element={<Login />}/>
          <Route path="signup" element={<Signup />}/>
        </Routes>
      </BrowserRouter>      
    </div>
  )
}

export default App
