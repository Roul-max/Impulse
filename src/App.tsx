import React, { Suspense } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import { CompareProvider } from './context/CompareContext';
import { Loader } from './components/Loader';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ScrollToTop } from "./components/ScrollToTop";



// Lazy Load Pages
const Home = React.lazy(() => import('./pages/Home').then(module => ({ default: module.Home })));
const ProductList = React.lazy(() => import('./pages/ProductList').then(module => ({ default: module.ProductList })));
const ProductDetail = React.lazy(() => import('./pages/ProductDetail').then(module => ({ default: module.ProductDetail })));
const Cart = React.lazy(() => import('./pages/Cart').then(module => ({ default: module.Cart })));
const Login = React.lazy(() => import('./pages/Login').then(module => ({ default: module.Login })));
const Register = React.lazy(() => import('./pages/Register').then(module => ({ default: module.Register })));
const Checkout = React.lazy(() => import('./pages/Checkout').then(module => ({ default: module.Checkout })));
const Orders = React.lazy(() => import('./pages/Orders').then(module => ({ default: module.Orders })));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard').then(module => ({ default: module.AdminDashboard })));
const Compare = React.lazy(() => import('./pages/Compare').then(module => ({ default: module.Compare })));

const ProtectedRoute = ({ children }: { children?: React.ReactNode }) => {
    const { user, isLoading } = useAuth();
    if (isLoading) return <Loader />;
    if (!user) return <Navigate to="/login" replace />;
    return <>{children}</>;
};

const AdminRoute = ({ children }: { children?: React.ReactNode }) => {
    const { user, isLoading } = useAuth();
    if (isLoading) return <Loader />;
    if (!user || user.role !== 'admin') return <Navigate to="/" replace />;
    return <>{children}</>;
};

const AppRoutes = () => {
    return (
        <Layout>
            <Suspense fallback={<Loader />}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/products" element={<ProductList />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/compare" element={<Compare />} />
                    <Route path="/checkout" element={
                        <ProtectedRoute>
                            <Checkout />
                        </ProtectedRoute>
                    } />
                    <Route path="/orders" element={
                        <ProtectedRoute>
                            <Orders />
                        </ProtectedRoute>
                    } />
                    <Route path="/admin" element={
                        <AdminRoute>
                            <AdminDashboard />
                        </AdminRoute>
                    } />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Suspense>
        </Layout>
    );
};

const App = () => {
    return (
        <ErrorBoundary>
            <HashRouter future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true,
            }}
            >
                <ScrollToTop />
                <ThemeProvider>
                    <ToastProvider>
                        <AuthProvider>
                            <CompareProvider>
                                <CartProvider>
                                    <AppRoutes />
                                </CartProvider>
                            </CompareProvider>
                        </AuthProvider>
                    </ToastProvider>
                </ThemeProvider>
            </HashRouter>
        </ErrorBoundary>
    );
};

export default App;