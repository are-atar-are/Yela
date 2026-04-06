import React, { useState } from 'react';
import Layout from '../../../components/layout/Layout';
import './TenderManagement.css';

interface Tender {
  tenderId: string;
  projectName: string;
  contractorName: string;
  submittedDate: string;
  totalPrice: number;
  validityDays: number;
  status: 'submitted' | 'under-review' | 'accepted' | 'rejected';
}

const TenderManagement: React.FC = () => {
  const [tenders] = useState<Tender[]>([
    {
      tenderId: 'T-2024-001',
      projectName: 'Office Building Block A',
      contractorName: 'ABC Construction Ltd',
      submittedDate: '2024-03-15',
      totalPrice: 2450000,
      validityDays: 90,
      status: 'under-review',
    },
    {
      tenderId: 'T-2024-002',
      projectName: 'Office Building Block A',
      contractorName: 'XYZ Builders Inc',
      submittedDate: '2024-03-16',
      totalPrice: 2380000,
      validityDays: 60,
      status: 'submitted',
    },
    {
      tenderId: 'T-2024-003',
      projectName: 'Residential Complex Phase 1',
      contractorName: 'Premium Homes Ltd',
      submittedDate: '2024-03-10',
      totalPrice: 1890000,
      validityDays: 90,
      status: 'accepted',
    },
  ]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const statusClasses: Record<string, string> = {
      submitted: 'status-badge submitted',
      'under-review': 'status-badge review',
      accepted: 'status-badge accepted',
      rejected: 'status-badge rejected',
    };
    return <span className={statusClasses[status]}>{status.replace('-', ' ').toUpperCase()}</span>;
  };

  return (
    <Layout title="Tender Management">
      <div className="tender-management-page">
        <div className="page-header">
          <h2>Tenders</h2>
          <button className="btn-primary">+ Create Tender</button>
        </div>

        <div className="tender-stats">
          <div className="stat-card">
            <div className="stat-value">{tenders.length}</div>
            <div className="stat-label">Total Tenders</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{tenders.filter(t => t.status === 'under-review').length}</div>
            <div className="stat-label">Under Review</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{tenders.filter(t => t.status === 'accepted').length}</div>
            <div className="stat-label">Accepted</div>
          </div>
        </div>

        <div className="tenders-table-container">
          <table className="tenders-table">
            <thead>
              <tr>
                <th>Tender ID</th>
                <th>Project</th>
                <th>Contractor</th>
                <th>Submitted</th>
                <th>Total Price</th>
                <th>Validity</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tenders.map((tender) => (
                <tr key={tender.tenderId}>
                  <td className="tender-id">{tender.tenderId}</td>
                  <td>{tender.projectName}</td>
                  <td>{tender.contractorName}</td>
                  <td>{tender.submittedDate}</td>
                  <td className="price">{formatCurrency(tender.totalPrice)}</td>
                  <td>{tender.validityDays} days</td>
                  <td>{getStatusBadge(tender.status)}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-view">View</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default TenderManagement;
