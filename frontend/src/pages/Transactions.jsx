import { useEffect, useState } from "react";

const PAYMENTS_API = "http://localhost:8000/api/v1/payments";

export default function Transactions() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await fetch(PAYMENTS_API, {
          method: "GET",
          headers: {
            "content-type": "application/json",
            "X-Api-Key": "key_test_abc123",
            "X-Api-Secret": "secret_test_xyz789"
          }
        });

        const data = await res.json();
        setPayments(data);
      } catch (err) {
        console.error("Failed to fetch payments", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(value);
  };

  const formatDateTime = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusStyle = (status) => {
    const styles = {
      SUCCESS: 'bg-emerald-100 text-emerald-700 border-emerald-300',
      FAILED: 'bg-red-100 text-red-700 border-red-300',
      PENDING: 'bg-amber-100 text-amber-700 border-amber-300',
      PROCESSING: 'bg-blue-100 text-blue-700 border-blue-300'
    };
    return styles[status?.toUpperCase()] || 'bg-gray-100 text-gray-700 border-gray-300';
  };

  const getMethodIcon = (method) => {
    const icons = {
      UPI: '📱',
      CARD: '💳',
      NETBANKING: '🏦',
      WALLET: '👛'
    };
    return icons[method?.toUpperCase()] || '💰';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading transactions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Payment Transactions</h1>
          <p className="text-gray-600">Complete history of all payment transactions</p>
          <div className="mt-4 inline-flex items-center px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200">
            <span className="text-sm text-gray-600 mr-2">Total Transactions:</span>
            <span className="text-lg font-bold text-blue-600">{payments.length}</span>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
          {payments.length === 0 ? (
            <div className="p-16 text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Transactions Found</h3>
              <p className="text-gray-500">There are no payment transactions to display at this time.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full" data-test-id="transactions-table">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                      Payment ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                      Method
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                      Created
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {payments.map((p) => (
                    <tr
                      key={p.id}
                      data-test-id="transaction-row"
                      data-payment-id={p.id}
                      className="hover:bg-blue-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap" data-test-id="payment-id">
                        <span className="font-mono text-sm font-semibold text-gray-900 bg-gray-100 px-3 py-1 rounded-lg">
                          {p.id}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap" data-test-id="order-id">
                        <span className="font-mono text-sm text-gray-600">
                          {p.order_id}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap" data-test-id="amount">
                        <span className="text-base font-bold text-gray-900">
                          {formatCurrency(p.amount)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap" data-test-id="method">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 border border-gray-200">
                          <span className="mr-1.5">{getMethodIcon(p.method)}</span>
                          {p.method}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap" data-test-id="status">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(p.status)}`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600" data-test-id="created-at">
                        <div className="flex flex-col">
                          <span className="font-medium">{formatDateTime(p.created_at).split(',')[0]}</span>
                          <span className="text-xs text-gray-500">{formatDateTime(p.created_at).split(',')[1]}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer Info */}
        {payments.length > 0 && (
          <div className="mt-6 flex justify-between items-center text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span>Showing all {payments.length} transactions</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span>Secure connection</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}