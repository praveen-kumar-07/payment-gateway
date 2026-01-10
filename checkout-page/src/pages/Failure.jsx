import React from 'react';

const Failure = ({ errorMsg, onRetry }) => {
  return (
    <div data-test-id="error-state" className="text-center py-12">
      {/* Animated Error Icon */}
      <div className="relative w-24 h-24 mx-auto mb-6">
        {/* Outer pulsing ring */}
        <div className="absolute inset-0 bg-red-400 rounded-full opacity-20 animate-ping"></div>
        
        {/* Main icon container */}
        <div className="relative w-24 h-24 bg-gradient-to-br from-red-500 to-rose-600 rounded-full flex items-center justify-center shadow-xl border-4 border-red-100">
          <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-400 rounded-full opacity-60"></div>
        <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-rose-400 rounded-full opacity-60"></div>
      </div>

      {/* Error Title */}
      <h2 className="text-3xl font-black bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent mb-3">
        Payment Failed
      </h2>
      
      {/* Subtitle */}
      <p className="text-gray-600 text-sm mb-4">
        We couldn't process your transaction
      </p>

      {/* Error Message Card */}
      <div className="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200 rounded-2xl p-5 mb-6 max-w-sm mx-auto">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 mt-0.5">
            <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex-1 text-left">
            <p className="text-xs font-semibold text-red-700 uppercase tracking-wide mb-1">
              Error Details
            </p>
            <p data-test-id="error-message" className="text-sm font-medium text-red-800">
              {errorMsg}
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button 
          data-test-id="retry-button" 
          onClick={onRetry} 
          className="w-full max-w-xs mx-auto block bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <span className="flex items-center justify-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Try Again</span>
          </span>
        </button>

        <button className="w-full max-w-xs mx-auto block border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold px-8 py-3 rounded-xl transition-all hover:bg-gray-50">
          <span className="flex items-center justify-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span>Contact Support</span>
          </span>
        </button>
      </div>

      {/* Help Text */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <p className="text-xs text-gray-500 mb-2">Common reasons for payment failure:</p>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• Insufficient balance in account</li>
          <li>• Incorrect card details or expired card</li>
          <li>• Network connectivity issues</li>
          <li>• Bank declined the transaction</li>
        </ul>
      </div>
    </div>
  );
};

export default Failure;