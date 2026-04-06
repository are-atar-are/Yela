import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './Login.css';

type AuthStep = 'username' | 'password' | 'newPassword';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const {
    isAuthenticated,
    isLoading,
    error,
    rememberedUsername,
    login,
    setNewPassword,
    rememberUsername,
    clearAuthError,
  } = useAuth();

  const [step, setStep] = useState<AuthStep>('username');
  const [username, setUsername] = useState(rememberedUsername || '');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPasswordState] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(!!rememberedUsername);

  // Redirect if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Clear error when step changes
  useEffect(() => {
    clearAuthError();
  }, [step, clearAuthError]);

  const handleUsernameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) return;
    setStep('password');
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;

    const result = await login(username, password);
    
    if (result.meta.requestStatus === 'fulfilled') {
      // Save username if remember me is checked
      if (rememberMe) {
        rememberUsername(username);
      } else {
        rememberUsername(null);
      }
      // Login successful, will redirect via useEffect
    } else {
      // Check if new password is required
      const errorMsg = result.payload as string;
      if (errorMsg?.includes('new password') || errorMsg?.includes('NEW_PASSWORD_REQUIRED')) {
        setStep('newPassword');
      }
    }
  };

  const handleNewPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword !== confirmPassword) return;

    const result = await setNewPassword(username, newPassword);
    
    if (result.meta.requestStatus === 'fulfilled') {
      // Password set successfully, will redirect via useEffect
    }
  };

  const handleBack = () => {
    if (step === 'password') {
      setStep('username');
      setPassword('');
    } else if (step === 'newPassword') {
      setStep('password');
      setNewPasswordState('');
      setConfirmPassword('');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-logo">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          <span>Fleeto Admin</span>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {step === 'username' && (
          <form onSubmit={handleUsernameSubmit} className="login-form">
            <h2>Welcome back</h2>
            <p className="login-subtitle">
              {rememberedUsername 
                ? `Welcome back!` 
                : 'Please enter your username to continue'}
            </p>
            
            <div className="form-group">
              <label>Username or Email</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                autoFocus
                disabled={isLoading}
              />
            </div>

            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember me</span>
              </label>
            </div>
            
            <button 
              type="submit" 
              className="login-btn primary"
              disabled={isLoading || !username}
            >
              {isLoading ? 'Loading...' : 'Continue'}
            </button>

            <div className="login-footer">
              <span>Don't have an account?</span>
              <button type="button" className="link-btn">
                Contact admin
              </button>
            </div>
          </form>
        )}

        {step === 'password' && (
          <form onSubmit={handlePasswordSubmit} className="login-form">
            <h2>Enter password</h2>
            <p className="login-subtitle">
              Welcome back, <strong>{username}</strong>
            </p>
            
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoFocus
                disabled={isLoading}
              />
            </div>
            
            <button 
              type="submit" 
              className="login-btn primary"
              disabled={isLoading || !password}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
            
            <button 
              type="button" 
              className="login-btn secondary"
              onClick={handleBack}
              disabled={isLoading}
            >
              Back
            </button>

            <div className="login-footer">
              <button type="button" className="link-btn">
                Forgot password?
              </button>
            </div>
          </form>
        )}

        {step === 'newPassword' && (
          <form onSubmit={handleNewPasswordSubmit} className="login-form">
            <h2>Set new password</h2>
            <p className="login-subtitle">
              Please set a new password for your account
            </p>
            
            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPasswordState(e.target.value)}
                placeholder="Enter new password"
                autoFocus
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                disabled={isLoading}
              />
            </div>

            {newPassword && confirmPassword && newPassword !== confirmPassword && (
              <div className="error-message">Passwords do not match</div>
            )}
            
            <button 
              type="submit" 
              className="login-btn primary"
              disabled={isLoading || !newPassword || newPassword !== confirmPassword}
            >
              {isLoading ? 'Setting password...' : 'Set Password'}
            </button>
            
            <button 
              type="button" 
              className="login-btn secondary"
              onClick={handleBack}
              disabled={isLoading}
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
