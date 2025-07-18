import { createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { AuthGuard } from '@/components/AuthGuard';
import { Navigate } from '@tanstack/react-router';
import { lazy, Suspense } from 'react';
import { WorkoutDaysPage } from '@/pages/auth/workout/WorkoutDayspage';
import { WorkoutExercisesPage } from '@/pages/auth/workout/WorkoutExercisespage';

// Lazy loading das páginas
const LoginPage = lazy(() => import('@/pages/LoginPage').then(m => ({ default: m.LoginPage })));
const DashboardPage = lazy(() => import('@/pages/auth/dashboard/DashboardPage').then(m => ({ default: m.DashboardPage })));
const WorkoutPlansPage = lazy(() => import('@/pages/auth/workout/WorkoutPlanspage').then(m => ({ default: m.WorkoutPlansPage })));
const ProfilePage = lazy(() => import('@/pages/auth/profile').then(m => ({ default: m.ProfilePage })));

// Componente de loading
const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
  </div>
);

// Wrapper para lazy loading
const LazyWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<LoadingSpinner />}>
    {children}
  </Suspense>
);

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
    </>
  ),
});

const loginRoute = createRoute({
    path: '/login',
    component: () => <LazyWrapper><LoginPage /></LazyWrapper>,
    getParentRoute: () => rootRoute,
});

const protectedRoute = createRoute({
    path: '/app',
    component: AuthGuard,
    getParentRoute: () => rootRoute,
});

const indexRoute = createRoute({
    path: '/',
    component: () => <Navigate to="/app/dashboard" />,
    getParentRoute: () => rootRoute,
});

const dashboardRoute = createRoute({
    path: '/dashboard',
    component: () => <LazyWrapper><DashboardPage /></LazyWrapper>,
    getParentRoute: () => protectedRoute,
});

const workoutPlansRoute = createRoute({
    path: '/workout-plans',
    component: () => <LazyWrapper><WorkoutPlansPage /></LazyWrapper>,
    getParentRoute: () => protectedRoute,
});

const workoutDaysRoute = createRoute({
    path: '/workout-days',
    component: () => <LazyWrapper><WorkoutDaysPage /></LazyWrapper>,
    getParentRoute: () => protectedRoute,
});

const workoutExercisesRoute = createRoute({
    path: '/workout-exercises',
    component: () => <LazyWrapper><WorkoutExercisesPage /></LazyWrapper>,
    getParentRoute: () => protectedRoute,
});

const profileRoute = createRoute({
    path: '/profile',
    component: () => {
        console.log('ProfilePage route accessed');
        return <LazyWrapper><ProfilePage /></LazyWrapper>;
    },
    getParentRoute: () => protectedRoute,
});


const routeTree = rootRoute.addChildren([
    loginRoute,
    indexRoute,
    protectedRoute.addChildren([dashboardRoute, workoutPlansRoute, workoutDaysRoute, workoutExercisesRoute, profileRoute]),
]);

const router = createRouter({ routeTree });

export { router };