import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { TutorialList } from './pages/TutorialList';
import { TutorialDetail } from './pages/TutorialDetail';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Profile } from './pages/Profile';
import { AdminDashboard } from './pages/AdminDashboard';
import { UserDashboard } from './pages/UserDashboard';
import { DSAExercises } from './pages/DSAExercises';
import { DSAChallenge } from './pages/DSAChallenge';
import { CreateDSAChallenge } from './pages/CreateDSAChallenge';
import { TypingPage } from './pages/TypingPage';
import { AuthProvider } from '@/providers/AuthProvider';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { CreateTutorial } from './pages/admin/CreateTutorial';
import { AdminTutorials } from './pages/admin/AdminTutorials';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminAnalytics } from './pages/admin/AdminAnalytics';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="dashboard" element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            } />
            <Route path="admin" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
             <Route path="/admin/tutorials" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminTutorials />
              </ProtectedRoute>
            } />
             <Route path="/admin/users" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminUsers />
              </ProtectedRoute>
            } />
             <Route path="/admin/analytics" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminAnalytics />
              </ProtectedRoute>
            } />
            <Route path="typing" element={
              <ProtectedRoute>
                <TypingPage />
              </ProtectedRoute>
            } />
            <Route path="dsa" element={<DSAExercises />} />
            <Route path="dsa/:id" element={<DSAChallenge />} />
            <Route path="tutorials" element={<TutorialList />} />
            <Route path="tutorials/:id" element={<TutorialDetail />} />
            <Route path="profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="dsa/create" element={<CreateDSAChallenge />} />
            <Route path="tutorials/create" element={<CreateTutorial />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;