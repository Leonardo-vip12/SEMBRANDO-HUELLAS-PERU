import { SEO } from '@/components/seo';
import { Container, Section, SectionTitle, PageTransition } from '@/components/ui';
import MultimediaCenter from '@/components/features/MultimediaCenter';

export default function MultimediaPage() {
  return (
    <PageTransition>
      <SEO title="Centro Multimedia" description="Galería de fotos, videos y contenido multimedia de Sembrando Huellas Perú" />
      <Section>
        <Container>
          <SectionTitle title="Centro Multimedia" subtitle="Explora nuestra galería de fotos, videos y contenido audiovisual" />
          <MultimediaCenter />
        </Container>
      </Section>
    </PageTransition>
  );
}
