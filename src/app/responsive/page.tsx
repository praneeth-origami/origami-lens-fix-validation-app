import { PageHeading } from "@/components/layout/AppShell";
import { AnalyticsTable } from "@/components/responsive/AnalyticsTable";

export default function ResponsivePage() {
  return (
    <>
      <PageHeading title="Responsive" description="Mobile overflow test case — see TEST-CASES.md (OL-003). Resize to a mobile viewport to see the page scroll horizontally." />
      <AnalyticsTable />
    </>
  );
}
