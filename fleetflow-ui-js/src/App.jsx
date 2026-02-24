import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

// Layouts
import AuthLayout from "./app/(auth)/layout";
import DashboardLayout from "./app/(dashboard)/layout";

// Pages
import LandingPage from "./app/page";
import LoginPage from "./app/(auth)/login/page";
import RegisterPage from "./app/(auth)/register/page";

import DashboardPage from "./app/(dashboard)/dashboard/page";
import AnalyticsPage from "./app/(dashboard)/analytics/page";
import TripsPage from "./app/(dashboard)/trips/page";
import DriversPage from "./app/(dashboard)/drivers/page";
import VehiclesPage from "./app/(dashboard)/vehicles/page";
import MaintenancePage from "./app/(dashboard)/maintenance/page";
import ExpensesPage from "./app/(dashboard)/expenses/page";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* Dashboard Routes */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/trips" element={<TripsPage />} />
            <Route path="/drivers" element={<DriversPage />} />
            <Route path="/vehicles" element={<VehiclesPage />} />
            <Route path="/maintenance" element={<MaintenancePage />} />
            <Route path="/expenses" element={<ExpensesPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
