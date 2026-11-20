import { lazy, StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router'
import './index.css'
import { applyPreviewTheme } from '@/app/themes'

applyPreviewTheme()
import { RoleShell } from '@/app/RoleShell'
import { Toaster } from '@/app/toast'
import { SignIn, SignUp } from '@/features/auth/Auth'
import { NelayanHome } from '@/features/nelayan/NelayanHome'
import { SubmitProject } from '@/features/nelayan/SubmitProject'
import { MyProjects, ProjectDetailNelayan } from '@/features/nelayan/MyProjects'
import { Wallet } from '@/features/nelayan/Wallet'
import { NelayanHelp } from '@/features/nelayan/HelpProfile'
import { ProfileData, ProfileHome, ProfileSecurity, ProfileSettings } from '@/features/profile/Profile'
import { NotificationsPage } from '@/features/notifications'
import { AdminHome } from '@/features/admin/AdminHome'
import { ReviewDetail, ReviewList } from '@/features/admin/Review'
import { Ledger } from '@/features/admin/Ledger'
import { FraudRadar } from '@/features/admin/FraudRadar'
import { InvestorHome } from '@/features/investor/InvestorHome'
import { Prospectus } from '@/features/investor/Prospectus'
import { Portfolio } from '@/features/investor/Portfolio'
import { SecurityRadar } from '@/features/investor/SecurityRadar'
import { Community, ThreadDetail } from '@/features/investor/Community'
const ThemeCompare = lazy(() => import('@/pages/ThemeCompare').then((m) => ({ default: m.ThemeCompare })))
const Styleguide = lazy(() => import('@/pages/Styleguide').then((m) => ({ default: m.Styleguide })))

const router = createBrowserRouter([
  { path: '/', element: <SignIn /> },
  { path: '/daftar', element: <SignUp /> },
  {
    path: '/nelayan',
    element: <RoleShell role="nelayan" />,
    children: [
      { index: true, element: <NelayanHome /> },
      { path: 'ajukan', element: <SubmitProject /> },
      { path: 'proyek', element: <MyProjects /> },
      { path: 'proyek/:id', element: <ProjectDetailNelayan /> },
      { path: 'dompet', element: <Wallet /> },
      { path: 'bantuan', element: <NelayanHelp /> },
      { path: 'profil', element: <ProfileHome /> },
      { path: 'profil/data', element: <ProfileData /> },
      { path: 'profil/keamanan', element: <ProfileSecurity /> },
      { path: 'profil/pengaturan', element: <ProfileSettings /> },
      { path: 'notifikasi', element: <NotificationsPage role="nelayan" /> },
    ],
  },
  {
    path: '/investor',
    element: <RoleShell role="investor" />,
    children: [
      { index: true, element: <InvestorHome /> },
      { path: 'proyek/:id', element: <Prospectus /> },
      { path: 'portofolio', element: <Portfolio /> },
      { path: 'komunitas', element: <Community /> },
      { path: 'radar', element: <SecurityRadar /> },
      { path: 'profil', element: <ProfileHome /> },
      { path: 'profil/data', element: <ProfileData /> },
      { path: 'profil/keamanan', element: <ProfileSecurity /> },
      { path: 'profil/pengaturan', element: <ProfileSettings /> },
      { path: 'notifikasi', element: <NotificationsPage role="investor" /> },
      { path: 'komunitas/:id', element: <ThreadDetail /> },
    ],
  },
  {
    path: '/admin',
    element: <RoleShell role="admin" />,
    children: [
      { index: true, element: <AdminHome /> },
      { path: 'tinjau', element: <ReviewList /> },
      { path: 'tinjau/:id', element: <ReviewDetail /> },
      { path: 'ledger', element: <Ledger /> },
      { path: 'radar', element: <FraudRadar /> },
      { path: 'profil', element: <ProfileHome /> },
      { path: 'profil/data', element: <ProfileData /> },
      { path: 'profil/keamanan', element: <ProfileSecurity /> },
      { path: 'profil/pengaturan', element: <ProfileSettings /> },
      { path: 'notifikasi', element: <NotificationsPage role="admin" /> },
    ],
  },
  { path: '/tema', element: <Suspense fallback={null}><ThemeCompare /></Suspense> },
  { path: '/styleguide', element: <Suspense fallback={null}><Styleguide /></Suspense> },
  { path: '*', element: <Navigate to="/" replace /> },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
    <Toaster />
  </StrictMode>,
)
