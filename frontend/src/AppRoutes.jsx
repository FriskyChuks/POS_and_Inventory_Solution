import { Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import RequireAuth from "./components/layouts/RequireAuth";

import ItemList from "./components/items/ItemList";
import ItemCreate from "./components/items/ItemCreate";
import BrandCreate from "./components/items/CreateBrand";
import SupplierList from "./components/suppliers/SupplierList";
import SupplierCreate from "./components/suppliers/SupplierCreate";
import ItemUpdate from "./components/items/ItemUpdate";
import SupplierUpdate from "./components/suppliers/SupplierUpdate";
import SalesPage from "./components/sales/SalesPage";
import SalesHistoryPage from "./components/reports/sales/SalesHistoryPage";
import SalesDetailPage from "./components/sales/SalesDetailPage";

import Register from "./components/accounts/Register";
import Login from "./components/accounts/Login";
import SalesDashboard from "./components/dashboards/SalesDashboard";
import BrandList from "./components/items/BrandList";
import BrandUpdate from "./components/items/BrandUpdate";
// import SupplyPage from "./components/suppliers/SupplyPage";
import SupplyCreate from "./components/suppliers/SupplyCreate";
import SupplyList from "./components/suppliers/SupplyList";
import ProfitLossPage from "./components/reports/ProfitLossPage";
import PriceSettingsPage from "./components/management/PriceSettingsPage";

const AppRoutes = ({ baseURL }) => {
  const formatNaira = (amount) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
    }).format(amount);

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/auth/login" element={<Login baseURL={baseURL} />} />
      <Route path="/auth/register" element={<Register baseURL={baseURL} />} />

      {/* Protected routes */}
      <Route
        path="/"
        element={
          <RequireAuth>
            <Layout>
              <SalesDashboard baseURL={baseURL} formatNaira={formatNaira} />
            </Layout>
          </RequireAuth>
        }
      />
      {/* <Route
        path="/"
        element={
          <RequireAuth>
            <Layout>
              <Home />
            </Layout>
          </RequireAuth>
        }
      /> */}
      <Route
        path="/supplier-list"
        element={
          <RequireAuth>
            <Layout>
              <SupplierList baseURL={baseURL} />
            </Layout>
          </RequireAuth>
        }
      />
      <Route
        path="/supplier-create"
        element={
          <RequireAuth>
            <Layout>
              <SupplierCreate baseURL={baseURL} />
            </Layout>
          </RequireAuth>
        }
      />
      <Route
        path="/supplier-update/:id"
        element={
          <RequireAuth>
            <Layout>
              <SupplierUpdate baseURL={baseURL} />
            </Layout>
          </RequireAuth>
        }
      />
      <Route
        path="/item-list"
        element={
          <RequireAuth>
            <Layout>
              <ItemList baseURL={baseURL} formatNaira={formatNaira} />
            </Layout>
          </RequireAuth>
        }
      />
      <Route
        path="/item-create"
        element={
          <RequireAuth>
            <Layout>
              <ItemCreate baseURL={baseURL} />
            </Layout>
          </RequireAuth>
        }
      />
      <Route
        path="/brand-create"
        element={
          <RequireAuth>
            <Layout>
              <BrandCreate baseURL={baseURL} />
            </Layout>
          </RequireAuth>
        }
      />
      <Route
        path="/brand-list"
        element={
          <RequireAuth>
            <Layout>
              <BrandList baseURL={baseURL} />
            </Layout>
          </RequireAuth>
        }
      />
      <Route
        path="/brand-update/:id"
        element={
          <RequireAuth>
            <Layout>
              <BrandUpdate baseURL={baseURL} />
            </Layout>
          </RequireAuth>
        }
      />
      <Route
        path="/item-update/:id"
        element={
          <RequireAuth>
            <Layout>
              <ItemUpdate baseURL={baseURL} />
            </Layout>
          </RequireAuth>
        }
      />
      <Route
        path="/sales"
        element={
          <RequireAuth>
            <Layout>
              <SalesPage baseURL={baseURL} formatNaira={formatNaira} />
            </Layout>
          </RequireAuth>
        }
      />
      <Route
        path="/sales-history"
        element={
          <RequireAuth>
            <Layout>
              <SalesHistoryPage baseURL={baseURL} formatNaira={formatNaira} />
            </Layout>
          </RequireAuth>
        }
      />
      <Route
        path="/sales-detail/:id"
        element={
          <RequireAuth>
            <Layout>
              <SalesDetailPage baseURL={baseURL} formatNaira={formatNaira} />
            </Layout>
          </RequireAuth>
        }
      />
      <Route
        path="/supply-create"
        element={
          <RequireAuth>
            <Layout>
              <SupplyCreate baseURL={baseURL} formatNaira={formatNaira} />
            </Layout>
          </RequireAuth>
        }
      />
      <Route
        path="/supply-list"
        element={
          <RequireAuth>
            <Layout>
              <SupplyList baseURL={baseURL} formatNaira={formatNaira} />
            </Layout>
          </RequireAuth>
        }
      />
      {/* REPORTS */}
      <Route
        path="/reports/profit-loss"
        element={
          <RequireAuth>
            <Layout>
              <ProfitLossPage baseURL={baseURL} formatNaira={formatNaira} />
            </Layout>
          </RequireAuth>
        }
      />
      {/* MANAGEMENT */}
      <Route
        path="/management/price-settings"
        element={
          <RequireAuth>
            <Layout>
              <PriceSettingsPage baseURL={baseURL} formatNaira={formatNaira} />
            </Layout>
          </RequireAuth>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
