import { SEO } from '@/components/seo';
import { Container, Section, SectionTitle, PageTransition } from '@/components/ui';
import InteractiveMap from '@/components/features/InteractiveMap';

export default function MapPage() {
  return (
    <PageTransition>
      <SEO title="Mapa Interactivo" description="Mapa interactivo de proyectos, especies y eventos de Sembrando Huellas Perú en la Amazonía" />
      <Section>
        <Container>
          <SectionTitle title="Mapa Interactivo" subtitle="Explora nuestros proyectos, especies monitoreadas y eventos en la Amazonía peruana" />
          <InteractiveMap />
        </Container>
      </Section>
    </PageTransition>
  );
}
