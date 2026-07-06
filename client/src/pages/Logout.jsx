import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {userActions} from '../store/userSlice.js'

const Logout = () => {
  const navigate = useNavigate();
  const dispatch=useDispatch();
  useEffect(()=>{
    dispatch(userActions.changeCurrentUser({}));
    localStorage.setItem("currentUser",null);
    navigate('/login')
  },[])
  return (
    <>
    </>
  )
}

export default Logout
