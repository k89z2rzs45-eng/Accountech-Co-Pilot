import React from 'react';

export default function OptimizedPageWrapper({ children, pageName, className = "" }) {
  return (
    <div className={`optimized-page-wrapper ${className}`}>
      <style jsx>{`
        .optimized-page-wrapper {
          width: 100% !important;
          min-height: 100vh;
          overflow-x: hidden;
          position: relative;
          padding: 0;
          margin: 0;
        }
        
        /* ENSURE ALL CHILD ELEMENTS USE FULL WIDTH */
        .optimized-page-wrapper > * {
          width: 100% !important;
          max-width: none !important;
        }
        
        /* REMOVE ANY CONTAINER RESTRICTIONS */
        .optimized-page-wrapper .container,
        .optimized-page-wrapper .max-w-7xl,
        .optimized-page-wrapper .max-w-6xl,
        .optimized-page-wrapper .max-w-5xl,
        .optimized-page-wrapper .max-w-4xl {
          max-width: none !important;
          width: 100% !important;
        }
      `}</style>
      
      {children}
    </div>
  );
}