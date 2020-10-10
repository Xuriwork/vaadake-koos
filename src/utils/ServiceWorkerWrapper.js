import React, { useEffect, useState } from 'react';
import * as serviceWorker from '../serviceWorker';

const ServiceWorkerWrapper = ({ children }) => {
  const [newVersionAvailable, setNewVersionAvailable] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState(null);

  const onSWUpdate = (registration) => {
    setNewVersionAvailable(true);
    setWaitingWorker(registration.waiting);
  };

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
        serviceWorker.register({ onUpdate: onSWUpdate });
    };
  }, []);

  const handleReloadPage = () => {
    waitingWorker && waitingWorker.postMessage({ type: 'SKIP_WAITING' });
    setNewVersionAvailable(false);
    window.location.reload();
  };

  return (
        <>
            { newVersionAvailable && (
                <div className='new_update-toast'>
                    New update, click to reload 
                    <button onClick={handleReloadPage}>RELOAD</button>
                </div>
            ) }
            {children}
        </>
  );
}

export default ServiceWorkerWrapper;