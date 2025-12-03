import React from 'react';
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import '../styles/App.css';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await axios.post("http://localhost:8000/api/auth/login/", { email, password })
            localStorage.setItem(ACCESS_TOKEN, res.data.access);
            localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
            navigate("/partnerships");
        } catch (error) {
            alert(error.response?.data || error.message)
        } finally {
            setLoading(false)
            console.log("Login attempt finished");
        }
    };
  return (
    <div className="auth-wrapper">
        <div className="auth-logo">
        <img src="/hcdc-logo.png" alt="Holy Cross of Davao College Logo" style={{ height: '150px', marginBottom: '10px' }} />
        </div>
      <div className="auth-card">

        <div className="auth-title-wrapped">
          LOGIN
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email Address</label>
            <input type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email..." />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password..." />
          </div>

          <div style={{display:'flex', justifyContent:'space-between', fontSize:'0.85rem', marginBottom:'25px', color:'#aaa'}}>
            <label style={{display:'flex', alignItems:'center', gap:'5px'}}>
              <input type="checkbox" /> Remember me
            </label>
            <span style={{cursor:'pointer', color:'white'}}>Forgot Password?</span>
          </div>

          <button type="submit" className="btn btn-primary">
            Log In
          </button>
        </form>
        {loading && <span 
            style={{color:'white', fontWeight:'bold', cursor:'pointer', marginLeft:'5px'}}
            onClick={() => navigate('signup')}
          >
            Loading...
          </span>}

        <div style={{textAlign:'center', marginTop:'20px', fontSize:'0.9rem', color:'#aaa'}}>
          Don't have an account? 
          <span 
            style={{color:'white', fontWeight:'bold', cursor:'pointer', marginLeft:'5px'}}
            onClick={() => navigate('signup')}
          >
            Register
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;