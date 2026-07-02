import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import api from '../api/axios';
import Layout from '../components/Layout';

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard/summary').then((res) => {
      setSummary(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <Layout><p>Loading dashboard...</p></Layout>;

  const chartData = summary.lowStockProducts.slice(0, 8).map((p) => ({
    name: p.name,
    quantity: p.quantity,
    threshold: p.lowStockThreshold
  }));

  return (
    <Layout>
      <h1 className="page-title">Dashboard</h1>
      <div className="stat-grid">
        <div className="stat-card">
          <span className="stat-label">Total Products</span>
          <span className="stat-value">{summary.totalProducts}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Total Suppliers</span>
          <span className="stat-value">{summary.totalSuppliers}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Total Stock on Hand</span>
          <span className="stat-value">{summary.totalStock}</span>
        </div>
        <div className="stat-card alert">
          <span className="stat-label">Low Stock Alerts</span>
          <span className="stat-value">{summary.lowStockCount}</span>
        </div>
      </div>

      <div className="panel">
        <h2>Low Stock Overview</h2>
        {chartData.length === 0 ? (
          <p>No low stock items.</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="quantity" fill="#3b82f6" />
              <Bar dataKey="threshold" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="panel">
        <h2>Recent Inventory Activity</h2>
        <table className="data-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Change</th>
              <th>Previous</th>
              <th>New</th>
              <th>Updated By</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {summary.recentLogs.map((log) => (
              <tr key={log._id}>
                <td>{log.productName}</td>
                <td className={log.changeType === 'increase' ? 'positive' : 'negative'}>
                  {log.changeType}
                </td>
                <td>{log.previousQuantity}</td>
                <td>{log.newQuantity}</td>
                <td>{log.updatedByName}</td>
                <td>{new Date(log.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default Dashboard;
