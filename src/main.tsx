import { lazy, StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router'
import './index.css'
import { RoleShell } from '@/app/RoleShell'
import { Toaster } from '@/app/toast'
import { Splash } from '@/features/Splash'
import { NelayanHome } from '@/features/nelayan/NelayanHome'
import { SubmitProject } from '@/features/nelayan/SubmitProject'
import { MyProjects, ProjectDetailNelayan } from '@/features/nelayan/MyProjects'
import { Wallet } from '@/features/nelayan/Wallet'
import { NelayanHelp, ProfileCommon } from '@/features/nelayan/HelpProfile'
import { AdminHome } from '@/features/admin/AdminHome'
import { ReviewDetail, ReviewList } from '@/features/admin/Review'
import { Ledger } from '@/features/admin/Ledger'
import { FraudRadar } from '@/features/admin/FraudRadar'
import { InvestorHome } from '@/features/investor/InvestorHome'
import { Prospectus } from '@/features/investor/Prospectus'
import { Portfolio } from '@/features/investor/Portfolio'
import { SecurityRadar } from '@/features/investor/SecurityRadar'
import { Community } from '@/features/investor/Community'
const Styleguide = lazy(() => import('@/pages/Styleguide').then((m) => ({ default: m.Styleguide })))

const router = createBrowserRouter([
  { path: '/', element: <Splash /> },
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
      { path: 'profil', element: <ProfileCommon /> },
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
      { path: 'profil', element: <ProfileCommon /> },
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
      { path: 'profil', element: <ProfileCommon /> },
    ],
  },
  { path: '/styleguide', element: <Suspense fallback={null}><Styleguide /></Suspense> },
  { path: '*', element: <Navigate to="/" replace /> },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
    <Toaster />
  </StrictMode>,
)
