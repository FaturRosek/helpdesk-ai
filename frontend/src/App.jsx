import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";

// Auth
import Login from "./pages/Login";
import Register from "./pages/Register";

// Shared
import TicketList from "./pages/TicketList";
import CreateTicket from "./pages/CreateTicket";
import TicketDetail from "./pages/TicketDetail";
import KnowledgeBase from "./pages/KnowledgeBase";
import AiChat from "./pages/AiChat";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import AgentManagement from "./pages/admin/AgentManagement";
import CustomerManagement from "./pages/admin/CustomerManagement";
import CategoryManagement from "./pages/admin/CategoryManagement";
import AdminTicketManagement from "./pages/admin/AdminTicketManagement";
import KnowledgeManagement from "./pages/admin/KnowledgeManagement";
import Reports from "./pages/admin/Reports";
import AuditLogs from "./pages/admin/AuditLogs";

// Agent pages
import AgentKnowledge from "./pages/agent/AgentKnowledge";

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
              <Route index element={<AdminDashboard />} />
              <Route path="tickets" element={<TicketList />} />
              <Route path="tickets/new" element={<CreateTicket />} />
              <Route path="tickets/:id" element={<TicketDetail />} />

              <Route path="knowledge" element={<KnowledgeBase />} />
              <Route path="ai-chat" element={<AiChat />} />

              <Route path="agent/knowledge" element={<AgentKnowledge />} />

              <Route path="users" element={<UserManagement />} />
              <Route path="agents" element={<AgentManagement />} />
              <Route path="customers" element={<CustomerManagement />} />
              <Route path="categories" element={<CategoryManagement />} />
              <Route path="admin-tickets" element={<AdminTicketManagement />} />
              <Route path="admin/knowledge" element={<KnowledgeManagement />} />
              <Route path="reports" element={<Reports />} />
              <Route path="audit-logs" element={<AuditLogs />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;