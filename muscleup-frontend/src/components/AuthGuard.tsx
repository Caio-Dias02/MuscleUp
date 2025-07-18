import { useUser } from "@/hooks/useUser";
import { Navigate, Outlet } from "@tanstack/react-router";
import { useMemo } from "react";

export function AuthGuard() {
    const token = localStorage.getItem('token');
    
    // Se não há token, redireciona para login sem fazer requisição
    if (!token) {
        return <Navigate to="/login" />;
    }

    // Verificar se o token não está expirado (opcional)
    const isTokenValid = useMemo(() => {
        try {
            if (!token) return false;
            // Decodificar JWT para verificar expiração (básico)
            const payload = JSON.parse(atob(token.split('.')[1]));
            const now = Math.floor(Date.now() / 1000);
            return payload.exp > now;
        } catch {
            return false;
        }
    }, [token]);

    if (!isTokenValid) {
        localStorage.removeItem('token');
        return <Navigate to="/login" />;
    }

    const { data: user, isLoading, error } = useUser();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900"></div>
            </div>
        );
    }
    
    if (error) {
        localStorage.removeItem('token');
        return <Navigate to="/login" />;
    }

    if (!user) {
        localStorage.removeItem('token');
        return <Navigate to="/login" />;
    }

    return <Outlet />;
}