import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router";
import { PageSkeleton } from "@/presentation/components/loaders/page-skeleton";
import { AuthLayout } from "@/presentation/layouts/auth-layout";
import { NotFound } from "@/presentation/components/not-found";
import { SpaceRouteGuard } from "./guards/space-route-guard";

const LoginPage = lazy(() => import("@/features/auth/presentation/pages/login-page"));
const DashboardPage = lazy(() => import("@/features/dashboard/presentation/pages/dashboard-page"));
const CampaignListPage = lazy(() => import("@/features/campaigns/presentation/pages/campaign-list-page"));
const CreateCampaignPage = lazy(() => import("@/features/campaigns/presentation/pages/create-campaign-page"));
const EditCampaignPage = lazy(() => import("@/features/campaigns/presentation/pages/edit-campaign-page"));
const LeadListPage = lazy(() => import("@/features/leads/presentation/pages/lead-list-page"));
const TransactionListPage = lazy(() => import("@/features/transactions/presentation/pages/transaction-list-page"));
const ProfilePage = lazy(() => import("@/features/profile/presentation/pages/profile-page"));

export const router = createBrowserRouter([
  {
    element: <SpaceRouteGuard />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageSkeleton />}>
            <DashboardPage />
          </Suspense>
        ),
      },
      {
        path: "campaigns",
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<PageSkeleton />}>
                <CampaignListPage />
              </Suspense>
            ),
          },
          {
            path: "create",
            element: (
              <Suspense fallback={<PageSkeleton />}>
                <CreateCampaignPage />
              </Suspense>
            ),
          },
          {
            path: ":id/edit",
            element: (
              <Suspense fallback={<PageSkeleton />}>
                <EditCampaignPage />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: "leads",
        element: (
          <Suspense fallback={<PageSkeleton />}>
            <LeadListPage />
          </Suspense>
        ),
      },
      {
        path: "transactions",
        element: (
          <Suspense fallback={<PageSkeleton />}>
            <TransactionListPage />
          </Suspense>
        ),
      },
      {
        path: "profile",
        element: (
          <Suspense fallback={<PageSkeleton />}>
            <ProfilePage />
          </Suspense>
        ),
      },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: <LoginPage />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound shouldRedirect />,
  },
]);
