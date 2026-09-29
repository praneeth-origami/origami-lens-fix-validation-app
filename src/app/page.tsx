import { PageHeading } from "@/components/layout/AppShell";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { ThemeSelector } from "@/components/dashboard/ThemeSelector";
import { ProfileCard } from "@/components/dashboard/ProfileCard";
import { RecentActivityTable } from "@/components/dashboard/RecentActivityTable";

export default function DashboardPage() {
  return (
    <>
      <PageHeading title="Dashboard" description="An overview of your Origami Lens workspace." />
      <div className="space-y-6">
        <StatsGrid />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <RecentActivityTable />
          </div>
          <div className="space-y-6">
            <ProfileCard />
            <ThemeSelector />
          </div>
        </div>
      </div>
    </>
  );
}
