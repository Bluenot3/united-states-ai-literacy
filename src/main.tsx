import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { AdminProvider } from './contexts/AdminContext';
import { BillingProvider } from './contexts/BillingContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { OpsThemeProvider } from './theme/OpsThemeContext';
import { SidebarProvider } from './contexts/SidebarContext';
const SettingsPanel = React.lazy(() => import('./components/SettingsPanel'));
import './index.css';
import './styles/zen-ops.css';

import { FriendlyErrorBoundary } from './components/FriendlyErrorBoundary';

const rootElement = document.getElementById('root')!;

// Reuse the existing root across HMR updates instead of calling createRoot() again —
// calling it twice on the same element mounts two React trees (duplicate UI + removeChild errors).
type RootElement = HTMLElement & { __reactRoot?: ReactDOM.Root };
const rootEl = rootElement as RootElement;
if (!rootEl.__reactRoot) {
    rootEl.__reactRoot = ReactDOM.createRoot(rootEl);
}
const root = rootEl.__reactRoot;

root.render(
    <BrowserRouter>
        <FriendlyErrorBoundary>
            <ThemeProvider>
                <OpsThemeProvider>
                    <AuthProvider>
                        <AdminProvider>
                            <BillingProvider>
                                <SidebarProvider>
                                    <App />
                                    <Suspense fallback={null}>
                                        <SettingsPanel />
                                    </Suspense>
                                </SidebarProvider>
                            </BillingProvider>
                        </AdminProvider>
                    </AuthProvider>
                </OpsThemeProvider>
            </ThemeProvider>
        </FriendlyErrorBoundary>
    </BrowserRouter>
);
