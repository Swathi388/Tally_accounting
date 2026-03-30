import React from 'react';
import { Truck, AlertCircle, PlusCircle } from 'lucide-react';

const DeliveryChallansView = () => (
    <div className="flex flex-col items-center justify-center p-20 text-center animate-fade-up">
        <div className="w-24 h-24 bg-surface-100 rounded-full flex items-center justify-center text-ink-300 mb-8">
            <Truck size={48}/>
        </div>
        <h3 className="text-2xl font-black text-ink-900 mb-2">Delivery Challans</h3>
        <p className="text-ink-400 font-medium max-w-md mx-auto mb-8">Move your goods across locations or to customers without billing just yet. Perfect for logistics tracking.</p>
        <button className="bg-primary-600 text-white px-8 py-4 rounded-2xl font-black shadow-glow flex items-center gap-2">
            <PlusCircle size={18}/> Create Your First Challan
        </button>
    </div>
);

export default DeliveryChallansView;
