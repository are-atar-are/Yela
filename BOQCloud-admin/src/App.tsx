import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Amplify } from 'aws-amplify';
import awsConfig, { validateConfig } from './config/aws-config';
import Login from './features/auth/components/Login';
import ProtectedRoute from './features/auth/components/ProtectedRoute';
import Dashboard from './features/dashboard/screens/Dashboard';
import TimeTracking from './features/timeTracking/screens/TimeTracking';
import Projects from './features/projects/screens/Projects';
import TaskList from './features/tasks/components/TaskList';
import Employees from './features/employees/screens/Employees';
import Vehicles from './features/vehicles/screens/Vehicles';
import Bookings from './features/bookings/screens/Bookings';
import BOQEditor from './features/boq/screens/BOQEditor';
import CostEstimates from './features/estimates/screens/CostEstimates';
import TenderManagement from './features/tenders/screens/TenderManagement';
import VendorManagement from './features/vendors/screens/VendorManagement';
import RateDatabase from './features/rates/screens/RateDatabase';
import Layout from './components/layout/Layout';
import './App.css';

// Configure Amplify on app load
const configureAmplify = () => {
  if (validateConfig()) {
    Amplify.configure(awsConfig);
    console.log('✅ AWS Amplify configured successfully');
  } else {
    console.warn('⚠️ AWS Amplify not configured. Set environment variables to enable authentication.');
  }
};

// Dummy page component
const DummyPage: React.FC<{ title: string }> = ({ title }) => (
  <Layout title={title}>
    <div className="dummy-page">
      <div className="dummy-card">
        <h2>{title}</h2>
        <p>This page is under construction. Check back soon for updates.</p>
        <div className="dummy-content">
          <div className="dummy-block"></div>
          <div className="dummy-block"></div>
          <div className="dummy-block"></div>
        </div>
      </div>
    </div>
  </Layout>
);

// Estimate page (the detailed one we built)
const EstimatePage: React.FC = () => {
  return (
    <Layout 
      title="Estimate 21-00220011-15" 
      showTopBar={true} 
      topBarText="Estimate for Leslie Alexander"
    >
      <div className="estimate-page">
        <a href="#" className="tutorial-link">+ TUTORIAL VIDEO</a>
        
        {/* Info Cards */}
        <div className="info-cards">
          <div className="card">
            <h3 className="section-title">Company Information</h3>
            <div className="company-header">
              <svg className="company-logo" viewBox="0 0 40 40" fill="currentColor">
                <path d="M20 2C10 2 2 10 2 20s8 18 18 18 18-8 18-18S30 2 20 2zm-2 28l-8-8 2-2 6 6 12-12 2 2-14 14z"/>
              </svg>
              <div>
                <div className="company-name">Halal</div>
                <div className="company-tag">CONSTRUCTION SERVICES</div>
              </div>
            </div>
            
            <div className="info-row"><span className="info-label">Invoice for</span><span className="info-value">Sound Construction Service</span></div>
            <div className="info-row"><span className="info-label">License</span><span className="info-value">#Soundcs5434ds</span></div>
            <div className="info-row"><span className="info-label">Address</span><span className="info-value">27924 SE 268th St, Ravensdale, WA 98038</span></div>
            <div className="info-row"><span className="info-label">Phone</span><span className="info-value">(206) 333-2591</span></div>
            <div className="info-row"><span className="info-label">Email</span><span className="info-value">chris@projul.com</span></div>
            <div className="info-row"><span className="info-label">Website</span><span className="info-value">www.soundcloud.com</span></div>
          </div>

          <div className="card">
            <h3 className="section-title">Customer Information</h3>
            <div className="info-row"><span className="info-label">Project Name</span><span className="info-value">Sound Construction Service</span></div>
            <div className="info-row"><span className="info-label">Customer Name</span><span className="info-value">Michael Walker</span></div>
            <div className="info-row"><span className="info-label">Billing Address</span><span className="info-value">27924 SE 268th St, Ravensdale, WA 98038</span></div>
            <div className="info-row"><span className="info-label">Project Address</span><span className="info-value">27924 SE 268th St, Ravensdale, WA 98038</span></div>
            
            <div className="contact-actions">
              <button className="icon-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg></button>
              <button className="icon-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></button>
              <button className="icon-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg></button>
              <button className="map-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="1 6 1 22 8 18 16 22 21 18 21 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>
                Open Map
              </button>
            </div>
            
            <a href="#" className="preview-link">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              Preview in customer portal
            </a>
          </div>
        </div>

        {/* Introduction */}
        <div className="card">
          <h4 className="intro-title">Introduction</h4>
          <p className="intro-text">Hello Michael,<br /><br />We appreciate the opportunity to submit this estimate for your consideration. Please review the details below and let us know if you have any questions.</p>
          <button className="show-more">Show more</button>
        </div>

        {/* Estimate Details */}
        <div className="card">
          <div className="details-grid">
            <div className="detail-item"><div className="detail-label">Number</div><div className="detail-value">21-00220011-15</div></div>
            <div className="detail-item"><div className="detail-label">Status</div><div className="detail-value status-accepted">Accepted</div></div>
            <div className="detail-item"><div className="detail-label">Date</div><div className="detail-value">Mar 1, 2021</div></div>
            <div className="detail-item"><div className="detail-label">Expires</div><div className="detail-value">Apr 30, 2021</div></div>
          </div>
        </div>

        {/* Description & Pricing */}
        <div className="card">
          <h3 className="section-title">Description & Pricing</h3>
          
          <div className="table-header">
            <div className="th-description">Description</div>
            <div className="th-cost">Labor Cost</div>
            <div className="th-cost">Material Costs</div>
            <div className="th-cost">Other Costs</div>
            <div className="th-amount">Amount</div>
            <div className="th-action"></div>
          </div>

          {[
            { title: 'Demolition & Disposal', labor: 1, material: 3, other: 1, amount: '$10,470.93' },
            { title: 'Plumbing', labor: 1, material: 0, other: 0, amount: '$1,982.66' },
            { title: 'Electrical', labor: 2, material: 3, other: 0, amount: '$2,470.93' },
            { title: 'Drywal & Paint', labor: 5, material: 3, other: 1, amount: '$9,482.66' },
            { title: 'Electrical', labor: 2, material: 3, other: 0, amount: '$1,962.66' },
            { title: 'Drywal & Paint', labor: 1, material: 3, other: 1, amount: '$2,470.93' },
          ].map((item, index) => (
            <div className="table-row" key={index}>
              <div className="td-description">
                <svg className="row-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                <span>{item.title}</span>
              </div>
              <div className="td-cost">{item.labor > 0 ? <span className="cost-badge"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>{item.labor}</span> : '-'}</div>
              <div className="td-cost">{item.material > 0 ? <span className="cost-badge"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>{item.material}</span> : '-'}</div>
              <div className="td-cost">{item.other > 0 ? <span className="cost-badge"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>{item.other}</span> : '-'}</div>
              <div className="td-amount">{item.amount}</div>
              <div className="td-action"><button className="add-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>Add</button></div>
            </div>
          ))}

          {/* Footer Section */}
          <div className="footer-section">
            <div className="footer-grid">
              <div className="footer-column">
                <div className="footer-label">Company Labor Costs</div>
                <div className="footer-value">$1,962.66</div>
                <div className="footer-subtext">Labor Cost: $1,962.66</div>
              </div>
              <div className="footer-column">
                <div className="footer-label">Company Material Costs</div>
                <div className="footer-value">$15,000.00</div>
                <div className="footer-subtext">Material Costs: $15,000.00</div>
              </div>
              <div className="footer-column">
                <div className="footer-label">Other Company Costs</div>
                <div className="footer-value">$2,470.93</div>
                <div className="footer-subtext">Other Costs: $2,470.93</div>
              </div>
              <div className="footer-column">
                <div className="footer-label">Total</div>
                <div className="footer-value">$19,433.59</div>
                <div className="footer-subtext">Total: $19,433.59</div>
              </div>
              <div className="footer-column">
                <div className="footer-label">Estimated Gross Profit</div>
                <div className="footer-value">$12,433.59</div>
                <div className="footer-subtext">Markup: 50.0%</div>
                <div className="footer-subtext">Margin: 33.3%</div>
              </div>
              <div className="total-section">
                <div className="total-row"><span>Taxable Subtotal</span><span>$19,433.59</span></div>
                <div className="total-row"><span>Tax (0%)</span><span>$0.00</span></div>
                <div className="total-row total"><span>Estimated Total</span><span>$19,433.59</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

function App() {
  useEffect(() => {
    configureAmplify();
  }, []);

  return (
    <Routes>
      {/* Login - Landing Page */}
      <Route path="/login" element={<Login />} />
      
      {/* Protected Routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/estimates" element={
        <ProtectedRoute>
          <CostEstimates />
        </ProtectedRoute>
      } />
      
      <Route path="/time-tracking" element={
        <ProtectedRoute>
          <TimeTracking />
        </ProtectedRoute>
      } />
      
      <Route path="/task-list" element={
        <ProtectedRoute>
          <TaskList />
        </ProtectedRoute>
      } />
      
      <Route path="/lead-pipeline" element={
        <ProtectedRoute>
          <DummyPage title="Lead Pipeline" />
        </ProtectedRoute>
      } />
      
      <Route path="/invoices" element={
        <ProtectedRoute>
          <DummyPage title="Invoices" />
        </ProtectedRoute>
      } />
      
      <Route path="/projects" element={
        <ProtectedRoute>
          <Projects />
        </ProtectedRoute>
      } />
      
      <Route path="/schedule" element={
        <ProtectedRoute>
          <DummyPage title="Schedule" />
        </ProtectedRoute>
      } />
      
      <Route path="/photos" element={
        <ProtectedRoute>
          <DummyPage title="Photos & Files" />
        </ProtectedRoute>
      } />
      
      <Route path="/customers" element={
        <ProtectedRoute>
          <DummyPage title="Customers" />
        </ProtectedRoute>
      } />
      
      <Route path="/map" element={
        <ProtectedRoute>
          <DummyPage title="Map" />
        </ProtectedRoute>
      } />
      
      <Route path="/reports" element={
        <ProtectedRoute>
          <DummyPage title="Reports" />
        </ProtectedRoute>
      } />
      
      <Route path="/customizations" element={
        <ProtectedRoute>
          <DummyPage title="Customizations" />
        </ProtectedRoute>
      } />
      
      <Route path="/templates" element={
        <ProtectedRoute>
          <DummyPage title="Templates" />
        </ProtectedRoute>
      } />

      {/* Fleeto Management Routes */}
      <Route path="/employees" element={
        <ProtectedRoute>
          <Employees />
        </ProtectedRoute>
      } />

      <Route path="/vehicles" element={
        <ProtectedRoute>
          <Vehicles />
        </ProtectedRoute>
      } />

      <Route path="/bookings" element={
        <ProtectedRoute>
          <Bookings />
        </ProtectedRoute>
      } />

      {/* BOQCloud Routes */}
      <Route path="/boq" element={
        <ProtectedRoute>
          <BOQEditor />
        </ProtectedRoute>
      } />

      <Route path="/estimates" element={
        <ProtectedRoute>
          <CostEstimates />
        </ProtectedRoute>
      } />

      <Route path="/tenders" element={
        <ProtectedRoute>
          <TenderManagement />
        </ProtectedRoute>
      } />

      <Route path="/vendors" element={
        <ProtectedRoute>
          <VendorManagement />
        </ProtectedRoute>
      } />

      <Route path="/rates" element={
        <ProtectedRoute>
          <RateDatabase />
        </ProtectedRoute>
      } />

      <Route path="/budget" element={
        <ProtectedRoute>
          <DummyPage title="Budget Tracker" />
        </ProtectedRoute>
      } />

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
