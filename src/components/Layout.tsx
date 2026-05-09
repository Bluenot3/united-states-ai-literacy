import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import BackToTopButton from './BackToTopButton';
import AnimatedBackground from './AnimatedBackground';
import GlobalSidebar from './GlobalSidebar';
import Header from './Header';
import MobileBottomNav from './MobileBottomNav';
import OpsShell from './ops/OpsShell';
import { useOpsThemeSafe } from '../theme/OpsThemeContext';
import { useSidebar } from '../contexts/SidebarContext';
import LuxuryClickEffects from './LuxuryClickEffects';
import { OnboardingChat } from './onboarding/OnboardingChat';

const Layout: React.FC = () => {
    const [showOnboarding, setShowOnboarding] = useState(false);

    useEffect(() => {
        if (!localStorage.getItem('zen_onboarding_answered')) {
            setShowOnboarding(true);
        }
    }, []);

    const { pathname } = useLocation();
    const mainContentRef = React.useRef<HTMLDivElement>(null);
    const opsTheme = useOpsThemeSafe();
    const isOpsMode = opsTheme?.isOpsMode ?? false;
    const { isCollapsed } = useSidebar();

    const isModulePage = pathname.startsWith('/module/');
    // Hub and program-selection pages are full-width — no sidebar until user enters a course
    const isHubPage = pathname === '/command-center' || pathname === '/hub' || pathname === '/' || pathname.startsWith('/programs/');

    React.useLayoutEffect(() => {
        if (window.location.hash) {
            window.history.replaceState(null, '', window.location.pathname);
        }

        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }

        const resetScroll = () => {
            window.scrollTo(0, 0);
            if (mainContentRef.current) {
                mainContentRef.current.scrollTop = 0;
            }
        };

        resetScroll();

        const t1 = setTimeout(resetScroll, 50);
        const t2 = setTimeout(resetScroll, 150);
        const t3 = setTimeout(resetScroll, 500);
        const t4 = setTimeout(resetScroll, 1200);

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(t3);
            clearTimeout(t4);
        };
    }, [pathname]);

    // Dynamic left margin based on sidebar state — no margin on hub/programs pages (no sidebar there)
    // Collapsed = icon rail (64px = w-16), Expanded = icon+label rail (208px = w-52)
    const sidebarMargin = isHubPage ? '' : isCollapsed ? 'lg:ml-16' : 'lg:ml-52';

    const content = (
        <div className={`relative flex min-h-screen w-full max-w-full overflow-x-hidden font-sans text-brand-text ${isOpsMode ? 'bg-[var(--ops-base)]' : 'bg-transparent'}`}>
            {!isOpsMode && <AnimatedBackground />}
            <LuxuryClickEffects />

            {!isHubPage && <GlobalSidebar />}

            <div className={`relative z-10 flex min-h-screen min-w-0 max-w-full flex-1 flex-col overflow-x-hidden transition-all duration-300 ${sidebarMargin}`}>
                {/* Hide the global header on module pages — each module has its own header */}
                {!isModulePage && <Header />}

                {!isModulePage && (
                    <a
                        href="#main-content"
                        className="absolute left-6 top-4 z-40 -translate-y-24 rounded-full border border-zen-gold/30 bg-zen-navy px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-zen-gold opacity-0 transition duration-200 focus:translate-y-0 focus:opacity-100"
                    >
                        Skip to content
                    </a>
                )}

                <main
                    id="main-content"
                    ref={mainContentRef}
                    className={`no-scrollbar min-w-0 max-w-full flex-1 overflow-x-hidden ${isModulePage ? 'p-0' : 'p-4 lg:p-8'}`}
                >
                    <Outlet />
                </main>

                {/* Footer — hidden on module pages (ModuleFooter inside each module handles this) */}
                {!isModulePage && (
                    <footer
                        className={`border-t py-8 text-center text-sm lg:mb-0 ${
                            isOpsMode
                                ? 'border-[var(--ops-border)] bg-[var(--ops-surface-1)]/80 text-[var(--ops-text-muted)] backdrop-blur-sm'
                                : 'border-zen-gold/8 bg-zen-navy/60 text-slate-500 backdrop-blur-sm'
                        }`}
                        style={{ marginBottom: 'env(safe-area-inset-bottom, 0px)', paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 2rem)' }}
                    >
                        <p>&copy; {new Date().getFullYear()} ZEN AI Co. - Vanguard Program. All rights reserved.</p>
                        <p
                            className={`mt-1 font-medium ${
                                isOpsMode
                                    ? 'text-[var(--ops-primary)]'
                                    : 'bg-gradient-to-r from-zen-gold to-brand-cyan bg-clip-text text-transparent'
                            }`}
                        >
                            Powered by ZEN Vanguard AI Literacy Certification
                        </p>
                    </footer>
                )}
            </div>

            {showOnboarding && <OnboardingChat onComplete={() => setShowOnboarding(false)} />}
            <BackToTopButton />
            <MobileBottomNav />
        </div>
    );

    return isOpsMode ? <OpsShell>{content}</OpsShell> : content;
};

export default Layout;
