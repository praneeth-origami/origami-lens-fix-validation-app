import { PageHeading } from "@/components/layout/AppShell";
import { HeavySearchTable } from "@/components/performance/HeavySearchTable";

export default function PerformancePage() {
  return (
    <>
      <PageHeading title="Performance" description="Performance test case — see TEST-CASES.md (OL-006). Type in the search box and watch the input lag." />
      <HeavySearchTable />
    </>
  );
}
