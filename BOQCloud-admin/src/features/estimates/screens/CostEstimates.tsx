import React, { useState } from 'react';
import Layout from '../../../components/layout/Layout';
import './CostEstimates.css';

interface CostItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  rate: number;
  total: number;
}

interface EstimateSection {
  id: string;
  name: string;
  items: CostItem[];
}

const CostEstimates: React.FC = () => {
  const [estimateName] = useState('Pre-Tender Estimate - Block A');
  const [estimateType] = useState('detailed');
  const [contingency] = useState(10);
  const [profitMargin] = useState(15);
  
  const [sections] = useState<EstimateSection[]>([
    {
      id: 'sec-1',
      name: 'Direct Costs - Labour',
      items: [
        { id: 'item-1', description: 'General labourer', quantity: 1200, unit: 'hr', rate: 25, total: 30000 },
        { id: 'item-2', description: 'Skilled labourer', quantity: 800, unit: 'hr', rate: 45, total: 36000 },
        { id: 'item-3', description: 'Foreman', quantity: 400, unit: 'hr', rate: 65, total: 26000 },
      ],
    },
    {
      id: 'sec-2',
      name: 'Direct Costs - Materials',
      items: [
        { id: 'item-4', description: 'Cement (50kg bags)', quantity: 500, unit: 'bag', rate: 12, total: 6000 },
        { id: 'item-5', description: 'Steel reinforcement', quantity: 25, unit: 'ton', rate: 850, total: 21250 },
        { id: 'item-6', description: 'Concrete blocks', quantity: 15000, unit: 'unit', rate: 2.5, total: 37500 },
      ],
    },
  ]);

  const calculateSubtotal = () => {
    return sections.reduce((total, section) => {
      return total + section.items.reduce((sum, item) => sum + item.total, 0);
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const indirectCosts = subtotal * 0.15;
  const contingencyAmount = subtotal * (contingency / 100);
  const profitAmount = (subtotal + indirectCosts + contingencyAmount) * (profitMargin / 100);
  const grandTotal = subtotal + indirectCosts + contingencyAmount + profitAmount;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Layout title="Cost Estimates">
      <div className="cost-estimates-page">
        <div className="page-header">
          <div className="estimate-info">
            <h2>{estimateName}</h2>
            <span className="estimate-type">{estimateType}</span>
          </div>
          <div className="header-actions">
            <button className="btn-secondary">Save Draft</button>
            <button className="btn-primary">Submit Estimate</button>
          </div>
        </div>

        <div className="estimate-summary">
          <div className="summary-card main">
            <div className="card-label">Total Estimate</div>
            <div className="card-value">{formatCurrency(grandTotal)}</div>
          </div>
          <div className="summary-card">
            <div className="card-label">Direct Costs</div>
            <div className="card-value">{formatCurrency(subtotal)}</div>
          </div>
          <div className="summary-card">
            <div className="card-label">Indirect Costs</div>
            <div className="card-value">{formatCurrency(indirectCosts)}</div>
          </div>
          <div className="summary-card">
            <div className="card-label">Contingency ({contingency}%)</div>
            <div className="card-value">{formatCurrency(contingencyAmount)}</div>
          </div>
          <div className="summary-card">
            <div className="card-label">Profit ({profitMargin}%)</div>
            <div className="card-value">{formatCurrency(profitAmount)}</div>
          </div>
        </div>

        <div className="cost-sections">
          {sections.map((section) => (
            <div key={section.id} className="cost-section">
              <div className="section-header">
                <h3>{section.name}</h3>
              </div>
              
              <table className="cost-table">
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Quantity</th>
                    <th>Unit</th>
                    <th>Rate</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {section.items.map((item) => (
                    <tr key={item.id}>
                      <td className="description">{item.description}</td>
                      <td>{item.quantity}</td>
                      <td>{item.unit}</td>
                      <td>{formatCurrency(item.rate)}</td>
                      <td className="total">{formatCurrency(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default CostEstimates;
