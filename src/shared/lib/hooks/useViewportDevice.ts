import { useEffect, useState } from 'react';
import { throttle } from 'lodash';
import { getCurrentViewportDeviceState } from '@shared/lib/device-checker';
import { ViewportDeviceState } from '@shared/config/type';

export const useViewportDevice = (): ViewportDeviceState => {
  const [viewportDevice, setViewportDevice] = useState(
    getCurrentViewportDeviceState
  );

  useEffect(() => {
    const resizeScreen = throttle(() => {
      setViewportDevice(getCurrentViewportDeviceState());
    }, 200);

    resizeScreen();

    window.addEventListener('resize', resizeScreen);

    return () => {
      window.removeEventListener('resize', resizeScreen);
      resizeScreen.cancel();
    };
  }, []);

  return viewportDevice;
};