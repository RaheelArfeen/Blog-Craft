import { Navigate, useLocation } from 'react-router';
import { useContext } from 'react';
import { AuthContext } from './AuthProvider';
// import Loading from '../Pages/Loading';

export const ProtectedRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    const location = useLocation();

    if (loading) {
        return (
            <div className='absolute min-h-screen w-full z-50'>
                {/* <Loading /> */}loading
            </div>
        )
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} />;
    }

    return children;
};