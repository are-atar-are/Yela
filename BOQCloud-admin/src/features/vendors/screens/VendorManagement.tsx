import React, { useState } from 'react';
import Layout from '../../../components/layout/Layout';
import './VendorManagement.css';

interface Vendor {
  vendorId: string;
  name: string;
  type: 'subcontractor' | 'supplier';
  trade: string;
  contactPerson: string;
  email: string;
  phone: string;
  rating: number;
}

const VendorManagement: React.FC = () => {
  const [vendors] = useState<Vendor[]>([
    {
      vendorId: 'V-001',
      name: 'Elite Plumbing Services',
      type: 'subcontractor',
      trade: 'Plumbing',
      contactPerson: 'John Smith',
      email: 'john@eliteplumbing.com',
      phone: '+27 82 123 4567',
      rating: 4.5,
    },
    {
      vendorId: 'V-002',
      name: 'Power Electricians Ltd',
      type: 'subcontractor',
      trade: 'Electrical',
      contactPerson: 'Sarah Johnson',
      email: 'sarah@powerelec.com',
      phone: '+27 83 234 5678',
      rating: 4.8,
    },
    {
      vendorId: 'V-003',
      name: 'Steel Masters Supply',
      type: 'supplier',
      trade: 'Steel Materials',
      contactPerson: 'David Wilson',
      email: 'david@steelmasters.com',
      phone: '+27 85 456 7890',
      rating: 4.6,
    },
  ]);

  const renderStars = (rating: number) => {
    return '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
  };

  return (
    <Layout title="Vendors & Subs">
      <div className="vendor-management-page">
        <div className="page-header">
          <h2>Vendors & Subcontractors</h2>
          <button className="btn-primary">+ Add Vendor</button>
        </div>

        <div className="vendor-stats">
          <div className="stat-card">
            <div className="stat-value">{vendors.length}</div>
            <div className="stat-label">Total Vendors</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{vendors.filter(v => v.type === 'subcontractor').length}</div>
            <div className="stat-label">Subcontractors</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{vendors.filter(v => v.type === 'supplier').length}</div>
            <div className="stat-label">Suppliers</div>
          </div>
        </div>

        <div className="vendors-grid">
          {vendors.map((vendor) => (
            <div key={vendor.vendorId} className="vendor-card">
              <div className="vendor-header">
                <div className={`vendor-type ${vendor.type}`}>
                  {vendor.type === 'subcontractor' ? 'Sub' : 'Supp'}
                </div>
                <div className="vendor-rating">
                  <span className="stars">{renderStars(vendor.rating)}</span>
                  <span className="rating-value">{vendor.rating}</span>
                </div>
              </div>
              
              <h3 className="vendor-name">{vendor.name}</h3>
              <p className="vendor-trade">{vendor.trade}</p>
              
              <div className="vendor-contact">
                <div className="contact-item">
                  <span className="label">Contact:</span>
                  <span>{vendor.contactPerson}</span>
                </div>
                <div className="contact-item">
                  <span className="label">Phone:</span>
                  <span>{vendor.phone}</span>
                </div>
              </div>
              
              <div className="vendor-actions">
                <button className="btn-view">View Rates</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default VendorManagement;
