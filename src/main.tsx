import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

import { MutationCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ToastViewport from './components/ToastViewport.tsx';
import { showBackendErrorToast } from './util/toast.ts';

const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    onError: (error) => {
      showBackendErrorToast(error);
    }
  })
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <ToastViewport />
    </QueryClientProvider>
  </StrictMode>
);
