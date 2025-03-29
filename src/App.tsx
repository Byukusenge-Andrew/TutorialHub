import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';
import { VerifyEmail } from './pages/VerifyEmail';
import { ResendVerification } from './pages/ResendVerification';
import { Tutorials } from './pages/Tutorials';
import { DSAExercises } from './pages/DSAExercises';
import { Home as HomePage } from './pages/Home';
import { TutorialList } from './pages/TutorialList';
import { TutorialDetail } from './pages/TutorialDetail';
import { Profile } from './pages/Profile';
import { AdminDashboard } from './pages/AdminDashboard';
import { UserDashboard } from './pages/UserDashboard';
import { DSAChallenge } from './pages/DSAChallenge';
import { CreateDSAChallenge } from './pages/admin/CreateDSAChallenge';
import { TypingPage } from './pages/TypingPage';
import { AuthProvider, useAuth } from '@/providers/AuthProvider';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { CreateTutorial } from './pages/admin/CreateTutorial';
import { AdminTutorials } from './pages/admin/AdminTutorials';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminAnalytics } from './pages/admin/AdminAnalytics';
import { About } from './pages/static/About';
import { Community } from './pages/Community';
import { CreatePost } from './pages/CreatePost';
import { PostDetail } from './pages/PostDetail';
import { CommunityPage } from '@/pages/CommunityPage';
import { CreatePostPage } from '@/pages/CreatePostPage';
import { PostDetailPage } from '@/pages/PostDetailPage';
import { RegistrationSuccess } from './pages/RegistrationSuccess';
import { AuthWrapper } from '@/components/AuthWrapper';
import EditUser from './components/EditUser';

function App() {
  
  return (
    <AuthProvider>
      <AuthWrapper>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<About />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/verify-email/:token" element={<VerifyEmail />} />
            <Route path="/resend-verification" element={<ResendVerification />} />
            <Route path="/dashboard" element={
              <ProtectedRoute  allowedRoles={['user']}>
                
                <UserDashboard />
              </ProtectedRoute>
            } />
            <Route path="/community" element={<Community/>}/>

            <Route path="/admin" element={
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
            {/* <Route path="/admin/edit-user" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <EditUser />
              </ProtectedRoute>
            } /> */}
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
            <Route path="dsa/create" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <CreateDSAChallenge />
              </ProtectedRoute>
            } />
            <Route path="dsa/:id" element={<DSAChallenge />} />
            <Route path="dsa" element={<DSAExercises />} />
            <Route path="tutorials" element={<TutorialList />} />
            <Route path="tutorials/:id" element={<TutorialDetail />} />
            <Route path="profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="tutorials/create" element={
                     <ProtectedRoute allowedRoles={['admin']}>
              <CreateTutorial />
              </ProtectedRoute>
              } />
            <Route path="/community" element={
              <ProtectedRoute>
                <CommunityPage />
              </ProtectedRoute>
            } />
            <Route path="/community/post/create" element={
              <ProtectedRoute>
                <CreatePostPage />
              </ProtectedRoute>
            } />
            <Route path="/community/post/:id" element={
              <ProtectedRoute>
                <PostDetailPage />
              </ProtectedRoute>
            } />
            <Route path="/registration-success" element={<RegistrationSuccess />} />
          </Route>
        </Routes>
      </AuthWrapper>
    </AuthProvider>
  );
}

export default App;