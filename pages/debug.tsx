'use client';

// Debug what's being exported
try {
  const module = require('../context/TeamContext');
  console.log('TeamContext exports:', Object.keys(module));
  console.log('TeamProvider type:', typeof module.TeamProvider);
} catch (error) {
  console.error('Error importing TeamContext:', error);
}

export default function DebugPage() {
  return (
    <div>
      <h1>Debug Page</h1>
      <p>Check browser console for export information.</p>
    </div>
  );
}