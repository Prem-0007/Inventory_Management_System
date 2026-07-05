import { useEffect, useState } from 'react';
import api from '../api/axios';
import Layout from '../components/Layout';
import Reveal from '../components/Reveal';

const Reports = () => {
  const [lowStock, setLowStock] = useState([]);
  const [productSummary, setProductSummary] = useState([]);
  const [supplierSummary, setSupplierSummary] = useState([]);

  useEffect(() => {
    api.get('/reports/low-stock').then((res) => setLowStock(res.data));
    api.get('/reports/product-summary').then((res) => setProductSummary(res.data));
    api.get('/reports/supplier-summary').then((res) => setSupplierSummary(res.data));
  }, []);

  return (
    <Layout>
      <h1 className="page-title">Reports & Analytics</h1>

      <Reveal>
        <div className="panel glass">
          <h2>Low Stock Report</h2>
          {lowStock.length === 0 ? (
            <div className="empty-state">No low stock items.</div>
          ) : (
            <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr><th>Product</th><th>SKU</th><th>Quantity</th><th>Threshold</th><th>Supplier</th></tr>
              </thead>
              <tbody>
                {lowStock.map((p) => (
                  <tr key={p._id}>
                    <td>{p.name}</td>
                    <td>{p.sku}</td>
                    <td>{p.quantity}</td>
                    <td>{p.lowStockThreshold}</td>
                    <td>{p.supplier?.name || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          )}
        </div>
      </Reveal>

      <Reveal delay={100}>
        <div className="panel glass">
          <h2>Product Summary by Category</h2>
          {productSummary.length === 0 ? (
            <div className="empty-state">No products yet.</div>
          ) : (
            <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr><th>Category</th><th>Products</th><th>Total Quantity</th><th>Total Value</th></tr>
              </thead>
              <tbody>
                {productSummary.map((c) => (
                  <tr key={c._id}>
                    <td>{c._id}</td>
                    <td>{c.totalProducts}</td>
                    <td>{c.totalQuantity}</td>
                    <td>₹{c.totalValue.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          )}
        </div>
      </Reveal>

      <Reveal delay={200}>
        <div className="panel glass">
          <h2>Supplier Summary</h2>
          {supplierSummary.length === 0 ? (
            <div className="empty-state">No suppliers yet.</div>
          ) : (
            <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr><th>Supplier</th><th>Products</th><th>Total Quantity</th><th>Total Value</th></tr>
              </thead>
              <tbody>
                {supplierSummary.map((s) => (
                  <tr key={s.supplierId}>
                    <td>{s.name}</td>
                    <td>{s.totalProducts}</td>
                    <td>{s.totalQuantity}</td>
                    <td>₹{s.totalValue.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          )}
        </div>
      </Reveal>
    </Layout>
  );
};

export default Reports;
