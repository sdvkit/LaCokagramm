import React, { useContext } from 'react'
import {signOut} from "firebase/auth"
import { auth } from '../firebase'
import { AuthContext } from '../context/AuthContext'
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const {currentUser} = useContext(AuthContext)
  const navigate = useNavigate();

  return (
    <div className='navbar'>
      <span className="logo">La-Cokagramm</span>
      <div className="user">
        <img src={currentUser.photoURL} alt="" onClick={() => {
          navigate(`profile/${currentUser.uid}`)
        }} className='avatar' />
        <span>{currentUser.displayName}</span>
        <button onClick={()=>signOut(auth)}>logout</button>
      </div>
    </div>
  )
}

export default Navbar