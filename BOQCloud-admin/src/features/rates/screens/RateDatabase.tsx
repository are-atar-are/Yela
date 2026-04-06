import React, { useState } from 'react';
import Layout from '../../../components/layout/Layout';
import './RateDatabase.css';

interface RateItem {
  rateId: string;
  itemCode: string;
  description: string;
  unit: string;
  baseRate: number;
  category: 'labour' | 'material' | 'plant' | 'subcontract';
}

const RateDatabase: React.FC = () => {
  const [rates] = useState<RateItem[]>([
    {
      rateId: 'R-001',
      itemCode: 'L.01.01',
      description: 'General labourer - hourly rate',
      unit: 'hr',
      baseRate: 25.00,
      category: 'labour',
    },
    {
      rateId: 'R-002',
      itemCode: 'L.01.02',
      description: 'Skilled labourer - hourly rate',
      unit: 'hr',
      baseRate: 45.00,
      category: 'labour',
    },
    {
      rateId: 'R-003',
      itemCode: 'M.01.01',
      description: 'Portland cement (50kg bag)',
      unit: 'bag',
      baseRate: 95.00,
      category: 'material',
    },
    {
      rateId: 'R-004',
      itemCode: 'M.01.02',
      description: 'Steel reinforcement (Y12)',
      unit: 'ton',
      baseRate: 18500.00,
      category: 'material',
    },
    {
      rateId: 'R-005',
      itemCode: 'P.01.01',
      description: 'Excavator (20-ton) - daily hire',
      unit: 'day',
      baseRate: 4850.00,
      category: 'plant',
    },
  ]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      labour: '#3b82f6',
      material: '#22c55e',
      plant: '#f59e0b',
      subcontract: '#8b5cf6',
    };
    return colors[category] || '#6b7280';
  };

  return (
    <Layout title="Rate Database">
      <div className="rate-database-page">
        <div className="page-header">
          <h2>Rate Database</h2>
          <button className="btn-primary">+ Add Rate</button>
        </div>

        <div className="category-stats">
          {['labour', 'material', 'plant', 'subcontract'].map((category) => (
            <div key={category} className={`category-card ${category}`}>
              <div 
                className="category-indicator"
                style={{ backgroundColor: getCategoryColor(category) }}
              />
              <div className="category-info">
                <span className="category-name">{category.charAt(0).toUpperCase() + category.slice(1)}</span>
                <span className="category-count">
                  {rates.filter(r => r.category === category).length} items
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="rates-table-container">
          <table className="rates-table">
            <thead>
              <tr>
                <th>Item Code</th>
                <th>Description</th>
                <th>Unit</th>
                <th>Base Rate</th>
                <th>Category</th>
              </tr>
            </thead>
            <tbody>
              {rates.map((rate) => (
                <tr key={rate.rateId}>
                  <td className="code">{rate.itemCode}</td>
                  <td className="description">{rate.description}</td>
                  <td>{rate.unit}</td>
                  <td className="rate">{formatCurrency(rate.baseRate)}</td>
                  <td>
                    <span 
                      className="category-badge"
                      style={{ backgroundColor: getCategoryColor(rate.category) }}
                    >
                      {rate.category}
                    </span>
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

export default RateDatabase;
