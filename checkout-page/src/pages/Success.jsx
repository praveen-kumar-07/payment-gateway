import React from 'react';

const Success = ({ paymentId }) => {
  return (
    <div data-test-id="success-state" className="text-center py-12">
      {/* Animated Success Icon */}
      <div className="relative w-28 h-28 mx-auto mb-6">
        {/* Outer celebration ring */}
        <div className="absolute inset-0 bg-emerald-400 rounded-full opacity-20 animate-ping"></div>
        
        {/* Success circle background */}
        <div className="relative w-28 h-28 bg-gradient-to-br from-emerald-400 via-green-500 to-teal-500 rounded-full flex items-center justify-center shadow-2xl border-4 border-emerald-100 animate-[wiggle_0.5s_ease-in-out]">
          <svg className="w-14 h-14 text-white animate-[scale-in_0.3s_ease-out]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        
        {/* Confetti-like decorative elements */}
        <div className="absolute -top-3 -right-3 w-8 h-8 bg-yellow-400 rounded-full opacity-70 animate-bounce"></div>
        <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-blue-400 rounded-full opacity-70 animate-bounce" style={{animationDelay: '0.1s'}}></div>
        <div className="absolute top-0 -left-4 w-4 h-4 bg-pink-400 rounded-full opacity-70 animate-bounce" style={{animationDelay: '0.2s'}}></div>
        <div className="absolute -bottom-3 -right-2 w-5 h-5 bg-purple-400 rounded-full opacity-70 animate-bounce" style={{animationDelay: '0.15s'}}></div>
      </div>

      {/* Success Title */}
      <h2 className="text-4xl font-black bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent mb-3">
        Payment Successful!
      </h2>
      
      {/* Success Message */}
      <p data-test-id="success-message" className="text-gray-600 text-lg mb-6 font-medium">
        Your transaction has been completed successfully
      </p>

      {/* Checkmark with details */}
      <div className="mb-6 flex items-center justify-center space-x-2 text-green-600">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        <span className="text-sm font-semibold">Transaction Verified</span>
      </div>

      {/* Payment ID Card */}
      <div className="bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 border-2 border-emerald-200 rounded-2xl p-6 max-w-sm mx-auto mb-6 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-emerald-200 rounded-lg">
              <svg className="w-4 h-4 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="text-sm font-bold text-emerald-900">Payment Reference</span>
          </div>
          <button className="p-1.5 hover:bg-emerald-200 rounded-lg transition-colors group">
            <svg className="w-4 h-4 text-emerald-600 group-hover:text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
        <div className="bg-white rounded-xl p-4 border border-emerald-100">
          <div className="text-xs text-gray-500 mb-1">Transaction ID</div>
          <div data-test-id="payment-id" className="font-mono font-bold text-gray-800 text-sm break-all">
            {paymentId}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 mb-6">
        <button className="w-full max-w-xs mx-auto block bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
          <span className="flex items-center justify-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Download Receipt</span>
          </span>
        </button>

        <button className="w-full max-w-xs mx-auto block border-2 border-emerald-300 hover:border-emerald-400 hover:bg-emerald-50 text-emerald-700 font-semibold px-8 py-3 rounded-xl transition-all">
          <span className="flex items-center justify-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>Back to Home</span>
          </span>
        </button>
      </div>

      {/* Success Details */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 max-w-sm mx-auto">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 mt-0.5">
            <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex-1 text-left">
            <p className="text-xs font-bold text-blue-900 mb-1">What's Next?</p>
            <p className="text-xs text-blue-700">
              A confirmation email has been sent to your registered email address. Please save the transaction ID for your records.
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-5deg); }
          75% { transform: rotate(5deg); }
        }
        @keyframes scale-in {
          0% { transform: scale(0); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default Success;