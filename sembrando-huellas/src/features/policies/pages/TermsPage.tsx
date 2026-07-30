import { SEO, BreadcrumbSchema } from '@/components/seo'
import { Container, Section, PageTransition } from '@/components/ui'
import PageHero from '@/components/ui/PageHero'
import { siteConfig } from '@/config/site'

export default function TermsPage() {
  return (
    <PageTransition>
      <BreadcrumbSchema items={[{ name: 'Inicio', url: '/' }, { name: 'Términos y Condiciones', url: '/terminos' }]} />
      <SEO title="Términos y Condiciones" description={`Términos y condiciones de uso del sitio web de ${siteConfig.name}.`} />

      <PageHero
        title="Términos y Condiciones"
        subtitle="Última actualización: Enero 2025"
        size="sm"
      />

      <Section>
        <Container>
          <div className="prose prose-lg mx-auto max-w-3xl text-neutral-600">
            <h2 className="text-dark-900">1. Aceptación de los términos</h2>
            <p>Al acceder y utilizar este sitio web, aceptas cumplir con estos términos y condiciones. Si no estás de acuerdo con alguna parte, no debes usar nuestro sitio.</p>

            <h2 className="text-dark-900">2. Uso del sitio</h2>
            <p>El contenido de este sitio es solo para fines informativos y educativos. Nos reservamos el derecho de modificar, suspender o descontinuar cualquier aspecto del sitio en cualquier momento.</p>

            <h2 className="text-dark-900">3. Propiedad intelectual</h2>
            <p>Todos los contenidos, marcas, logotipos, imágenes y materiales presentes en este sitio son propiedad de {siteConfig.name} o tienen licencia para su uso. Queda prohibida su reproducción sin autorización.</p>

            <h2 className="text-dark-900">4. Donaciones</h2>
            <p>Las donaciones realizadas a través de nuestro sitio son voluntarias y no reembolsables. Recibirás un comprobante de tu donación para fines fiscales.</p>

            <h2 className="text-dark-900">5. Voluntariado</h2>
            <p>El registro como voluntario no garantiza la aceptación en nuestros programas. Nos reservamos el derecho de seleccionar participantes según los requisitos de cada programa.</p>

            <h2 className="text-dark-900">6. Limitación de responsabilidad</h2>
            <p>{siteConfig.name} no será responsable por daños directos, indirectos, incidentales o consecuentes que surjan del uso o la imposibilidad de usar este sitio.</p>

            <h2 className="text-dark-900">7. Cambios</h2>
            <p>Podemos actualizar estos términos en cualquier momento. Los cambios entrarán en vigor inmediatamente después de su publicación en el sitio.</p>

            <h2 className="text-dark-900">8. Contacto</h2>
            <p>Para consultas sobre estos términos, contáctanos en <strong>{siteConfig.email}</strong>.</p>

            <p className="mt-8 text-sm text-neutral-400">Este documento es un ejemplo de contenido editable que será reemplazado con los términos y condiciones reales de la organización.</p>
          </div>
        </Container>
      </Section>
    </PageTransition>
  )
}
