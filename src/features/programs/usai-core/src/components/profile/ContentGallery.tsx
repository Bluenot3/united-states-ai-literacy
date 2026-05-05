import React from 'react';

const ContentGallery: React.FC = () => {
    return (
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10 h-full">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Artifact Gallery
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {/* Placeholder for future content */}
                <div className="aspect-square bg-white/5 rounded-xl border border-dashed border-white/20 flex flex-col items-center justify-center text-gray-500 hover:border-purple-500/50 hover:bg-white/10 transition-all cursor-not-allowed group">
                    <svg className="w-8 h-8 mb-2 opacity-50 group-hover:opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span className="text-xs">No artifacts yet</span>
                </div>
            </div>
            <p className="text-xs text-gray-500 mt-4 text-center">
                Images and text generated in modules will appear here automatically.
            </p>
        </div>
    );
};

export default ContentGallery;
