import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';

const API_URL = 'http://localhost:8000';

const DashboardContent = () => {
  const [merchant, setMerchant] = useState(null);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [successRate, setSuccessRate] = useState(0);

  useEffect(() => {
    // Fetch merchant info
    fetch(`${API_URL}/api/v1/test/merchant`)
      .then(res => res.json())
      .then(data =>
        setMerchant({
          ...data,
          api_secret: 'secret_test_xyz789' // allowed for Deliverable 1
        })
      )
      .catch(err => console.error("Failed to fetch merchant", err));
  }, []);

  useEffect(() => {
    // Fetch payments for stats
    const fetchPayments = async () => {
      try {
        const res = await fetch(`${API_URL}/api/v1/payments`, {
          method: "GET",
          headers: {
            "content-type": "application/json",
            "X-Api-Key": "key_test_abc123",
            "X-Api-Secret": "secret_test_xyz789"
          }
        });

        const payments = await res.json();

        const total = payments.length;
        const successful = payments.filter(p => p.status === "success");
        const amount = successful.reduce((sum, p) => sum + p.amount, 0);
        const rate = total === 0 ? 0 : Math.round((successful.length / total) * 100);

        setTotalTransactions(total);
        setTotalAmount(amount);
        setSuccessRate(rate);
      } catch (err) {
        console.error("Failed to fetch payments", err);
      }
    };

    fetchPayments();
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="p-8 bg-gradient-to-br from-orange-50 via-rose-50 to-pink-50 min-h-screen" data-test-id="dashboard">
      {/* Welcome Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-4xl font-extrabold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
            Dashboard Overview
          </h2>
          <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-md border border-orange-200">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-700">Live</span>
          </div>
        </div>
        <p className="text-gray-600">Monitor your payment performance in real-time</p>
      </div>

      {/* API Credentials Card */}
      <div className="bg-white rounded-3xl shadow-2xl border border-orange-100 mb-8 overflow-hidden">
        <div className="bg-gradient-to-r from-orange-500 via-rose-500 to-pink-500 px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white">
              API Credentials
            </h3>
          </div>
        </div>

        <div className="p-6" data-test-id="api-credentials">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-rose-400 rounded-2xl opacity-0 group-hover:opacity-100 blur transition-opacity"></div>
              <div className="relative bg-gradient-to-br from-orange-50 to-rose-50 p-5 rounded-2xl border-2 border-orange-200 hover:border-orange-300 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-bold text-orange-600 uppercase tracking-wider">
                    🔑 API Key
                  </label>
                  <button className="p-1.5 hover:bg-orange-200 rounded-lg transition-colors">
                    <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
                <div className="font-mono text-sm font-semibold text-gray-800 break-all bg-white px-3 py-2 rounded-lg border border-orange-100" data-test-id="api-key">
                  {merchant?.api_key || "Loading..."}
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-rose-400 to-pink-400 rounded-2xl opacity-0 group-hover:opacity-100 blur transition-opacity"></div>
              <div className="relative bg-gradient-to-br from-rose-50 to-pink-50 p-5 rounded-2xl border-2 border-rose-200 hover:border-rose-300 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-bold text-rose-600 uppercase tracking-wider">
                    🔐 API Secret
                  </label>
                  <button className="p-1.5 hover:bg-rose-200 rounded-lg transition-colors">
                    <svg className="w-4 h-4 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
                <div className="font-mono text-sm font-semibold text-gray-800 break-all bg-white px-3 py-2 rounded-lg border border-rose-100" data-test-id="api-secret">
                  {merchant?.api_secret || "Loading..."}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start space-x-3">
            <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-amber-900">Keep your credentials secure</p>
              <p className="text-xs text-amber-700 mt-1">Never share your API secret publicly or commit it to version control</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6" data-test-id="stats-container">
        {/* Total Transactions */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-3xl opacity-75 group-hover:opacity-100 blur-sm group-hover:blur transition-all"></div>
          <div className="relative bg-white rounded-3xl shadow-xl p-6 border-2 border-blue-100 hover:border-blue-200 transition-all transform group-hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                  All Time
                </span>
              </div>
            </div>
            <div className="text-gray-600 font-medium mb-2 text-sm">Total Transactions</div>
            <div className="text-4xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent" data-test-id="total-transactions">
              {totalTransactions.toLocaleString()}
            </div>
            <div className="mt-3 flex items-center text-xs text-green-600 font-semibold">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
              </svg>
              +12% this month
            </div>
          </div>
        </div>

        {/* Total Volume */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-3xl opacity-75 group-hover:opacity-100 blur-sm group-hover:blur transition-all"></div>
          <div className="relative bg-white rounded-3xl shadow-xl p-6 border-2 border-emerald-100 hover:border-emerald-200 transition-all transform group-hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                  Revenue
                </span>
              </div>
            </div>
            <div className="text-gray-600 font-medium mb-2 text-sm">Total Volume</div>
            <div className="text-4xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent" data-test-id="total-amount">
              {formatCurrency(totalAmount)}
            </div>
            <div className="mt-3 flex items-center text-xs text-green-600 font-semibold">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
              </svg>
              +18% this month
            </div>
          </div>
        </div>

        {/* Success Rate */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-500 rounded-3xl opacity-75 group-hover:opacity-100 blur-sm group-hover:blur transition-all"></div>
          <div className="relative bg-white rounded-3xl shadow-xl p-6 border-2 border-purple-100 hover:border-purple-200 transition-all transform group-hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700">
                  Performance
                </span>
              </div>
            </div>
            <div className="text-gray-600 font-medium mb-2 text-sm">Success Rate</div>
            <div className="text-4xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent" data-test-id="success-rate">
              {successRate}%
            </div>
            <div className="mt-3 w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                style={{ width: `${successRate}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <button className="bg-white hover:bg-gradient-to-r hover:from-orange-50 hover:to-rose-50 border-2 border-orange-200 hover:border-orange-300 rounded-2xl p-4 transition-all flex items-center space-x-3 group">
          <div className="p-2 bg-orange-100 group-hover:bg-orange-200 rounded-xl transition-colors">
            <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <span className="font-semibold text-gray-700">Create New Payment</span>
        </button>

        <button className="bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 border-2 border-blue-200 hover:border-blue-300 rounded-2xl p-4 transition-all flex items-center space-x-3 group">
          <div className="p-2 bg-blue-100 group-hover:bg-blue-200 rounded-xl transition-colors">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <span className="font-semibold text-gray-700">View Analytics</span>
        </button>

        <button className="bg-white hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 border-2 border-purple-200 hover:border-purple-300 rounded-2xl p-4 transition-all flex items-center space-x-3 group">
          <div className="p-2 bg-purple-100 group-hover:bg-purple-200 rounded-xl transition-colors">
            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <span className="font-semibold text-gray-700">Settings</span>
        </button>
      </div>
    </div>
  );
};

const Dashboard = () => (
  <Layout>
    <DashboardContent />
  </Layout>
);

export default Dashboard;