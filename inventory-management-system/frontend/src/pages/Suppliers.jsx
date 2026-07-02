import { useEffect, useState } from 'react';
import api from '../api/axios';
import Layout from '../components/Layout';

const emptyForm = { name: '', email: '', phone: '', address: '' };

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');

  const loadSuppliers = async () => {
    const { data } = await api.get('/suppliers');
    setSuppliers(data);
  };

  useEffect(() => {
    loadSuppliers();
  }, []);

  const openCreate = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
    setError('');
  };

  const openEdit = (s) => {
    setForm({ name: s.name, email: s.email, phone: s.phone, address: s.address });
    setEditingId(s._id);
    setShowForm(true);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingId) {
        await api.put(`/suppliers/${editingId}`, form);
      } else {
        await api.post('/suppliers', form);
      }
      setShowForm(false);
      loadSuppliers();
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this supplier?')) return;
    try {
      await api.delete(`/suppliers/${id}`);
      loadSuppliers();
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <Layout>
      <div className="page-header">
        <h1 className="page-title">Suppliers</h1>
        <button onClick={openCreate}>+ Add Supplier</button>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map((s) => (
            <tr key={s._id}>
              <td>{s.name}</td>
              <td>{s.email}</td>
              <td>{s.phone}</td>
              <td>{s.address}</td>
              <td className="actions">
                <button onClick={() => openEdit(s)}>Edit</button>
                <button className="danger" onClick={() => handleDelete(s._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showForm && (
        <div className="modal-overlay">
          <form className="modal-card" onSubmit={handleSubmit}>
            <h2>{editingId ? 'Edit Supplier' : 'Add Supplier'}</h2>
            {error && <div className="error-msg">{error}</div>}
            <label>Name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <label>Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            <label>Phone</label>
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
            <label>Address</label>
            <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required />
            <div className="modal-actions">
              <button type="button" className="secondary" onClick={() => setShowForm(false)}>Cancel</button>
              <button type="submit">Save</button>
            </div>
          </form>
        </div>
      )}
    </Layout>
  );
};

export default Suppliers;
