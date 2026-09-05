import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TicketList from "./pages/TicketList";
import CreateTicket from "./pages/CreateTicket";
import TicketDetail from "./pages/TicketDetail";
import UserManagement from "./pages/admin/UserManagement";
import AgentManagement from "./pages/admin/AgentManagement";
import CategoryManagement from "./pages/admin/CategoryManagement";

function DummyDashboard() {
  return <h1 className="text-2xl font-bold">Dashboard (placeholder)</h1>;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DummyDashboard />} />
              <Route path="tickets" element={<TicketList />} />
              <Route path="tickets/new" element={<CreateTicket />} />
              <Route path="tickets/:id" element={<TicketDetail />} />
              <Route path="users" element={<UserManagement />} />
<Route path="agents" element={<AgentManagement />} />
<Route path="categories" element={<CategoryManagement />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;