import { useEffect, useState } from 'react';
import api from '../api/axios';
import Layout from '../components/Layout';
import Reveal from '../components/Reveal';

const emptyForm = { name: '', sku: '', category: '', price: '', quantity: '', lowStockThreshold: '', supplier: '' };

const Products = () => {
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [stockModal, setStockModal] = useState(null);
  const [stockAmount, setStockAmount] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const loadProducts = async (q = '') => {
    const { data } = await api.get('/products', { params: q ? { search: q } : {} });
    setProducts(data);
  };

  const loadSuppliers = async () => {
    const { data } = await api.get('/suppliers');
    setSuppliers(data);
  };

  useEffect(() => {
    Promise.all([loadProducts(), loadSuppliers()]).finally(() => setLoading(false));
  }, []);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    loadProducts(e.target.value);
  };

  const openCreate = () => {
    if (suppliers.length === 0) {
      setError('Add a supplier before creating a product');
      return;
    }
    setForm({ ...emptyForm, supplier: suppliers[0]._id });
    setEditingId(null);
    setShowForm(true);
    setError('');
  };

  const openEdit = (p) => {
    setForm({
      name: p.name,
      sku: p.sku,
      category: p.category,
      price: p.price,
      quantity: p.quantity,
      lowStockThreshold: p.lowStockThreshold,
      supplier: p.supplier?._id || (suppliers[0]?._id ?? '')
    });
    setEditingId(p._id);
    setShowForm(true);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.supplier) {
      setError('Please select a supplier');
      return;
    }
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        quantity: Number(form.quantity),
        lowStockThreshold: Number(form.lowStockThreshold) || 10
      };
      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
      } else {
        await api.post('/products', payload);
      }
      setShowForm(false);
      loadProducts(search);
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    await api.delete(`/products/${id}`);
    loadProducts(search);
  };

  const handleStockSubmit = async (changeType) => {
    if (!stockAmount || Number(stockAmount) <= 0) return;
    try {
      await api.post(`/products/${stockModal._id}/stock`, {
        changeType,
        amount: Number(stockAmount)
      });
      setStockModal(null);
      setStockAmount('');
      loadProducts(search);
    } catch (err) {
      alert(err.response?.data?.message || 'Stock update failed');
    }
  };

  return (
    <Layout>
      <div className="page-header">
        <h1 className="page-title">Products</h1>
        <button onClick={openCreate}>+ Add Product</button>
      </div>

      {error && !showForm && <div className="error-msg">{error}</div>}

      <input
        className="search-input"
        placeholder="Search by name or SKU..."
        value={search}
        onChange={handleSearch}
      />

      <Reveal>
        <div className="glass" style={{ overflow: 'hidden' }}>
          {loading ? (
            <div className="empty-state">Loading products...</div>
          ) : products.length === 0 ? (
            <div className="empty-state">No products yet. Add your first product to get started.</div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>SKU</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Supplier</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id} className={p.quantity <= p.lowStockThreshold ? 'low-stock-row' : ''}>
                    <td>{p.name}</td>
                    <td>{p.sku}</td>
                    <td>{p.category}</td>
                    <td>₹{p.price}</td>
                    <td>{p.quantity}</td>
                    <td>{p.supplier?.name || '-'}</td>
                    <td className="actions">
                      <button onClick={() => setStockModal(p)}>Stock</button>
                      <button className="secondary" onClick={() => openEdit(p)}>Edit</button>
                      <button className="danger" onClick={() => handleDelete(p._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Reveal>

      {showForm && (
        <div className="modal-overlay">
          <form className="modal-card glass" onSubmit={handleSubmit}>
            <h2>{editingId ? 'Edit Product' : 'Add Product'}</h2>
            {error && <div className="error-msg">{error}</div>}
            <label>Name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <label>SKU</label>
            <input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} required />
            <label>Category</label>
            <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required />
            <label>Price</label>
            <input type="number" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
            <label>Quantity</label>
            <input type="number" min="0" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} required />
            <label>Low Stock Threshold</label>
            <input type="number" min="0" value={form.lowStockThreshold} onChange={(e) => setForm({ ...form, lowStockThreshold: e.target.value })} />
            <label>Supplier</label>
            {suppliers.length === 0 ? (
              <p className="field-warning">No suppliers found. Add a supplier first, then come back here.</p>
            ) : (
              <select value={form.supplier} onChange={(e) => setForm({ ...form, supplier: e.target.value })} required>
                {suppliers.map((s) => (
                  <option key={s._id} value={s._id}>{s.name}</option>
                ))}
              </select>
            )}
            <div className="modal-actions">
              <button type="button" className="secondary" onClick={() => setShowForm(false)}>Cancel</button>
              <button type="submit" disabled={suppliers.length === 0}>Save</button>
            </div>
          </form>
        </div>
      )}

      {stockModal && (
        <div className="modal-overlay">
          <div className="modal-card glass">
            <h2>Adjust Stock — {stockModal.name}</h2>
            <p>Current quantity: {stockModal.quantity}</p>
            <label>Amount</label>
            <input type="number" min="1" value={stockAmount} onChange={(e) => setStockAmount(e.target.value)} />
            <div className="modal-actions">
              <button type="button" className="secondary" onClick={() => { setStockModal(null); setStockAmount(''); }}>Cancel</button>
              <button type="button" onClick={() => handleStockSubmit('decrease')}>Decrease</button>
              <button type="button" onClick={() => handleStockSubmit('increase')}>Increase</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Products;
