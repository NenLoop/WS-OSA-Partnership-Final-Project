import React from 'react';
import { Search, User, ChevronRight, ChevronLeft } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import '../styles/App.css';

const Home = () => {
  const navigate = useNavigate();

  const departments = [
    { code: 'CCJE', color: '#0056b3' },
    { code: 'CHM', color: '#ffc107' },
    { code: 'CLE', color: '#8B0000' },
    { code: 'CME', color: '#17a2b8' },
    { code: 'COE', color: '#001f3f' },
    { code: 'CTE', color: '#fd7e14' },
    { code: 'GRAD', color: '#6c757d' },
  ];

  return (
    <div>
      {/* Navigation */}
      <nav className="navbar">
        <div style={{display:'flex', alignItems:'center', gap:'10px', fontWeight:'bold'}}>
          <div style={{background:'white', borderRadius:'50%', padding:'5px', display:'flex'}}><User color="black" size={18}/></div>
          <span className="hide-on-mobile">User Portal</span>
        </div>

        <div className="nav-links">
          <a href="#about">About Us</a>
          <a href="#partners">Partnerships</a>
          <div style={{background:'white', padding:'5px 15px', borderRadius:'20px', display:'flex', alignItems:'center'}}>
            <Search size={14} color="#333"/>
            <input type="text" placeholder="Search..." style={{border:'none', outline:'none', marginLeft:'5px', width:'80px'}} />
          </div>
          <a href="#" onClick={() => navigate('login')} style={{color:'#ff6b6b'}}>Login</a>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1920&auto=format&fit=crop)'}}>
        <div className="hero-content">
          <h1>PARTNERSHIPS</h1>
          <p style={{maxWidth:'700px', margin:'0 auto', lineHeight:'1.6'}}>
            Dedicated to forming innovators who are academically excellent, socially responsible, and rounded in faith.
          </p>
          <h1 className="text-green-600 text-3xl font-bold">Tailwind working 🎉</h1>
        </div>
      </section>

      {/* Departments */}
      <section className="departments">
        <h3 style={{letterSpacing:'4px', color:'#666', fontStyle:'italic'}}>D E P A R T M E N T S</h3>
        <div className="dept-grid">
          {departments.map((dept) => (
            <div key={dept.code} className="dept-item" style={{borderColor: dept.color}}>
              {dept.code}
            </div>
          ))}
        </div>
      </section>

      {/* News Showcase */}
      <section className="news-section">
        <div style={{display:'flex', alignItems:'center', gap:'20px', width:'100%', justifyContent:'center'}}>
          <button className="btn" style={{background:'none', color:'white'}}><ChevronLeft size={40}/></button>
          
          <div className="news-card">
            <img 
              src="https://images.unsplash.com/photo-1551818255-e6e10975bc17?q=80&w=1920&auto=format&fit=crop" 
              alt="Event" 
              className="news-bg"
            />
            <div className="news-content">
              <h2 style={{marginBottom:'10px'}}>Maritime Industry Transformation</h2>
              <p style={{color:'#ccc', fontSize:'0.9rem', marginBottom:'15px'}}>November 5, 2025</p>
              <p style={{lineHeight:'1.5'}}>
                International maritime experts express trust that the academic force of the college will enforce leadership and discipline...
              </p>
            </div>
          </div>

          <button className="btn" style={{background:'none', color:'white'}}><ChevronRight size={40}/></button>
        </div>
      </section>
    </div>
  );
};

export default Home;