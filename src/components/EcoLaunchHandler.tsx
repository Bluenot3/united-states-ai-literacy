import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const EcoLaunchHandler: React.FC = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const programId = searchParams.get('program') || searchParams.get('program_id');

    if (programId === 'pioneer' || programId === 'vanguard') {
        return <Navigate to={`/programs/${programId}/launch`} replace />;
    }

    return <Navigate to="/programs" replace />;
};

export default EcoLaunchHandler;
