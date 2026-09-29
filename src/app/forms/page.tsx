import { PageHeading } from "@/components/layout/AppShell";
import { ContactForm } from "@/components/forms/ContactForm";

export default function FormsPage() {
  return (
    <>
      <PageHeading title="Forms" description="Form accessibility test case — see TEST-CASES.md (OL-004)." />
      <ContactForm />
    </>
  );
}
