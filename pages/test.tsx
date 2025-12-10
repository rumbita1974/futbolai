'use client';

// Test 1: Import and use
import { TeamProvider } from '../context/TeamContext';

export default function TestPage() {
  return (
    <TeamProvider>
      <div>Test works!</div>
    </TeamProvider>
  );
}