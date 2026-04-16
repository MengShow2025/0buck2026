import React from 'react';
import { useAppContext } from './components/VCC/AppContext';

export const TestTheme: React.FC = () => {
  const { setTheme } = useAppContext();
  return (
    <button onClick={() => setTheme('dark')} style={{ position: 'fixed', top: 0, left: 0, zIndex: 9999, padding: '10px', background: 'red', color: 'white' }}>
      FORCE DARK
    </button>
  );
};
