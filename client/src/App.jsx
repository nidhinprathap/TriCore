import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { SiteSettingsProvider } from './context/SiteSettingsContext.jsx';
import ThemeProvider from './context/ThemeProvider.jsx';
import PublicLayout from './components/layout/PublicLayout.jsx';
import ProtectedRoute from './components/layout/ProtectedRoute.jsx';
import Skeleton from './components/ui/Skeleton.jsx';
import ErrorBoundary from './components/ui/ErrorBoundary.jsx';

// Lazy-loaded public pages
const HomePage = lazy(() => import('./pages/public/HomePage.jsx'));
const AboutPage = lazy(() => import('./pages/public/AboutPage.jsx'));
const CorporateEventsPage = lazy(() => import('./pages/public/CorporateEventsPage.jsx'));
const ContactPage = lazy(() => import('./pages/public/ContactPage.jsx'));
const EventsPage = lazy(() => import('./pages/public/EventsPage.jsx'));
const EventDetailPage = lazy(() => import('./pages/public/EventDetailPage.jsx'));
const AuthPage = lazy(() => import('./pages/public/AuthPage.jsx'));
const RegisterPage = lazy(() => import('./pages/public/RegisterPage.jsx'));
const DashboardPage = lazy(() => import('./pages/public/DashboardPage.jsx'));
const NotFoundPage = lazy(() => import('./pages/public/NotFoundPage.jsx'));

// Lazy-loaded admin pages (entire admin bundle split from public)
const AdminLayout = lazy(() => import('./components/layout/AdminLayout.jsx'));
const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage.jsx'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard.jsx'));
const PagesListPage = lazy(() => import('./pages/admin/PagesListPage.jsx'));
const PageEditorPage = lazy(() => import('./pages/admin/PageEditorPage.jsx'));
const EventsManagerPage = lazy(() => import('./pages/admin/EventsManagerPage.jsx'));
const EventEditorPage = lazy(() => import('./pages/admin/EventEditorPage.jsx'));
const RegistrationsManagerPage = lazy(() => import('./pages/admin/RegistrationsManagerPage.jsx'));
const TestimonialsManagerPage = lazy(() => import('./pages/admin/TestimonialsManagerPage.jsx'));
const MediaLibraryPage = lazy(() => import('./pages/admin/MediaLibraryPage.jsx'));
const SiteSettingsPage = lazy(() => import('./pages/admin/SiteSettingsPage.jsx'));
const CalendarPage = lazy(() => import('./pages/admin/CalendarPage.jsx'));
const UsersPage = lazy(() => import('./pages/admin/UsersPage.jsx'));
const NotificationSettingsPage = lazy(() => import('./pages/admin/NotificationSettingsPage.jsx'));
const SportItemsManagerPage = lazy(() => import('./pages/admin/SportItemsManagerPage.jsx'));
const RegistrationDetailPage = lazy(() => import('./pages/admin/RegistrationDetailPage.jsx'));
const PaymentsPage = lazy(() => import('./pages/admin/PaymentsPage.jsx'));

const PageLoader = () => (
  <div className="min-h-screen bg-tc-bg flex items-center justify-center">
    <Skeleton className="w-64 h-8" />
  </div>
);

function App() {
  return (
    <ErrorBoundary>
    <BrowserRouter>
      <AuthProvider>
        <SiteSettingsProvider>
          <ThemeProvider>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Public routes */}
                <Route element={<PublicLayout />}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/corporate" element={<CorporateEventsPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/events" element={<EventsPage />} />
                  <Route path="/events/:slug" element={<EventDetailPage />} />
                  <Route path="/login" element={<AuthPage />} />
                  <Route path="/register" element={<ProtectedRoute><RegisterPage /></ProtectedRoute>} />
                  <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                  <Route path="*" element={<NotFoundPage />} />
                </Route>

                {/* Admin routes */}
                <Route path="/admin/login" element={<AdminLoginPage />} />
                <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminLayout /></ProtectedRoute>}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="pages" element={<PagesListPage />} />
                  <Route path="pages/:slug" element={<PageEditorPage />} />
                  <Route path="events" element={<EventsManagerPage />} />
                  <Route path="events/:id" element={<EventEditorPage />} />
                  <Route path="registrations" element={<RegistrationsManagerPage />} />
                  <Route path="testimonials" element={<TestimonialsManagerPage />} />
                  <Route path="media" element={<MediaLibraryPage />} />
                  <Route path="settings" element={<SiteSettingsPage />} />
                  <Route path="calendar" element={<CalendarPage />} />
                  <Route path="users" element={<UsersPage />} />
                  <Route path="notifications" element={<NotificationSettingsPage />} />
                  <Route path="payments" element={<PaymentsPage />} />
                  <Route path="events/:eventId/items" element={<SportItemsManagerPage />} />
                  <Route path="registrations/:id" element={<RegistrationDetailPage />} />
                </Route>
              </Routes>
            </Suspense>
          </ThemeProvider>
        </SiteSettingsProvider>
      </AuthProvider>
    </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
