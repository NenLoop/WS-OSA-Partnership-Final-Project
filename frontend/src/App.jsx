import React, { useState } from 'react';
import Login from './Login';
import Signup from './Signup';
import Home from './Home';
import './App.css';

function App() {
  // Simple state-based routing for demonstration
  // In a real app, you would use 'react-router-dom'
  const [currentScreen, setCurrentScreen] = useState('login');

  const renderScreen = () => {
    switch (currentScreen) {
      case 'login':
        return <Login onNavigate={setCurrentScreen} />;
      case 'signup':
        return <Signup onNavigate={setCurrentScreen} />;
      case 'home':
        return <Home onNavigate={setCurrentScreen} />;
      default:
        return <Login onNavigate={setCurrentScreen} />;
    }
  };

  return (
    <div className="App">
      {renderScreen()}
    </div>
  );
}

export default App;