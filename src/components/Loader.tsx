import React from 'react';

export const Loader = () => {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
        <p className="text-sm font-medium text-gray-500 animate-pulse">Loading LuxeMarket...</p>
      </div>
    </div>
  );
};