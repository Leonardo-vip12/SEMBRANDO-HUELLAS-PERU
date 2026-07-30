import { useTranslation } from 'react-i18next'
import { SEO } from '@/components/seo';
import { Container, Section, SectionTitle, PageTransition } from '@/components/ui';
import DigitalLibrary from '@/components/features/DigitalLibrary';

export default function LibraryPage() {
  const { t } = useTranslation()
  return (
    <PageTransition>
      <SEO title={t('nav.library')} description={t('library.subtitle')} />
      <Section>
        <Container>
          <SectionTitle title={t('nav.library')} subtitle={t('library.subtitle')} />
          <DigitalLibrary />
        </Container>
      </Section>
    </PageTransition>
  );
}
