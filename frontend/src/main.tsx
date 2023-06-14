import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
// import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App.tsx';
import './index.css';
import HomePage from './pages/HomePage.tsx';
import ProductPage from './pages/ProductPage.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { StoreProvider } from './Store';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import CartPage from './pages/CartPage.tsx';
import SigninPage from './pages/SigninPage.tsx';
import SignupPage from './pages/SignupPage.tsx';
import ShippingAddressPage from './pages/ShippingAddressPage.tsx';
import PaymentMethodPage from './pages/PaymentMethodPage.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import PlaceOrderPage from './pages/PlaceOrderPage.tsx';
import OrderPage from './pages/OrderPage.tsx';
import OrderHistoryPage from './pages/OrderHistoryPage.tsx';
import ProfilePage from './pages/ProfilePage.tsx';
import SearchPage from './pages/SearchPage.tsx';
import AdminRoute from './components/AdminRoute';
import DashboardPage from './pages/DashboardPage.tsx';
import ProductListPage from './pages/ProductListPage.tsx';
import ProductEditPage from './pages/ProductEditPage.tsx';
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} element={<HomePage />} />
      <Route path="product/:slug" element={<ProductPage />} />
      <Route path="cart" element={<CartPage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="signin" element={<SigninPage />} />

      <Route path="signup" element={<SignupPage />} />
      <Route path="" element={<ProtectedRoute />}>
        <Route path="shipping" element={<ShippingAddressPage />} />
        <Route path="payment" element={<PaymentMethodPage />} />
        <Route path="placeorder" element={<PlaceOrderPage />} />
        <Route path="/order/:id" element={<OrderPage />} />
        <Route path="/orderhistory" element={<OrderHistoryPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>
      {/* Admin User */}
      <Route path="/admin" element={<AdminRoute />}>
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="products" element={<ProductListPage />} />
        <Route path="product/:id" element={<ProductEditPage />} />
      </Route>
    </Route>
  )
);

const queryClient = new QueryClient();
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <StoreProvider>
      <PayPalScriptProvider options={{ 'client-id': 'sb' }} deferLoading={true}>
        <HelmetProvider>
          <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </HelmetProvider>
      </PayPalScriptProvider>
    </StoreProvider>
  </React.StrictMode>
);
