import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { DataProvider } from './context/DataContext'
import { ThemeProvider } from './context/ThemeContext'
import { Layout } from './components/Layout'
import { Chatbot } from './components/Chatbot'
import { CourseViewer } from './components/CourseViewer'
import { TeacherManagement } from './components/TeacherManagement'
import { CourseManagement } from './components/CourseManagement'
import { StudentDashboard } from './components/StudentDashboard'
import { AdminDashboard } from './components/AdminDashboard'
import { TeacherDashboard } from './components/TeacherDashboard'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { Profile } from './pages/Profile'
import { Evaluations } from './pages/Evaluations'
import { LandingPage } from './pages/LandingPage'
import { Certifications } from './pages/Certifications'
import { useState } from 'react'
import { Course } from './data/mockData'

// Role-based route protection
const RoleProtectedRoute = ({
    allowedRoles,
    children
}: {
    allowedRoles: Array<'STUDENT' | 'TEACHER' | 'ADMIN'>,
    children: React.ReactNode
}) => {
    const { role } = useAuth();

    if (!allowedRoles.includes(role)) {
        return <Navigate to="/dashboard" replace />;
    }

    return <>{children}</>;
};

const ProtectedRoutes = () => {
    const { user, role } = useAuth();
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (selectedCourse) {
        return (
            <Layout>
                <CourseViewer course={selectedCourse} onBack={() => setSelectedCourse(null)} />
            </Layout>
        );
    }

    return (
        <Layout>
            <Routes>
                {/* Common routes */}
                <Route path="/profile" element={<Profile />} />

                {/* Student-only routes */}
                <Route path="/my-courses" element={
                    <RoleProtectedRoute allowedRoles={['STUDENT']}>
                        <StudentDashboard onSelectCourse={setSelectedCourse} />
                    </RoleProtectedRoute>
                } />
                <Route path="/evaluations" element={
                    <RoleProtectedRoute allowedRoles={['STUDENT']}>
                        <Evaluations />
                    </RoleProtectedRoute>
                } />
                <Route path="/certifications" element={
                    <RoleProtectedRoute allowedRoles={['STUDENT']}>
                        <Certifications />
                    </RoleProtectedRoute>
                } />

                {/* Admin-only routes */}
                <Route path="/teacher-management" element={
                    <RoleProtectedRoute allowedRoles={['ADMIN']}>
                        <TeacherManagement />
                    </RoleProtectedRoute>
                } />

                {/* Teacher-only routes */}
                <Route path="/course-management" element={
                    <RoleProtectedRoute allowedRoles={['TEACHER']}>
                        <CourseManagement />
                    </RoleProtectedRoute>
                } />

                {/* Dashboard - role-specific */}
                <Route path="/dashboard" element={
                    role === 'STUDENT' ? <StudentDashboard onSelectCourse={setSelectedCourse} /> :
                        role === 'ADMIN' ? <AdminDashboard /> :
                            <TeacherDashboard />
                } />

                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </Layout>
    );
};

const AppContent = () => {
    const { user, login } = useAuth();

    return (
        <Routes>
            <Route path="/login" element={
                user ? <Navigate to="/dashboard" replace /> :
                    <Login onLogin={() => login('demo@admin.com')} onSwitch={() => { }} />
            } />
            <Route path="/register" element={
                user ? <Navigate to="/dashboard" replace /> :
                    <Register onRegister={() => login('demo@student.com')} onSwitch={() => { }} />
            } />
            <Route path="/" element={
                !user ? <LandingPage /> : <Navigate to="/dashboard" replace />
            } />
            <Route path="/*" element={<ProtectedRoutes />} />
        </Routes>
    );
};

function App() {
    return (
        <BrowserRouter>
            <ThemeProvider>
                <AuthProvider>
                    <DataProvider>
                        <AppContent />
                        <Chatbot />
                    </DataProvider>
                </AuthProvider>
            </ThemeProvider>
        </BrowserRouter>
    )
}

export default App
