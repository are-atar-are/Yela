import React, { useState, useEffect } from 'react';
import Layout from '../../../components/layout/Layout';
import './BOQEditor.css';

interface BOQItem {
  itemId: string;
  code: string;
  description: string;
  unit: string;
  quantity: number;
  unitRate: number;
  totalCost: number;
  category: 'labour' | 'material' | 'plant' | 'overhead';
}

interface BOQSubSection {
  subSectionId: string;
  name: string;
  items: BOQItem[];
}

interface BOQSection {
  sectionId: string;
  name: string;
  subSections: BOQSubSection[];
}

const BOQEditor: React.FC = () => {
  const [sections, setSections] = useState<BOQSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [projectName, setProjectName] = useState('New Project');

  useEffect(() => {
    setTimeout(() => {
      setSections([
        {
          sectionId: 'sec-001',
          name: 'Preliminaries',
          subSections: [
            {
              subSectionId: 'sub-001',
              name: 'Site Setup',
              items: [
                { itemId: 'item-001', code: 'A.1.1', description: 'Site clearance', unit: 'm²', quantity: 500, unitRate: 15, totalCost: 7500, category: 'labour' },
                { itemId: 'item-002', code: 'A.1.2', description: 'Site fencing', unit: 'm', quantity: 200, unitRate: 45, totalCost: 9000, category: 'material' },
              ],
            },
          ],
        },
        {
          sectionId: 'sec-002',
          name: 'Substructure',
          subSections: [
            {
              subSectionId: 'sub-002',
              name: 'Excavation',
              items: [
                { itemId: 'item-003', code: 'B.1.1', description: 'Bulk excavation', unit: 'm³', quantity: 1200, unitRate: 25, totalCost: 30000, category: 'plant' },
                { itemId: 'item-004', code: 'B.1.2', description: 'Trench excavation', unit: 'm³', quantity: 350, unitRate: 35, totalCost: 12250, category: 'labour' },
              ],
            },
            {
              subSectionId: 'sub-003',
              name: 'Concrete Works',
              items: [
                { itemId: 'item-005', code: 'B.2.1', description: 'Concrete blinding 100mm', unit: 'm²', quantity: 450, unitRate: 85, totalCost: 38250, category: 'material' },
                { itemId: 'item-006', code: 'B.2.2', description: 'Reinforced concrete footing', unit: 'm³', quantity: 180, unitRate: 450, totalCost: 81000, category: 'material' },
              ],
            },
          ],
        },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const calculateTotals = () => {
    let total = 0;
    sections.forEach(section => {
      section.subSections.forEach(subSection => {
        subSection.items.forEach(item => {
          total += item.totalCost;
        });
      });
    });
    return total;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const grandTotal = calculateTotals();

  return (
    <Layout title="BOQ Editor">
      <div className="boq-editor-page">
        <div className="page-header">
          <div className="project-info">
            <input
              type="text"
              className="project-name-input"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
            <span className="project-status">Draft</span>
          </div>
          <div className="header-actions">
            <button className="btn-secondary">Import Excel</button>
            <button className="btn-primary">Export BOQ</button>
          </div>
        </div>

        <div className="summary-cards">
          <div className="summary-card total">
            <div className="card-label">Grand Total</div>
            <div className="card-value">{formatCurrency(grandTotal)}</div>
          </div>
        </div>

        <div className="boq-content">
          {loading ? (
            <div className="loading">Loading BOQ...</div>
          ) : (
            <div className="boq-sections">
              {sections.map((section) => (
                <div key={section.sectionId} className="boq-section">
                  <div className="section-header">
                    <h3>{section.name}</h3>
                    <button className="btn-icon">+</button>
                  </div>
                  
                  {section.subSections.map((subSection) => (
                    <div key={subSection.subSectionId} className="boq-subsection">
                      <div className="subsection-header">
                        <h4>{subSection.name}</h4>
                      </div>
                      
                      <table className="boq-table">
                        <thead>
                          <tr>
                            <th>Code</th>
                            <th>Description</th>
                            <th>Unit</th>
                            <th>Qty</th>
                            <th>Rate</th>
                            <th>Total</th>
                            <th>Category</th>
                          </tr>
                        </thead>
                        <tbody>
                          {subSection.items.map((item) => (
                            <tr key={item.itemId}>
                              <td className="code">{item.code}</td>
                              <td className="description">{item.description}</td>
                              <td>{item.unit}</td>
                              <td>{item.quantity}</td>
                              <td>{formatCurrency(item.unitRate)}</td>
                              <td className="total">{formatCurrency(item.totalCost)}</td>
                              <td>
                                <span className={`category-badge ${item.category}`}>
                                  {item.category}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default BOQEditor;
