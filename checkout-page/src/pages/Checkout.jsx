import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Success from './Success';
import Failure from './Failure';

const API_URL = 'http://localhost:8000/api/v1';

const Checkout = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id');
  
  const [order, setOrder] = useState(null);
  const [method, setMethod] = useState(null); // 'upi' or 'card'
  const [status, setStatus] = useState('initial'); // initial, processing, success, failed
  const [paymentId, setPaymentId] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Form States
  const [vpa, setVpa] = useState('');
  const [cardData, setCardData] = useState({ number: '', expiry: '', cvv: '', name: '' });

  useEffect(() => {
    if (orderId) {
      fetch(`${API_URL}/orders/${orderId}/public`)
        .then(res => res.json())
        .then(data => {
            if(data.error) throw new Error(data.error);
            setOrder(data);
        })
        .catch(err => {
            setStatus('failed');
            setErrorMsg('Invalid Order ID');
        });
    }
  }, [orderId]);

  // Polling logic
  useEffect(() => {
    let interval;
    if (status === 'processing' && paymentId) {
      interval = setInterval(() => {
        fetch(`${API_URL}/payments/${paymentId}/public`)
          .then(res => res.json())
          .then(data => {
            if (data.status === 'success') {
                setStatus('success');
                clearInterval(interval);
            } else if (data.status === 'failed') {
                setStatus('failed');
                setErrorMsg(data.error_description || 'Payment Failed');
                clearInterval(interval);
            }
          });
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [status, paymentId]);

  const handlePayment = async (e) => {
    e.preventDefault();
    setStatus('processing');

    const payload = {
        order_id: orderId,
        method: method,
    };

    if (method === 'upi') {
        payload.vpa = vpa;
    } else {
        // Remove spaces from card number before sending to API
        const cleanNumber = cardData.number.replace(/\s/g, '');
        const [month, year] = cardData.expiry.split('/');
        
        payload.card = {
            number: cleanNumber,
            expiry_month: month,
            expiry_year: year,
            cvv: cardData.cvv,
            holder_name: cardData.name
        };
    }

    try {
        const res = await fetch(`${API_URL}/payments/public`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        
        if (res.ok) {
            setPaymentId(data.id);
        } else {
            setStatus('failed');
            setErrorMsg(data.error?.description || 'Validation Failed');
        }
    } catch (err) {
        setStatus('failed');
        setErrorMsg('Network Error');
    }
  };

  if (!orderId) return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
      <div className="text-center bg-white p-8 rounded-2xl shadow-xl">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <p className="text-red-600 font-semibold text-lg">Missing Order ID</p>
      </div>
    </div>
  );

  if (!order && status !== 'failed') return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-purple-700 font-medium text-lg">Loading Order...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-100 via-purple-100 to-fuchsia-100 flex items-center justify-center p-4 font-sans" data-test-id="checkout-container">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border-2 border-purple-200">
        
        {/* Order Summary with Gradient Header */}
        <div className="relative overflow-hidden" data-test-id="order-summary">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600"></div>
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl transform translate-x-20 -translate-y-20"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-fuchsia-300 rounded-full blur-3xl transform -translate-x-10 translate-y-10"></div>
          </div>
          
          <div className="relative p-8 text-white">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold">Secure Checkout</h2>
            </div>
            
            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 border border-white border-opacity-20">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <div className="text-purple-100 text-sm font-medium mb-1">Amount Due</div>
                  <div className="text-4xl font-black" data-test-id="order-amount">
                    ₹{(order?.amount / 100).toFixed(2)}
                  </div>
                  <div className="text-purple-200 text-xs mt-1">{order?.currency || 'INR'}</div>
                </div>
                <div className="text-right">
                  <div className="text-purple-100 text-xs font-medium mb-1">Order Reference</div>
                  <div className="font-mono text-sm bg-white bg-opacity-20 px-3 py-1.5 rounded-lg" data-test-id="order-id">
                    {orderId}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 text-xs text-purple-100">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span>Encrypted & Secure Transaction</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8">
          {status === 'success' && <Success paymentId={paymentId} />}
          
          {status === 'failed' && <Failure errorMsg={errorMsg} onRetry={() => setStatus('initial')} />}

          {status === 'processing' && (
            <div data-test-id="processing-state" className="text-center py-16">
              <div className="relative w-24 h-24 mx-auto mb-6">
                <div className="absolute inset-0 border-8 border-purple-200 rounded-full"></div>
                <div className="absolute inset-0 border-8 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                <div className="absolute inset-4 bg-gradient-to-br from-purple-400 to-fuchsia-400 rounded-full opacity-20"></div>
              </div>
              <span data-test-id="processing-message" className="text-gray-700 font-semibold text-lg block mb-2">
                Processing Payment
              </span>
              <p className="text-gray-500 text-sm">Please wait while we confirm your transaction...</p>
              <div className="mt-6 flex justify-center space-x-1">
                <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
              </div>
            </div>
          )}

          {status === 'initial' && (
            <>
              {/* Payment Method Selection */}
              <div className="mb-8">
                <h3 className="text-gray-700 font-bold text-lg mb-4">Choose Payment Method</h3>
                <div data-test-id="payment-methods" className="grid grid-cols-2 gap-4">
                  <button 
                    data-test-id="method-upi" 
                    data-method="upi"
                    onClick={() => setMethod('upi')}
                    className={`relative group p-6 border-2 rounded-2xl font-semibold transition-all ${
                      method === 'upi' 
                        ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-fuchsia-50 shadow-lg scale-105' 
                        : 'border-gray-200 hover:border-purple-300 hover:shadow-md'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-2">📱</div>
                      <div className={`font-bold ${method === 'upi' ? 'text-purple-700' : 'text-gray-700'}`}>
                        UPI
                      </div>
                      <div className="text-xs text-gray-500 mt-1">Instant Transfer</div>
                    </div>
                    {method === 'upi' && (
                      <div className="absolute top-2 right-2">
                        <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </button>

                  <button 
                    data-test-id="method-card" 
                    data-method="card"
                    onClick={() => setMethod('card')}
                    className={`relative group p-6 border-2 rounded-2xl font-semibold transition-all ${
                      method === 'card' 
                        ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-fuchsia-50 shadow-lg scale-105' 
                        : 'border-gray-200 hover:border-purple-300 hover:shadow-md'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-2">💳</div>
                      <div className={`font-bold ${method === 'card' ? 'text-purple-700' : 'text-gray-700'}`}>
                        Card
                      </div>
                      <div className="text-xs text-gray-500 mt-1">Debit / Credit</div>
                    </div>
                    {method === 'card' && (
                      <div className="absolute top-2 right-2">
                        <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </button>
                </div>
              </div>

              {/* UPI Form */}
              {method === 'upi' && (
                <div className="bg-gradient-to-br from-purple-50 to-fuchsia-50 rounded-2xl p-6 border-2 border-purple-200 mb-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="text-2xl">📱</span>
                    <h4 className="font-bold text-purple-900 text-lg">UPI Payment Details</h4>
                  </div>
                  <form data-test-id="upi-form" onSubmit={handlePayment} className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        UPI ID / Virtual Payment Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                          </svg>
                        </div>
                        <input
                          data-test-id="vpa-input"
                          type="text"
                          placeholder="yourname@paytm"
                          className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white transition-all"
                          value={vpa}
                          onChange={(e) => setVpa(e.target.value)}
                          required
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Example: name@ybl, user@paytm, mobile@oksbi
                      </p>
                    </div>
                    <button 
                      data-test-id="pay-button" 
                      type="submit" 
                      className="w-full py-4 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Pay ₹{(order.amount / 100).toFixed(2)}</span>
                    </button>
                  </form>
                </div>
              )}

              {/* Card Form */}
              {method === 'card' && (
                <div className="bg-gradient-to-br from-purple-50 to-fuchsia-50 rounded-2xl p-6 border-2 border-purple-200 mb-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="text-2xl">💳</span>
                    <h4 className="font-bold text-purple-900 text-lg">Card Payment Details</h4>
                  </div>
                  <form data-test-id="card-form" onSubmit={handlePayment} className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Card Number
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                          </svg>
                        </div>
                        <input
                          data-test-id="card-number-input"
                          type="text"
                          placeholder="1234 5678 9012 3456"
                          className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white font-mono transition-all"
                          value={cardData.number}
                          onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, '').substring(0, 16);
                              const formatted = value.replace(/(\d{4})/g, '$1 ').trim();
                              setCardData({...cardData, number: formatted});
                          }}
                          maxLength="19"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Cardholder Name
                      </label>
                      <input
                        data-test-id="cardholder-name-input"
                        type="text"
                        placeholder="Name as on card"
                        className="w-full px-4 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white transition-all"
                        value={cardData.name}
                        onChange={(e) => setCardData({...cardData, name: e.target.value})}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Expiry Date
                        </label>
                        <input
                          data-test-id="expiry-input"
                          type="text"
                          placeholder="MM/YY"
                          className="w-full px-4 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white transition-all"
                          value={cardData.expiry}
                          onChange={(e) => setCardData({...cardData, expiry: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          CVV
                        </label>
                        <input
                          data-test-id="cvv-input"
                          type="text"
                          placeholder="123"
                          className="w-full px-4 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white transition-all"
                          value={cardData.cvv}
                          onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, '').substring(0, 4);
                              setCardData({...cardData, cvv: value});
                          }}
                          required
                        />
                      </div>
                    </div>

                    <button 
                      data-test-id="pay-button" 
                      type="submit" 
                      className="w-full py-4 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Pay ₹{(order.amount / 100).toFixed(2)}</span>
                    </button>
                  </form>
                </div>
              )}

              {/* Security Info */}
              <div className="mt-6 flex items-center justify-center space-x-2 text-sm text-gray-500">
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span>256-bit SSL Encrypted Payment</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;