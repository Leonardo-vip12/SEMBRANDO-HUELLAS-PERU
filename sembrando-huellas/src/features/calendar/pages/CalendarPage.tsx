import { SEO } from '@/components/seo';
import { Container, Section, SectionTitle, PageTransition } from '@/components/ui';
import EnvironmentalCalendar from '@/components/features/EnvironmentalCalendar';

export default function CalendarPage() {
  return (
    <PageTransition>
      <SEO title="Calendario Ambiental" description="Calendario de eventos, jornadas y actividades ambientales de Sembrando Huellas Perú" />
      <Section>
        <Container>
          <SectionTitle title="Calendario Ambiental" subtitle="Mantente al día con nuestras jornadas, talleres y eventos" />
          <EnvironmentalCalendar />
        </Container>
      </Section>
    </PageTransition>
  );
}
