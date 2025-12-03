import React from 'react';
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import '../styles/App.css';

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await axios.post("http://localhost:8000/api/auth/register/", { email, password, password2, first_name: firstName, last_name: lastName });
            localStorage.setItem(ACCESS_TOKEN, res.data.access);
            localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
            navigate("/login");
        } catch (error) {
            alert(error.response?.data || error.message)
        } finally {
            setLoading(false)
            console.log("Register attempt finished");
        }
    };
  return (
    <div className="auth-wrapper">
        <div className="auth-logo">
        <img src="/hcdc-logo.png" alt="Holy Cross of Davao College Logo" style={{ height: '150px', marginBottom: '10px' }} />
        </div>
      <div className="auth-card">

        <div className="auth-title-wrapped">
          REGISTER
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
            <label>First Name</label>
            <input type="text" 
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Enter your first name" />
          </div>

          <div className="input-group">
            <label>Last Name</label>
            <input type="text" 
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Enter your name last name" />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password..." />
          </div>

          <div className="input-group">
            <label>Comfirm Password</label>
            <input type="password" 
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            placeholder="Comfirm password..." />
          </div>

          <button type="submit" className="btn btn-primary">
            Register Account
          </button>
        </form>
        {loading && <span 
            style={{color:'white', fontWeight:'bold', cursor:'pointer', marginLeft:'5px'}}
            onClick={() => navigate('signup')}
          >
            Loading...
          </span>}

          <div style={{textAlign:'center', marginTop:'20px'}}>
          <button className="btn btn-outline" onClick={() => navigate('/login')}>
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;