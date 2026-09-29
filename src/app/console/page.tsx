import { PageHeading } from "@/components/layout/AppShell";
import { ConsoleErrorDemo } from "@/components/console/ConsoleErrorDemo";

export default function ConsolePage() {
  return (
    <>
      <PageHeading title="Console" description="Console/network test case — see TEST-CASES.md (OL-005). Open DevTools before clicking the buttons below." />
      <ConsoleErrorDemo />
    </>
  );
}
