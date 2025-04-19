import { ThemeProvider } from '@/components/theme-provider';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import 'non.geist';
import './index.css';
import App from './app';
import { TooltipProvider } from './components/ui/tooltip';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
]);
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <TooltipProvider>
        <RouterProvider router={router} />
      </TooltipProvider>
    </ThemeProvider>
  </StrictMode>
);
