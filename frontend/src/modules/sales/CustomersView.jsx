import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { 
  Users, Plus, Search, Filter, 
  Download, RefreshCcw, MoreHorizontal,
  ChevronRight, Phone, Mail, MapPin,
  Activity, ArrowUpRight, Shield
} from 'lucide-react';
import { ledgerAPI } from '../../services/api';

const CustomersView = ({ onArchive }) => {
  const [rowData, setRowData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDrawer, setShowDrawer] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', gstNumber: '', openingBalance: 0 });
  const companyId = localStorage.getItem('companyId');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        await ledgerAPI.create({
            ...formData,
            CompanyId: companyId,
            groupName: 'Sundry Debtors',
            nature: 'Assets',
            isCustomer: true
        });
        setShowDrawer(false);
        setFormData({ name: '', email: '', phone: '', gstNumber: '', openingBalance: 0 });
        fetchCustomers();
    } catch (err) { console.error(err); }
  };

  const fetchCustomers = useCallback(async () => {
    if (!companyId) return;
    setLoading(true);
    try {
      const res = await ledgerAPI.getByCompany(companyId);
      // Filter for ledgers that belong to 'Sundry Debtors' or have customer-like properties
      const customers = res.data.filter(l => l.groupName === 'Sundry Debtors' || l.isCustomer);
      setRowData(customers);
    } catch (err) { console.error(err); }
    setLoading(false);
  }, [companyId]);

  useEffect(() => { fetchCustomers(); }, [fetchCustomers]);

  const columnDefs = useMemo(() => [
    { 
      headerName: 'CUSTOMER IDENTITY', 
      field: 'name', 
      flex: 1,
      minWidth: 250,
      cellRenderer: p => (
        <div className="flex items-center gap-4 py-2">
           <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-900 font-black text-sm shadow-sm group-hover:bg-slate-900 group-hover:text-white transition-all">
              {p.value?.substring(0, 1).toUpperCase()}
           </div>
           <div>
              <div className="font-black text-slate-900 tracking-tight text-[14px]">{p.value}</div>
              <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest mt-0.5">{p.data.gstNumber || 'NO GST REG'}</div>
           </div>
        </div>
      )
    },
    { 
      headerName: 'COMMUNICATION', 
      field: 'email', 
      width: 250,
      cellRenderer: p => (
        <div className="text-slate-500 font-bold text-[13px] tracking-tight truncate">
           {p.value || 'info@client.com'} <br/>
           <span className="text-[10px] text-slate-400 uppercase tracking-widest">{p.data.phone || 'NO CONTACT'}</span>
        </div>
      )
    },
    { 
      headerName: 'ACCOUNT BALANCE (₹)', 
      field: 'openingBalance', 
      width: 210,
      type: 'numericColumn',
      cellRenderer: p => (
        <div className="text-right pr-6 font-black text-slate-900 text-[16px] tracking-tighter">
           ₹{parseFloat(p.value || 0).toLocaleString('en-IN')}
        </div>
      )
    },
    { 
      headerName: 'RISK STATUS', 
      width: 160,
      cellRenderer: p => (
        <div className="flex justify-center">
           <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border
              ${parseFloat(p.data.openingBalance) > 50000 ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
              {parseFloat(p.data.openingBalance) > 50000 ? 'High Credit' : 'Standard'}
           </span>
        </div>
      )
    },
    { 
      headerName: 'CRM AUDIT', 
      width: 160,
      pinned: 'right',
      cellRenderer: (p) => (
        <div className="flex items-center gap-2 h-full justify-center">
           <button 
             onClick={() => onEdit(p.data)}
             title="Audit Full Entity"
             className="w-8 h-8 rounded-lg border border-slate-50 bg-white flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-sm group">
              <Activity size={14}/>
           </button>
           <button 
             onClick={() => onEdit(p.data)}
             title="Edit Parameters"
             className="w-8 h-8 rounded-lg border border-slate-50 bg-white flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm group">
              <Search size={14}/>
           </button>
           <button 
             onClick={() => onArchive(p.data.id)}
             title="Isolate Cluster"
             className="w-8 h-8 rounded-lg border border-slate-50 bg-white flex items-center justify-center text-slate-400 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all shadow-sm group">
              <Shield size={14}/>
           </button>
        </div>
      )
    }
  ], []);

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-10 animate-fade-in">
      
      {/* ══ HEADER HUB ══════════════════════════════════════════ */}
      <div className="flex justify-between items-end border-b border-slate-100 pb-8">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-xl shadow-blue-200/40"><Users size={18}/></div>
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">CRM Infrastructure · Debtors</span>
           </div>
           <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Customer Registry</h1>
        </div>
        <div className="flex gap-3">
           <button onClick={fetchCustomers} className="p-2.5 border border-slate-100 rounded-xl bg-white hover:bg-slate-50 text-slate-400 shadow-sm"><RefreshCcw size={16}/></button>
           <button 
              onClick={() => setShowDrawer(true)}
              className="bg-slate-900 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-900/10 flex items-center gap-2 hover:-translate-y-0.5 transition-all"
           >
              <Plus size={16}/> Register New Entity
           </button>
        </div>
      </div>

      {/* ══ CRM METRICS ═════════════════════════════════════════ */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         <MetricCell label="Active Debtors" value={rowData.length} color="blue" />
         <MetricCell label="Avg Realization" value="14 Days" color="emerald" />
         <MetricCell label="Total Receivables" value={`₹${rowData.reduce((s,c)=>s+parseFloat(c.openingBalance),0).toLocaleString('en-IN')}`} color="slate" />
         <MetricCell label="Audit Status" value="Secure" color="indigo" />
      </div>

      {/* ══ DATA ENGINE ═════════════════════════════════════════ */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/20 overflow-hidden flex flex-col">
          <div className="h-14 px-10 bg-slate-50/20 border-b border-slate-50 flex items-center justify-between">
             <div className="flex items-center gap-6">
                <div className="relative group">
                   <Search size={14} className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-300" />
                   <input 
                     type="text" 
                     placeholder="QUERY CUSTOMER IDENTITY..." 
                     className="pl-6 bg-transparent border-none font-black text-[10px] uppercase tracking-widest text-slate-900 outline-none w-80"
                   />
                </div>
             </div>
             <div className="flex items-center gap-4">
                <Shield size={14} className="text-slate-300"/>
                <Download size={14} className="text-slate-300 cursor-pointer hover:text-slate-900" />
             </div>
          </div>
          
          <div className="ag-theme-alpine w-full" style={{ height: 600 }}>
             <AgGridReact
                rowData={rowData}
                columnDefs={columnDefs}
                defaultColDef={{ resizable: true, sortable: true, filter: true }}
                rowHeight={72}
                headerHeight={50}
                pagination={true}
                paginationPageSize={20}
                animateRows={true}
             />
          </div>
      </div>

      {/* ══ CREATION MODAL ══════════════════════════════════════ */}
      {showDrawer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowDrawer(false)}></div>
              <div className="relative w-full max-w-[500px] max-h-[90vh] bg-white rounded-2xl shadow-2xl border border-slate-200 animate-fade-in flex flex-col overflow-hidden">
                  <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                     <div>
                        <h2 className="text-lg font-bold text-slate-900">Register CRM Entity</h2>
                        <span className="text-xs text-slate-500 font-medium mt-1">Add a new Debtors ledger to the system</span>
                     </div>
                     <button onClick={() => setShowDrawer(false)} className="p-2 rounded-lg hover:bg-slate-200 text-slate-500 transition-colors">✕</button>
                  </div>

                  <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-5">
                     <div className="space-y-2">
                        <label className="text-[11px] font-bold uppercase text-slate-500 tracking-wider">Entity Identity</label>
                        <input 
                           type="text" 
                           required
                           value={formData.name}
                           onChange={(e) => setFormData({...formData, name: e.target.value})}
                           placeholder="e.g. Acme Corporation Pvt. Ltd."
                           className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none shadow-sm"
                        />
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <label className="text-[11px] font-bold uppercase text-slate-500 tracking-wider">Communication Email</label>
                           <input 
                              type="email" 
                              value={formData.email}
                              onChange={(e) => setFormData({...formData, email: e.target.value})}
                              placeholder="info@acme.com"
                              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none shadow-sm"
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[11px] font-bold uppercase text-slate-500 tracking-wider">Phone Link</label>
                           <input 
                              type="text" 
                              value={formData.phone}
                              onChange={(e) => setFormData({...formData, phone: e.target.value})}
                              placeholder="+91 98765 43210"
                              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none shadow-sm"
                           />
                        </div>
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <label className="text-[11px] font-bold uppercase text-slate-500 tracking-wider">GST Registration</label>
                           <input 
                              type="text" 
                              value={formData.gstNumber}
                              onChange={(e) => setFormData({...formData, gstNumber: e.target.value})}
                              placeholder="e.g. 27ABCDE1234F1Z5"
                              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 font-mono focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none shadow-sm"
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[11px] font-bold uppercase text-slate-500 tracking-wider">Opening Receivables</label>
                           <input 
                              type="number" 
                              value={formData.openingBalance}
                              onChange={(e) => setFormData({...formData, openingBalance: e.target.value})}
                              placeholder="0.00"
                              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 font-mono text-right focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none shadow-sm"
                           />
                        </div>
                     </div>
                  </form>

                  <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 shrink-0">
                      <button 
                          type="button" 
                          onClick={() => setShowDrawer(false)}
                          className="px-5 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
                      >
                          Cancel
                      </button>
                      <button 
                          onClick={handleSubmit}
                          className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold shadow-sm hover:bg-blue-700 transition-colors"
                      >
                          Register Entity
                      </button>
                  </div>
              </div>
          </div>
      )}

    </div>
  );
};

const MetricCell = ({ label, value, color }) => (
  <div className="bg-white p-7 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/10 group hover:-translate-y-1 transition-all duration-300">
     <div className="flex items-center gap-3 mb-4">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center border shadow-sm
           ${color === 'blue' ? 'bg-blue-50 text-blue-600 border-blue-100' : 
             color === 'emerald' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-900 border-slate-100'}`}>
           <Activity size={14}/>
        </div>
        <p className="text-[9px] font-black uppercase text-slate-400 tracking-[0.2em]">{label}</p>
     </div>
     <h3 className="text-2xl font-black text-slate-900 tracking-tighter">{value}</h3>
  </div>
);

export default CustomersView;
