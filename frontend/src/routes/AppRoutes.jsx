import { Route, Routes } from 'react-router';
import PublicLayout from '../layouts/PublicLayout.jsx';
import HomePage from '../pages/HomePage.jsx';
import ProductsPage from '../pages/ProductsPage.jsx';
import ProductDetailPage from '../pages/ProductDetailPage.jsx';
import NotFoundPage from '../pages/NotFoundPage.jsx';
import LoginPage from '../pages/LoginPage.jsx';
import RegisterPage from '../pages/RegisterPage.jsx';
import DashboardPage from '../pages/DashboardPage.jsx';
import CartPage from '../pages/CartPage.jsx';
import OrdersPage from '../pages/OrdersPage.jsx';
import StoreSalesPage from '../pages/StoreSalesPage.jsx';
import { destinations } from './destinations.js';
import ProtectedRoute from './ProtectedRoute.jsx';
import AccountEntryRoute from './AccountEntryRoute.jsx';

const pages = {
  home: HomePage,
  products: ProductsPage,
  productDetail: ProductDetailPage,
  login: LoginPage,
  register: RegisterPage,
  dashboard: DashboardPage,
  cart: CartPage,
  orders: OrdersPage,
  storeSales: StoreSalesPage,
};

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        {destinations.map((destination) => {
          const Page = pages[destination.page];
          let element = <Page />;
          if (destination.requiresAuth) element = <ProtectedRoute destination={destination}>{element}</ProtectedRoute>;
          else if (destination.accountEntry) element = <AccountEntryRoute>{element}</AccountEntryRoute>;
          return <Route key={destination.path} path={destination.path} element={element} />;
        })}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
