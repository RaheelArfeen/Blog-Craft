import { Navigate, useLocation } from 'react-router';
import { useContext } from 'react';
import { AuthContext } from './AuthProvider';
import Loader from '../Pages/Loader';

export const ProtectedRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    const location = useLocation();

    if (loading) {
        return(
            // <Loader></Loader>
            <></>
        )
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} />;
    }

    return children;
};