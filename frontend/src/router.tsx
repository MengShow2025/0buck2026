
import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from './App';
import LoginView from './components/LoginView';
import RegisterView from './components/RegisterView';
import AdminDashboard from './pages/AdminDashboard';
import BindingView from './components/BindingView';
import SquareView from './components/SquareView';
import LoungeView from './components/LoungeView';
import PrimeView from './components/PrimeView';
import AIButlerView from './components/AIButlerView';
import ProductDetailView from './components/ProductDetailView';
import MerchantDetailView from './components/MerchantDetailView';
import ReferralView from './components/ReferralView';
import ContactsView from './components/ContactsView';
import MessagesView from './components/MessagesView';
import FeedView from './components/FeedView';
import SecurePayView from './components/SecurePayView';
import StashView from './components/StashView';
import MeView from './components/MeView';
import CheckInView from './components/CheckInView';

// v5.7.2: Superpowers Architecture - Data Router v7
export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <PrimeView />,
      },
      {
        path: 'login',
        element: <LoginView />,
      },
      {
        path: 'register',
        element: <RegisterView />,
      },
      {
        path: 'chat',
        element: <AIButlerView />,
      },
      {
        path: 'square',
        element: <SquareView />,
      },
      {
        path: 'circle',
        element: <LoungeView />,
      },
      {
        path: 'product/:id',
        element: <ProductDetailView />,
      },
      {
        path: 'merchant/:id',
        element: <MerchantDetailView />,
      },
      {
        path: 'explore',
        element: <ReferralView />,
      },
      {
        path: 'contacts',
        element: <ContactsView />,
      },
      {
        path: 'messages',
        element: <MessagesView />,
      },
      {
        path: 'activity',
        element: <FeedView />,
      },
      {
        path: 'pay',
        element: <SecurePayView />,
      },
      {
        path: 'cart',
        element: <StashView />,
      },
      {
        path: 'me',
        element: <MeView />,
      },
      {
        path: 'checkin',
        element: <CheckInView />,
      },
      {
        path: 'command',
        element: <AdminDashboard />,
      },
      {
        path: 'control',
        element: <Navigate to="/command" replace />,
      },
      {
        path: 'auth/bind',
        element: <BindingView />,
      }
    ]
  }
]);
