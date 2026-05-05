import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-bg py-8 mt-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-brand-text-light">
        <p>&copy; {new Date().getFullYear()} ZEN AI VANGUARD. All rights reserved.</p>
        <p className="text-sm mt-2">An educational experience designed to explore the frontiers of AI.</p>
      </div>
    </footer>
  );
};

export default Footer;
