import React from 'react'
import {Link} from 'react-router-dom'

const Navbar = () => {
  return (
    <div>
      <nav>
        <Link to="/" >AirBNB</Link>
        <Link to="/login" >Login</Link>
        <Link to="/signup">Signup</Link>
      </nav>
    </div>
  )
}

export default Navbar
