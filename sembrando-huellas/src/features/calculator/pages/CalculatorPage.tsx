import { useTranslation } from 'react-i18next'
import { SEO } from '@/components/seo';
import { Container, Section, SectionTitle, PageTransition } from '@/components/ui';
import EnvironmentalCalculator from '@/components/features/EnvironmentalCalculator';

export default function CalculatorPage() {
  const { t } = useTranslation()
  return (
    <PageTransition>
      <SEO title={t('nav.calculator')} description={t('calculator.subtitle')} />
      <Section>
        <Container>
          <SectionTitle title={t('nav.calculator')} subtitle={t('calculator.subtitle')} />
          <EnvironmentalCalculator />
        </Container>
      </Section>
    </PageTransition>
  );
}
