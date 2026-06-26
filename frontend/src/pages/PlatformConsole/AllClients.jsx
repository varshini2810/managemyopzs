import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Filter, MoreHorizontal, ActivitySquare, Shield, Users, Box, Calendar } from 'lucide-react';
import api from '../../services/api';

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export default function AllClients() {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const res = await api.get('/admin/clients');
      setClients(res.data.data);
    } catch (error) {
      console.error('Failed to fetch clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clients.filter(c => {
    const matchesSearch = c.companyName.toLowerCase().includes(search.toLowerCase()) || 
                          c.subdomain.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Shield className="text-primary-600" size={24} />
            Client Management
          </h1>
          <p className="text-slate-500 mt-1">Manage platform tenants, administrators, and module access ceilings.</p>
        </div>
        <button 
          onClick={() => navigate('/platform-console/clients/new')}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium transition-colors shadow-sm"
        >
          <Plus size={18} />
          Add New Client
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center gap-4 bg-slate-50/50">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="Search by company or subdomain..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow"
            />
          </div>
          <div className="relative">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none pl-10 pr-8 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer text-slate-700"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Trial">Trial</option>
              <option value="Suspended">Suspended</option>
            </select>
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-500">Loading clients...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Company</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Users</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Modules Granted</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-slate-50/80 transition-colors group cursor-pointer" onClick={() => navigate(`/platform-console/clients/${client.id}`)}>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{client.companyName}</div>
                      <div className="text-xs text-slate-500 font-mono mt-0.5">{client.subdomain}.opz.com</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        client.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' :
                        client.status === 'Trial' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        'bg-red-50 text-red-700 border-red-200'
                      }`}>
                        {client.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Users size={14} className="text-slate-400" />
                        <span className="font-medium">{client.numberOfUsers}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Box size={14} className="text-slate-400" />
                        <span className="font-medium">{client.modulesGranted}</span>
                        <span className="text-xs text-slate-400 ml-1">of 37</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} className="text-slate-400" />
                        {formatDate(client.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-1.5 text-slate-400 hover:text-primary-600 rounded-md hover:bg-primary-50 transition-colors" onClick={(e) => { e.stopPropagation(); navigate(`/platform-console/clients/${client.id}`); }}>
                        <MoreHorizontal size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredClients.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                      No clients found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
