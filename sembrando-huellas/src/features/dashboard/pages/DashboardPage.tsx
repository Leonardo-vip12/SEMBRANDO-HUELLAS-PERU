import { SEO } from '@/components/seo';
import { Container, Section, SectionTitle, PageTransition } from '@/components/ui';

export default function DashboardPage() {
  return (
    <PageTransition>
      <SEO title="Dashboard" description="Admin dashboard" />
      <Section>
        <Container>
          <SectionTitle title="Dashboard" subtitle="Coming soon" />
        </Container>
      </Section>
    </PageTransition>
  );
}
