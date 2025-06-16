import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  ChevronRight,
  Eye,
  Info,
  MousePointerClick,
  Pause,
  Percent,
  Play,
  Settings,
  TrendingUp,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/presentation/components/ui/card";
import { useLayoutContext } from "@/presentation/providers/layout-provider";
import { Tabs, TabsList, TabsTrigger } from "@/presentation/components/ui/tabs";
import { formatNumber } from "@/domain/utils/currency";
import { PerformanceLineChart } from "../components/perfomance-line-chart";
import { Button } from "@/presentation/components/ui/button";
import { Badge } from "@/presentation/components/ui/badge";
import { Link } from "react-router";
import { RECENT_CAMPAIGNS } from "@/domain/data/campaign";
import { allNotifications, NotificationCard } from "../components/notification-pannel";

// import { DashboardSkeleton } from "../components/dashboard-skeleton";

const totalClicks = Math.floor(Math.random() * 10000);
const totalLeads = Math.floor(Math.random() * 10000);

export default function DashboardPage() {
  const totalConverted = Math.floor(Math.random() * totalLeads);
  const convertionRate = Math.round((totalConverted / totalLeads) * 100);

  // const { user } = useAuthContext();
  const { updateBreadcrumb } = useLayoutContext();

  useEffect(() => {
    updateBreadcrumb([
      {
        title: "Tableau de bord",
        isActive: true,
      },
    ]);
  }, [updateBreadcrumb]);

  const performanceData = [
    { date: "01/04", Clics: 40, Leads: 24, Conversions: 5 },
    { date: "02/04", Clics: 30, Leads: 13, Conversions: 3 },
    { date: "03/04", Clics: 20, Leads: 8, Conversions: 2 },
    { date: "04/04", Clics: 27, Leads: 10, Conversions: 1 },
    { date: "05/04", Clics: 18, Leads: 5, Conversions: 0 },
    { date: "06/04", Clics: 23, Leads: 9, Conversions: 2 },
    { date: "07/04", Clics: 34, Leads: 15, Conversions: 4 },
    { date: "08/04", Clics: 45, Leads: 20, Conversions: 6 },
    { date: "09/04", Clics: 65, Leads: 30, Conversions: 8 },
    { date: "10/04", Clics: 60, Leads: 28, Conversions: 7 },
    { date: "11/04", Clics: 55, Leads: 25, Conversions: 6 },
    { date: "12/04", Clics: 70, Leads: 32, Conversions: 9 },
    { date: "13/04", Clics: 75, Leads: 35, Conversions: 10 },
    { date: "14/04", Clics: 62, Leads: 30, Conversions: 8 },
  ];

  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false)
  const [notifications, setNotifications] = useState(allNotifications)

  const handleDismissNotification = (id: number) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))
  }

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
  }
    // Get latest 3 unread notifications for dashboard display
  const dashboardNotifications = notifications.filter((n) => !n.read).slice(0, 3)

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Tableau de bord</h1>
        <p className="text-muted-foreground text-sm">
          Bienvenue sur votre espace affilié Quastrom. Analysez vos performances et gagnez plus.
        </p>
      </div>

      {dashboardNotifications.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-900">Recent Notifications</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsNotificationPanelOpen(true)}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  View More
                  <ChevronRight className="h-3 w-3 ml-1" />
                </Button>
              </div>

              <div className="space-y-2">
                {dashboardNotifications.map((notification) => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                    onDismiss={handleDismissNotification}
                  />
                ))}
              </div>
            </div>
          )}

      <div className="grid w-full gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex items-center justify-between space-y-0 pb-1">
            <CardTitle className="text-sm font-medium text-muted-foreground">Clics</CardTitle>
            <div className="rounded-md bg-info/20 size-8 flex items-center justify-center">
              <MousePointerClick className="size-4 text-info" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">{formatNumber(totalClicks)}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <span className="text-success font-medium flex items-center gap-1">
                <ArrowUpRight className="size-3 text-success" aria-hidden="true" />
                +12.5%
              </span>
              depuis le mois dernier
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between space-y-0 pb-1">
            <CardTitle className="text-sm font-medium text-muted-foreground">Leads</CardTitle>
            <div className="rounded-md bg-primary/20 size-8 flex items-center justify-center">
              <Users className="size-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">{formatNumber(totalLeads)}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <span className="text-success font-medium flex items-center gap-1">
                <ArrowUpRight className="size-3 text-success" aria-hidden="true" />
                +12.5%
              </span>
              depuis le mois dernier
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between space-y-0 pb-1">
            <CardTitle className="text-sm font-medium text-muted-foreground">Conversions</CardTitle>
            <div className="rounded-md bg-success/20 size-8 flex items-center justify-center">
              <TrendingUp className="size-4 text-success" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">{formatNumber(totalConverted)}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <span className="text-success font-medium flex items-center gap-1">
                <ArrowUpRight className="size-3 text-success" aria-hidden="true" />
                +12.5%
              </span>
              depuis le mois dernier
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between space-y-0 pb-1">
            <CardTitle className="text-sm font-medium text-muted-foreground">Taux de conversion</CardTitle>
            <div className="rounded-md bg-accent/20 size-8 flex items-center justify-center">
              <Percent className="size-4 text-accent-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">{formatNumber(convertionRate)}%</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <span className="text-success font-medium flex items-center gap-1">
                <ArrowUpRight className="size-3 text-success" aria-hidden="true" />
                +12.5%
              </span>
              depuis le mois dernier
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="jour">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Performance</h2>

          <TabsList size="sm">
            <TabsTrigger value="jour" className="w-24">
              Jour
            </TabsTrigger>
            <TabsTrigger value="semaine" className="w-24">
              Semaine
            </TabsTrigger>
            <TabsTrigger value="mois" className="w-24">
              Mois
            </TabsTrigger>
          </TabsList>
        </div>

        <Card>
          <CardContent className="pt-6">
            <PerformanceLineChart data={performanceData} categories={["Clics", "Leads", "Conversions"]} />
          </CardContent>
        </Card>
      </Tabs>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Campagnes récentes</CardTitle>
            </div>
            <Button asChild>
              <Link to="/campaigns/create">Créer une campagne</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="divide-y">
              {RECENT_CAMPAIGNS.map((campaign) => (
                <div key={campaign.id} className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{campaign.name}</h3>
                        <Badge variant={campaign.status === "active" ? "default" : "secondary"}>
                          {campaign.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                        <span>{campaign.category}</span>
                        <span>•</span>
                        <span>{campaign.leads} leads</span>
                        <span>•</span>
                        <span>{campaign.conversionRate}</span>% conversion rate
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        ${campaign.spent.toLocaleString()} / ${campaign.budget.toLocaleString()}
                      </p>
                      <div className="w-24 h-2 bg-gray-200 rounded-full mt-1">
                        <div
                          className="h-2 bg-blue-500 rounded-full"
                          style={{ width: `${(campaign.spent / campaign.budget) * 100}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Button variant="ghost">
                        <Eye />
                      </Button>
                      <Button variant="ghost">{campaign.status === "active" ? <Pause /> : <Play />}</Button>
                      <Button variant="ghost">
                        <Settings />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Solde actuel</CardTitle>
          </CardHeader>

          <CardContent className="space-y-8">
            <div className="text-5xl font-bold">8,750 €</div>

            <div className="bg-warning/5 rounded-md border h-14 px-3 shadow-lg flex items-center justify-between gap-6">
              <Info className="mt-0.5 shrink-0 text-warning" size={16} aria-hidden="true" />
              <div className="flex grow items-center justify-between gap-12">
                <p className="text-sm">Votre solde a atteint le seuil minimum défini</p>
                <Button size="sm">Recharger</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
