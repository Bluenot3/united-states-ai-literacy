
import React from 'react';

interface Props {
    children: React.ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class FriendlyErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("Uncaught Global Error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-brand-bg flex items-center justify-center p-8 text-center font-sans">
                    <div className="bg-brand-surface p-8 rounded-xl border border-brand-primary/20 shadow-glow max-w-2xl">
                        <h2 className="text-2xl font-bold text-brand-primary mb-4">Something went wrong.</h2>
                        <div className="text-left bg-black/50 p-4 rounded-lg mb-6 overflow-auto max-h-60">
                            <code className="text-red-400 text-sm font-mono whitespace-pre-wrap">
                                {this.state.error?.toString()}
                            </code>
                        </div>
                        <p className="text-brand-text-light mb-6">
                            We've logged this issue. Please try reloading.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-2 bg-brand-primary hover:bg-brand-primary-hover text-white rounded-full font-bold transition-all"
                        >
                            Reload Application
                        </button>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}
