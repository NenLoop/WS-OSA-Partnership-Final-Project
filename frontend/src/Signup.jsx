import React, { useState } from 'react';
import { Shield, GraduationCap } from 'lucide-react';
import './App.css';

const Signup = ({ onNavigate }) => {
  const [role, setRole] = useState('student');

  return (
    <div className="auth-wrapper">
      <div className="auth-logo">
        <img src="/hcdc-logo.png" alt="Holy Cross of Davao College Logo" style={{ height: '150px', marginBottom: '10px' }} />
      </div>
      
      <div className="auth-card">

        <div className="auth-title-wrapped">
          REGISTER
        </div>

        <form>
          <div className="input-group">
            <label>Full Name</label>
            <input type="text" placeholder="Enter your name..." />
          </div>

          <div className="input-group">
            <label>Email Address</label>
            <input type="email" placeholder="Enter your email..." />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input type="password" placeholder="Enter password..." />
          </div>

          <div className="input-group">
            <label>Role</label>
            <div className="role-selector">
              <div 
                className={`role-btn ${role === 'admin' ? 'active' : ''}`}
                onClick={() => setRole('admin')}
              >
                <Shield size={18} /> Admin
              </div>
              <div 
                className={`role-btn ${role === 'student' ? 'active' : ''}`}
                onClick={() => setRole('student')}
              >
                <GraduationCap size={18} /> Student
              </div>
            </div>
          </div>

          <div className="input-group">
            <label>Department</label>
            <select>
              <option>Select Department...</option>
              <option>Information Technology</option>
              <option>Engineering</option>
              <option>Business</option>
            </select>
          </div>

          <button type="button" className="btn btn-primary">
            Register Account
          </button>
        </form>

        <div style={{textAlign:'center', marginTop:'20px'}}>
          <button className="btn btn-outline" onClick={() => onNavigate('login')}>
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;