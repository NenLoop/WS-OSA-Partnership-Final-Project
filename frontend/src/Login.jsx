import React from 'react';
import './App.css';

const Login = ({ onNavigate }) => {
  return (
    <div className="auth-wrapper">
        <div className="auth-logo">
        <img src="/hcdc-logo.png" alt="Holy Cross of Davao College Logo" style={{ height: '150px', marginBottom: '10px' }} />
        </div>
      <div className="auth-card">

        <div className="auth-title-wrapped">
          LOGIN
        </div>

        <form>
          <div className="input-group">
            <label>Email Address</label>
            <input type="email" placeholder="Enter your email..." />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input type="password" placeholder="Enter your password..." />
          </div>

          <div style={{display:'flex', justifyContent:'space-between', fontSize:'0.85rem', marginBottom:'25px', color:'#aaa'}}>
            <label style={{display:'flex', alignItems:'center', gap:'5px'}}>
              <input type="checkbox" /> Remember me
            </label>
            <span style={{cursor:'pointer', color:'white'}}>Forgot Password?</span>
          </div>

          <button type="button" className="btn btn-primary" onClick={() => onNavigate('home')}>
            Log In
          </button>
        </form>

        <div style={{textAlign:'center', marginTop:'20px', fontSize:'0.9rem', color:'#aaa'}}>
          Don't have an account? 
          <span 
            style={{color:'white', fontWeight:'bold', cursor:'pointer', marginLeft:'5px'}}
            onClick={() => onNavigate('signup')}
          >
            Register
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;