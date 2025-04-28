import React from 'react'
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

export const Navbar = () => {
  const { authUser, isCheckingAuth } = useAuthStore();
  return (
    <nav className="bg-base-200 z-10 relative">
      <Link className="btn btn-ghost" to="/">Home</Link>
      <Link className="btn btn-ghost" to="/signup">Sign Up</Link>
      <Link className="btn btn-ghost" to="/login">Login</Link>
      <Link className="btn btn-ghost" to="/settings">Settings</Link>
      <Link className="btn btn-ghost" to="/profile">Profile</Link>
    </nav>
  );
};

export default Navbar;
