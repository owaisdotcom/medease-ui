import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import { StudentRoute, AdminRoute } from './components/ProtectedRoute';

import Home from './pages/Home';
import AboutPage from './pages/AboutPage';
import PackagesPage from './pages/PackagesPage';
import ModulesPage from './pages/ModulesPage';
import ProffPage from './pages/ProffPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

import StudentDashboard from './pages/student/Dashboard';
import StudentProfile from './pages/student/Profile';
import StudentResources from './pages/student/Resources';
import StudentTopic from './pages/student/Topic';
import StudentModuleOspes from './pages/student/ModuleOspes';
import StudentOspeAttempt from './pages/student/OspeAttempt';
import StudentPackages from './pages/student/Packages';
import StudentPayments from './pages/student/Payments';

import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminPayments from './pages/admin/Payments';
import AdminProff from './pages/admin/Proff';
import AdminPackages from './pages/admin/Packages';
import ResourceLayout from './pages/admin/resources/ResourceLayout';
import YearsList from './pages/admin/resources/YearsList';
import YearModules from './pages/admin/resources/YearModules';
import ModuleContent from './pages/admin/resources/ModuleContent';
import SubjectTopics from './pages/admin/resources/SubjectTopics';
import TopicMcqs from './pages/admin/resources/TopicMcqs';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="packages" element={<PackagesPage />} />
            <Route path="modules" element={<ModulesPage />} />
            <Route path="proff" element={<ProffPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />

            <Route path="student" element={<StudentRoute />}>
              <Route index element={<StudentDashboard />} />
              <Route path="profile" element={<StudentProfile />} />
              <Route path="resources" element={<StudentResources />} />
              <Route path="topics/:topicId" element={<StudentTopic />} />
              <Route path="modules/:moduleId/ospes" element={<StudentModuleOspes />} />
              <Route path="ospes/:ospeId" element={<StudentOspeAttempt />} />
              <Route path="packages" element={<StudentPackages />} />
              <Route path="payments" element={<StudentPayments />} />
            </Route>
          </Route>

          <Route path="admin" element={<AdminRoute />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="payments" element={<AdminPayments />} />
            <Route path="resources" element={<ResourceLayout />}>
            <Route index element={<YearsList />} />
            <Route path="years/:yearId" element={<YearModules />} />
            <Route path="years/:yearId/modules/:moduleId" element={<ModuleContent />} />
            <Route path="years/:yearId/modules/:moduleId/subjects/:subjectId" element={<SubjectTopics />} />
            <Route path="years/:yearId/modules/:moduleId/subjects/:subjectId/topics/:topicId" element={<TopicMcqs />} />
          </Route>
            <Route path="proff" element={<AdminProff />} />
            <Route path="packages" element={<AdminPackages />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
