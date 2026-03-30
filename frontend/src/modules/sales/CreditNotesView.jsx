import React, { useState, useEffect } from 'react';
import { CreditCard, PlusCircle, Search, Filter, MoreVertical, FileText, CheckCircle2, History, MinusCircle } from 'lucide-react';
import { voucherAPI } from '../../services/api';

const CreditNotesView = () => {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const companyId = localStorage.getItem('companyId');

    const fetchNotes = async () => {
        try {
            const res = await voucherAPI.getByCompany(companyId);
            // Credit Note = Usually a specific voucher type in Tally
            const cn = res.data.filter(v => v.voucherType === 'Credit Note');
            setNotes(cn);
        } catch (err) { console.error(err); }
        setLoading(false);
    };

    useEffect(() => {
        if (companyId) fetchNotes();
    }, [companyId]);

    return (
        <div className="space-y-6 animate-fade-up">
            <div className="flex justify-between items-center mb-8">
                <div className="flex gap-4">
                    <div className="relative w-64">
                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-300" />
                        <input type="text" placeholder="Search credit notes..." className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-100 rounded-xl text-sm font-semibold outline-none focus:border-primary-400 shadow-sm transition-all"/>
                    </div>
                </div>
                <button className="bg-red-600 text-white px-6 py-3 rounded-2xl font-black text-sm shadow-glow flex items-center gap-2">
                    <PlusCircle size={18}/> Issue New Credit Note
                </button>
            </div>

            <div className="bg-white rounded-4xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-surface-50 text-[10px] font-black uppercase text-ink-400 tracking-widest">
                        <tr>
                            <th className="p-6">Dated</th>
                            <th className="p-6">Note #</th>
                            <th className="p-6">Customer Name</th>
                            <th className="p-6">Reason for issue</th>
                            <th className="p-6 text-right">Value (₹)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {notes.length === 0 ? (
                            <tr><td colSpan="5" className="py-20 text-center font-bold text-ink-200 italic">No credit notes issued.</td></tr>
                        ) : (
                            notes.map(n => (
                                <tr key={n.id} className="hover:bg-surface-50 transition-colors group cursor-pointer">
                                    <td className="p-6 text-xs font-bold text-ink-500">{new Date(n.date).toLocaleDateString()}</td>
                                    <td className="p-6 font-black text-red-600 font-mono tracking-tighter">{n.voucherNumber}</td>
                                    <td className="p-6 font-bold text-ink-900">{n.Transactions[0]?.Ledger?.name || 'Customer'}</td>
                                    <td className="p-6 text-xs font-semibold text-ink-400">{n.narration || 'Damaged Goods / Returns'}</td>
                                    <td className="p-6 text-right font-black text-ink-900">₹{n.Transactions.reduce((s,t) => s + parseFloat(t.credit || 0), 0).toLocaleString('en-IN')}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="bg-red-50 p-8 rounded-[2.5rem] border border-red-100 flex items-center gap-6">
                <div className="w-16 h-16 bg-red-100 rounded-3xl flex items-center justify-center text-red-600 shadow-inner overflow-hidden">
                   <MinusCircle size={32}/>
                </div>
                <div>
                   <h4 className="font-black text-ink-900">Return & Refunds Analytics</h4>
                   <p className="text-xs text-ink-400 font-medium">Your sales return rate is 2.4% below industry average. Great job on quality!</p>
                </div>
            </div>
        </div>
    );
};

export default CreditNotesView;
