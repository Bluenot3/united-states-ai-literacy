import React, { Suspense, useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useAdmin } from './contexts/AdminContext';
import { useAuth } from './hooks/useAuth';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';

const LoginPage = React.lazy(() => import('./modules/module1/components/auth/LoginPage'));
const CommandCenterPage = React.lazy(() => import('./pages/CommandCenterPage'));
const CredentialForgePage = React.lazy(() => import('./pages/CredentialForgePage'));
const ResetPasswordPage = React.lazy(() => import('./pages/ResetPasswordPage'));
const Module1Page = React.lazy(() => import('./pages/Module1Page'));
const Module2Page = React.lazy(() => import('./pages/Module2Page'));
const Module3Page = React.lazy(() => import('./pages/Module3Page'));
const Module4Page = React.lazy(() => import('./pages/Module4Page'));
const CertificatePage = React.lazy(() => import('./pages/CertificatePage'));
const StarterGuidePage = React.lazy(() => import('./pages/StarterGuidePage'));
const DocumentationPage = React.lazy(() => import('./pages/DocumentationPage'));
const AdminLoginPage = React.lazy(() => import('./pages/AdminLoginPage'));
const AdminLayout = React.lazy(() => import('./components/AdminLayout'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));
const PioneerProfilePage = React.lazy(() => import('./pages/PioneerProfilePage'));
const AdminStudents = React.lazy(() => import('./pages/AdminStudents'));
const AdminMessages = React.lazy(() => import('./pages/AdminMessages'));
const AdminAnalytics = React.lazy(() => import('./pages/AdminAnalytics'));
const AdminSettings = React.lazy(() => import('./pages/AdminSettings'));
const AdminActivityLog = React.lazy(() => import('./pages/AdminActivityLog'));
const ProgramHubPage = React.lazy(() => import('./zen-programs/pages/ProgramHubPage'));
const ProgramDashboardPage = React.lazy(() => import('./zen-programs/pages/ProgramDashboardPage'));
const PaywallPage = React.lazy(() => import('./pages/PaywallPage'));
const BillingSuccessPage = React.lazy(() => import('./pages/BillingSuccessPage'));
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage'));

type RouteDocumentMeta = {
    title: string;
    description: string;
    robots?: string;
    themeColor?: string;
};

const defaultDocumentMeta: RouteDocumentMeta = {
    title: 'ZEN Vanguard | Advanced AI Literacy Platform',
    description: 'Professional AI literacy, systems thinking, and verified program progress inside the ZEN Vanguard platform.',
    robots: 'index,follow',
    themeColor: '#060B18',
};

const documentMetaMatchers: Array<{
    match: (pathname: string) => boolean;
    meta: RouteDocumentMeta;
}> = [
    {
        match: (pathname) => pathname === '/login',
        meta: {
            title: 'Login | ZEN Vanguard',
            description: 'Access the ZEN Vanguard workspace, your modules, certificates, and AI literacy dashboard.',
            robots: 'noindex,nofollow',
        },
    },
    {
        match: (pathname) => pathname === '/reset-password',
        meta: {
            title: 'Reset Password | ZEN Vanguard',
            description: 'Recover access to your ZEN Vanguard account and continue your learning path.',
            robots: 'noindex,nofollow',
        },
    },
    {
        match: (pathname) => pathname === '/paywall',
        meta: {
            title: 'Membership Access | ZEN Vanguard',
            description: 'Unlock the ZEN Vanguard curriculum, certifications, and advanced AI literacy program features.',
            robots: 'noindex,nofollow',
        },
    },
    {
        match: (pathname) => pathname === '/billing/success',
        meta: {
            title: 'Billing Confirmed | ZEN Vanguard',
            description: 'Your subscription is active. Return to ZEN Vanguard to continue the program.',
            robots: 'noindex,nofollow',
        },
    },
    {
        match: (pathname) => pathname.startsWith('/admin'),
        meta: {
            title: 'Admin Console | ZEN Vanguard',
            description: 'ZEN Vanguard administration, learner oversight, analytics, and operational settings.',
            robots: 'noindex,nofollow',
            themeColor: '#081021',
        },
    },
    {
        match: (pathname) => pathname === '/hub',
        meta: {
            title: 'Program Hub | ZEN Vanguard',
            description: 'Browse ZEN Vanguard programs, launch the curriculum, and navigate your command deck.',
            themeColor: '#081021',
        },
    },
    {
        match: (pathname) => pathname === '/command-center',
        meta: {
            title: 'ZEN Ecosystem Command Center',
            description: 'Enter the central ZEN operating layer connecting Arsenal, AI literacy programs, automation systems, AI social tools, business solutions, and verified credentials.',
            themeColor: '#03050d',
        },
    },
    {
        match: (pathname) => pathname === '/credential-forge',
        meta: {
            title: 'Credential Forge | ZEN Vanguard',
            description: 'Experimental holographic credential card designer with mock achievement stamps and prototype metadata output.',
            robots: 'noindex,nofollow',
            themeColor: '#02040a',
        },
    },
    {
        match: (pathname) => pathname === '/programs/hermes',
        meta: {
            title: 'Hermes Agent Ops | ZEN Vanguard',
            description: 'Deploy and master the free, open-source Hermes AI Agent — self-evolving, multi-platform, self-hosted. Full hands-on curriculum.',
            themeColor: '#081021',
        },
    },
    {
        match: (pathname) => pathname.startsWith('/programs/'),
        meta: {
            title: 'Program Dashboard | ZEN Vanguard',
            description: 'Track readiness, curriculum progress, and active program execution inside ZEN Vanguard.',
            themeColor: '#081021',
        },
    },
    {
        match: (pathname) => pathname === '/dashboard',
        meta: {
            title: 'Dashboard | ZEN Vanguard',
            description: 'Review module progress, certificates, XP, and execution milestones in your ZEN Vanguard dashboard.',
            themeColor: '#081021',
        },
    },
    {
        match: (pathname) => pathname === '/guide',
        meta: {
            title: 'Starter Guide | ZEN Vanguard',
            description: 'Use the ZEN Vanguard guide to move from orientation into structured execution.',
            themeColor: '#081021',
        },
    },
    {
        match: (pathname) => pathname === '/docs',
        meta: {
            title: 'Documentation | ZEN Vanguard',
            description: 'Search deployment guidance, concepts, and operating playbooks from the ZEN Vanguard docs library.',
            themeColor: '#081021',
        },
    },
    {
        match: (pathname) => pathname === '/profile',
        meta: {
            title: 'Pioneer Profile | ZEN Vanguard',
            description: 'Review your learner identity, program proof, and personalized Vanguard trajectory.',
            themeColor: '#081021',
        },
    },
    {
        match: (pathname) => /^\/module\/[1-4](\/.*)?$/.test(pathname),
        meta: {
            title: 'Curriculum Module | ZEN Vanguard',
            description: 'Work through a ZEN Vanguard module with guided sections, labs, and applied AI literacy exercises.',
            themeColor: '#050A18',
        },
    },
    {
        match: (pathname) => pathname.startsWith('/certificate/'),
        meta: {
            title: 'Certificate | ZEN Vanguard',
            description: 'View and verify a ZEN Vanguard-issued learning certificate.',
            robots: 'noindex,follow',
            themeColor: '#081021',
        },
    },
];

function resolveDocumentMeta(pathname: string): RouteDocumentMeta {
    return documentMetaMatchers.find((entry) => entry.match(pathname))?.meta ?? defaultDocumentMeta;
}

const AppDocumentController: React.FC = () => {
    const location = useLocation();

    useEffect(() => {
        const { title, description, robots, themeColor } = resolveDocumentMeta(location.pathname);
        document.title = title;
        document.documentElement.lang = 'en';
        document.body.dataset.route = location.pathname;

        const ensureMetaTag = (selector: string, attributeName: string, attributeValue: string) => {
            let element = document.head.querySelector<HTMLMetaElement>(selector);

            if (!element) {
                element = document.createElement('meta');
                element.setAttribute(attributeName, attributeValue);
                document.head.appendChild(element);
            }

            return element;
        };

        const ensureLinkTag = (selector: string, rel: string) => {
            let element = document.head.querySelector<HTMLLinkElement>(selector);

            if (!element) {
                element = document.createElement('link');
                element.setAttribute('rel', rel);
                document.head.appendChild(element);
            }

            return element;
        };

        const canonicalUrl = `${window.location.origin}${location.pathname}${location.search}`;

        ensureMetaTag('meta[name="description"]', 'name', 'description').setAttribute('content', description);
        ensureMetaTag('meta[name="robots"]', 'name', 'robots').setAttribute('content', robots ?? defaultDocumentMeta.robots ?? 'index,follow');
        ensureMetaTag('meta[name="theme-color"]', 'name', 'theme-color').setAttribute('content', themeColor ?? defaultDocumentMeta.themeColor ?? '#060B18');
        ensureMetaTag('meta[property="og:title"]', 'property', 'og:title').setAttribute('content', title);
        ensureMetaTag('meta[property="og:description"]', 'property', 'og:description').setAttribute('content', description);
        ensureMetaTag('meta[property="og:url"]', 'property', 'og:url').setAttribute('content', canonicalUrl);
        ensureMetaTag('meta[property="og:type"]', 'property', 'og:type').setAttribute('content', 'website');
        ensureMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title').setAttribute('content', title);
        ensureMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description').setAttribute('content', description);
        ensureMetaTag('meta[name="twitter:url"]', 'name', 'twitter:url').setAttribute('content', canonicalUrl);
        ensureLinkTag('link[rel="canonical"]', 'canonical').setAttribute('href', canonicalUrl);

        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }, [location.pathname, location.search]);

    return null;
};

const PageLoader: React.FC = () => (
    <div className="min-h-screen flex items-center justify-center bg-zen-navy">
        <div className="flex flex-col items-center gap-5 text-center">
            <div className="relative">
                <div className="h-14 w-14 rounded-full border-[3px] border-zen-gold/15 border-t-zen-gold animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-black text-zen-gold">Z</span>
                </div>
            </div>
            <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-zen-gold">ZEN Vanguard</p>
                <p className="mt-2 text-sm text-slate-500">Loading your workspace...</p>
            </div>
        </div>
    </div>
);

const AdminLoader: React.FC = () => (
    <div className="min-h-screen bg-zen-navy flex items-center justify-center">
        <div className="flex flex-col items-center gap-5">
            <div className="relative">
                <div className="w-14 h-14 border-[3px] border-zen-gold/15 border-t-zen-gold rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-black text-zen-gold">Z</span>
                </div>
            </div>
            <p className="text-slate-500 font-medium text-sm">Loading admin panel...</p>
        </div>
    </div>
);

const AdminProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAdminAuthenticated } = useAdmin();

    if (!isAdminAuthenticated) {
        return <Navigate to="/admin/login" replace />;
    }

    return <>{children}</>;
};

// Redirects unauthenticated users to /login; shows loader while session is resolving
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <PageLoader />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};

const App: React.FC = () => {
    return (
        <>
            <AppDocumentController />

            <Routes>
                <Route
                    path="/login"
                    element={
                        <Suspense fallback={<PageLoader />}>
                            <LoginPage />
                        </Suspense>
                    }
                />
                <Route
                    path="/reset-password"
                    element={
                        <Suspense fallback={<PageLoader />}>
                            <ResetPasswordPage />
                        </Suspense>
                    }
                />
                <Route
                    path="/paywall"
                    element={
                        <Suspense fallback={<PageLoader />}>
                            <PaywallPage />
                        </Suspense>
                    }
                />
                <Route
                    path="/billing/success"
                    element={
                        <Suspense fallback={<PageLoader />}>
                            <BillingSuccessPage />
                        </Suspense>
                    }
                />

                <Route
                    path="/admin/login"
                    element={
                        <Suspense fallback={<AdminLoader />}>
                            <AdminLoginPage />
                        </Suspense>
                    }
                />

                <Route
                    path="/admin"
                    element={
                        <Suspense fallback={<AdminLoader />}>
                            <AdminProtectedRoute>
                                <AdminLayout />
                            </AdminProtectedRoute>
                        </Suspense>
                    }
                >
                    <Route index element={<AdminDashboard />} />
                    <Route path="students" element={<AdminStudents />} />
                    <Route path="activity" element={<AdminActivityLog />} />
                    <Route path="messages" element={<AdminMessages />} />
                    <Route path="analytics" element={<AdminAnalytics />} />
                    <Route path="settings" element={<AdminSettings />} />
                </Route>

                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <Layout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<Navigate to="/command-center" replace />} />
                    <Route path="command-center" element={<Suspense fallback={<PageLoader />}><CommandCenterPage /></Suspense>} />
                    <Route path="credential-forge" element={<Suspense fallback={<PageLoader />}><CredentialForgePage /></Suspense>} />
                    <Route path="hub" element={<Suspense fallback={<PageLoader />}><ProgramHubPage /></Suspense>} />
                    <Route path="programs/:programId" element={<Suspense fallback={<PageLoader />}><ProgramDashboardPage /></Suspense>} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route
                        path="guide"
                        element={
                            <Suspense fallback={<PageLoader />}>
                                <StarterGuidePage />
                            </Suspense>
                        }
                    />
                    <Route
                        path="docs"
                        element={
                            <Suspense fallback={<PageLoader />}>
                                <DocumentationPage />
                            </Suspense>
                        }
                    />
                    <Route path="profile" element={<PioneerProfilePage />} />
                    <Route path="module/1/*" element={<Suspense fallback={<PageLoader />}><Module1Page /></Suspense>} />
                    <Route path="module/2/*" element={<Suspense fallback={<PageLoader />}><Module2Page /></Suspense>} />
                    <Route path="module/3/*" element={<Suspense fallback={<PageLoader />}><Module3Page /></Suspense>} />
                    <Route path="module/4/*" element={<Suspense fallback={<PageLoader />}><Module4Page /></Suspense>} />
                    <Route path="certificate/:certId" element={<Suspense fallback={<PageLoader />}><CertificatePage /></Suspense>} />
                </Route>

                <Route
                    path="*"
                    element={(
                        <Suspense fallback={<PageLoader />}>
                            <NotFoundPage />
                        </Suspense>
                    )}
                />
            </Routes>
        </>
    );
};

export default App;
