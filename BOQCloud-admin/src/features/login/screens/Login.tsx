import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'username' | 'password' | 'otp'>('username');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');

  const handleUsernameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username) setStep('password');
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password) setStep('otp');
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp) navigate('/dashboard');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-logo">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          <span>Halal</span>
        </div>

        {step === 'username' && (
          <form onSubmit={handleUsernameSubmit} className="login-form">
            <h2>Welcome back</h2>
            <p className="login-subtitle">Please enter your username to continue</p>
            
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                autoFocus
              />
            </div>
            
            <button type="submit" className="login-btn primary">
              Continue
            </button>
          </form>
        )}

        {step === 'password' && (
          <form onSubmit={handlePasswordSubmit} className="login-form">
            <h2>Enter password</h2>
            <p className="login-subtitle">Welcome back, {username}</p>
            
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoFocus
              />
            </div>
            
            <button type="submit" className="login-btn primary">
              Continue
            </button>
            
            <button 
              type="button" 
              className="login-btn secondary"
              onClick={() => setStep('username')}
            >
              Back
            </button>
          </form>
        )}

        {step === 'otp' && (
          <form onSubmit={handleOtpSubmit} className="login-form">
            <h2>Verify OTP</h2>
            <p className="login-subtitle">Enter the 6-digit code sent to your device</p>
            
            <div className="form-group">
              <label>OTP Code</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="000000"
                maxLength={6}
                autoFocus
              />
            </div>
            
            <button type="submit" className="login-btn primary">
              Verify & Login
            </button>
            
            <button 
              type="button" 
              className="login-btn secondary"
              onClick={() => setStep('password')}
            >
              Back
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
