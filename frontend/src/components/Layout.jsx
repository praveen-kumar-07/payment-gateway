import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, CreditCard, LogOut } from 'lucide-react';

const Layout = ({ children }) => {
    const navigate = useNavigate();
    return (
        <div className="flex min-h-screen bg-slate-900 text-slate-100 font-sans">
            <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col">
                <div className="p-6 text-xl font-bold text-indigo-500 tracking-tight">PAYGATE</div>
                <nav className="flex-1 px-4 space-y-2 mt-4">
                    <button onClick={() => navigate('/dashboard')} className="flex items-center w-full p-3 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-all">
                        <LayoutDashboard size={20} className="mr-3" /> Dashboard
                    </button>
                    <button onClick={() => navigate('/dashboard/transactions')} className="flex items-center w-full p-3 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-all">
                        <CreditCard size={20} className="mr-3" /> Transactions
                    </button>
                </nav>
                <div className="p-4 border-t border-slate-800">
                    <button onClick={() => navigate('/login')} className="flex items-center w-full p-3 text-red-400 hover:bg-slate-900 rounded-lg">
                        <LogOut size={20} className="mr-3" /> Logout
                    </button>
                </div>
            </aside>
            <main className="flex-1 overflow-auto">
                {children}
            </main>
        </div>
    );
};

export default Layout;