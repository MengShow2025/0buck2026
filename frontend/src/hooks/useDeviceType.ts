import { useState, useEffect } from 'react';

export type DeviceType = 'web' | 'h5';

export function useDeviceType() {
  const [deviceType, setDeviceType] = useState<DeviceType>(
    window.innerWidth < 1024 ? 'h5' : 'web'
  );

  useEffect(() => {
    const handleResize = () => {
      const type = window.innerWidth < 1024 ? 'h5' : 'web';
      if (type !== deviceType) {
        setDeviceType(type);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [deviceType]);

  return deviceType;
}
