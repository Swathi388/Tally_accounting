import React, { useState, useEffect } from 'react';
import { 
  X, User, Mail, Phone, MapPin, 
  CreditCard, ShieldCheck, Plus, CheckCircle2,
  AlertCircle, Building, Loader2, Save
} from 'lucide-react';
import { ledgerAPI, groupAPI } from '../../services/api';

const CreateCustomerModal = ({ isOpen, onClose, onSuccess, customerToEdit = null }) => {
  const [name, setName] = useState('');
  const [openingBalance, setOpeningBalance] = useState('0');
  const [gstNumber, setGstNumber] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [creditLimit, setCreditLimit] = useState('0');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [groupId, setGroupId] = useState(null);
  const companyId = localStorage.getItem('companyId');

  // Pre-fill if editing
  useEffect(() => {
    if (customerToEdit) {
      setName(customerToEdit.name || '');
      setOpeningBalance(customerToEdit.openingBalance?.toString() || '0');
      setGstNumber(customerToEdit.gstNumber || '');
      setEmail(customerToEdit.email || '');
      setPhone(customerToEdit.phone || '');
      setAddress(customerToEdit.address || '');
      setCreditLimit(customerToEdit.creditLimit?.toString() || '0');
      setGroupId(customerToEdit.GroupId);
    } else {
      setName(''); setOpeningBalance('0'); setGstNumber(''); setEmail(''); setPhone(''); setAddress(''); setCreditLimit('0');
    }
  }, [customerToEdit, isOpen]);

  // Find 'Sundry Debtors' group automatically if not editing
  useEffect(() => {
    if (!isOpen || !companyId || customerToEdit) return;
    groupAPI.getByCompany(companyId).then(res => {
      const debtorGroup = res.data.find(g => g.name.toLowerCase().includes('debtor'));
      if (debtorGroup) setGroupId(debtorGroup.id);
    });
  }, [isOpen, customerToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!groupId) { setError("Accounting group was not found."); return; }
    
    setLoading(true);
    setError('');
    const data = {
      name, companyId, groupId,
      openingBalance: parseFloat(openingBalance || 0),
      gstNumber, email, phone, address, 
      creditLimit: parseFloat(creditLimit || 0)
    };

    try {
      if (customerToEdit) {
        await ledgerAPI.update(customerToEdit.id, data);
      } else {
        await ledgerAPI.create({ ...data, currentBalance: data.openingBalance });
      }
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Operation failed.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-scale-up border border-white/20">
        {/* Header */}
        <div className="px-8 py-6 bg-[#f8fafc] border-b border-slate-100 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                 {customerToEdit ? <Edit2 size={22} strokeWidth={2.5}/> : <User size={22} strokeWidth={2.5}/>}
              </div>
              <div>
                 <h2 className="text-xl font-black text-slate-900 tracking-tight">
                    {customerToEdit ? 'Modify Business Record' : 'Onboard New Customer'}
                 </h2>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Automated Grouping: Sundry Debtors</p>
              </div>
           </div>
           <button onClick={onClose} className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-slate-900 transition-all shadow-sm">
              <X size={18}/>
           </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
           {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-red-600 animate-shake">
                 <AlertCircle size={18} className="shrink-0 mt-0.5"/>
                 <span className="text-xs font-bold leading-relaxed">{error}</span>
              </div>
           )}

           <div className="grid grid-cols-2 gap-8 mb-8">
              <div className="space-y-5">
                 <section>
                    <label className={labelStyle}>Business Name</label>
                    <div className="relative">
                       <Building size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"/>
                       <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="Acme Ltd" className={inputStyle} />
                    </div>
                 </section>

                 <section>
                    <label className={labelStyle}>GSTIN / Tax ID</label>
                    <div className="relative">
                       <ShieldCheck size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"/>
                       <input type="text" value={gstNumber} onChange={e => setGstNumber(e.target.value)} placeholder="07AAAAA0000A1Z5" className={inputStyle} />
                    </div>
                 </section>

                 <div className="grid grid-cols-2 gap-4">
                    <section>
                       <label className={labelStyle}>Email</label>
                       <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="mail@acme.com" className={inputStyle} />
                    </section>
                    <section>
                       <label className={labelStyle}>Mobile</label>
                       <input type="text" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91" className={inputStyle} />
                    </section>
                 </div>
              </div>

              <div className="space-y-5">
                 <section>
                    <label className={labelStyle}>Corporate Address</label>
                    <div className="relative">
                       <MapPin size={16} className="absolute left-4 top-4 text-slate-300"/>
                       <textarea value={address} onChange={e => setAddress(e.target.value)} rows={3} className={inputStyle + " pl-11 resize-none"} />
                    </div>
                 </section>

                 <div className="grid grid-cols-2 gap-4">
                    <section>
                       <label className={labelStyle}>Opening Bal (₹)</label>
                       <input type="number" value={openingBalance} onChange={e => setOpeningBalance(e.target.value)} className={inputStyle} />
                    </section>
                    <section>
                       <label className={labelStyle}>Credit Limit (₹)</label>
                       <input type="number" value={creditLimit} onChange={e => setCreditLimit(e.target.value)} className={inputStyle} />
                    </section>
                 </div>
              </div>
           </div>

           <div className="flex items-center justify-between pt-6 border-t border-slate-50">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold text-[10px]">FIX</div>
                 <p className="text-[10px] font-bold text-slate-400">Record will persist in <br/><span className="text-slate-900 uppercase">Sundry Debtors Cluster</span></p>
              </div>
              <div className="flex gap-3">
                 <button type="button" onClick={onClose} className="px-6 py-3 rounded-xl border border-slate-100 font-bold text-slate-400 text-xs uppercase tracking-widest">Cancel</button>
                 <button type="submit" disabled={loading} className="px-10 py-3 bg-[#0f172a] text-white rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-slate-900/10 transition-all hover:scale-105">
                    {loading ? <Loader2 size={16} className="animate-spin" /> : (customerToEdit ? <><Save size={16}/> Update Profile</> : <><Plus size={16}/> Build Profile</>)}
                 </button>
              </div>
           </div>
        </form>
      </div>
    </div>
  );
};

const Edit2 = ({ size, color, strokeWidth }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
);

const labelStyle = "block text-[10px] font-black uppercase tracking-[0.1em] text-slate-400 mb-2";
const inputStyle = "w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-900 outline-none focus:border-blue-500 focus:bg-white transition-all";

export default CreateCustomerModal;
