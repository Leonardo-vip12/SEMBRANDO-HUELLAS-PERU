import { SEO, BreadcrumbSchema } from '@/components/seo'
import { Container, Section, PageTransition } from '@/components/ui'
import PageHero from '@/components/ui/PageHero'
import { siteConfig } from '@/config/site'

export default function PrivacyPage() {
  return (
    <PageTransition>
      <BreadcrumbSchema items={[{ name: 'Inicio', url: '/' }, { name: 'Políticas de Privacidad', url: '/politicas' }]} />
      <SEO title="Políticas de Privacidad" description={`Políticas de privacidad de ${siteConfig.name}. Conoce cómo protegemos tus datos personales.`} />

      <PageHero
        title="Políticas de Privacidad"
        subtitle="Última actualización: Enero 2025"
        size="sm"
      />

      <Section>
        <Container>
          <div className="prose prose-lg mx-auto max-w-3xl text-neutral-600">
            <h2 className="text-dark-900">1. Introducción</h2>
            <p>En {siteConfig.name}, nos comprometemos a proteger tu privacidad. Esta política describe cómo recopilamos, usamos y protegemos tu información personal cuando visitas nuestro sitio web o utilizas nuestros servicios.</p>

            <h2 className="text-dark-900">2. Información que recopilamos</h2>
            <p>Podemos recopilar la siguiente información:</p>
            <ul>
              <li>Nombre y datos de contacto (correo electrónico, teléfono)</li>
              <li>Información demográfica (ubicación, preferencias)</li>
              <li>Datos de navegación y uso del sitio web</li>
              <li>Información proporcionada voluntariamente a través de formularios</li>
            </ul>

            <h2 className="text-dark-900">3. Uso de la información</h2>
            <p>Utilizamos tu información para:</p>
            <ul>
              <li>Procesar donaciones y registros de voluntariado</li>
              <li>Enviar comunicaciones sobre nuestras actividades y proyectos</li>
              <li>Mejorar nuestro sitio web y servicios</li>
              <li>Cumplir con obligaciones legales y regulatorias</li>
            </ul>

            <h2 className="text-dark-900">4. Protección de datos</h2>
            <p>Implementamos medidas de seguridad técnicas y organizativas para proteger tu información personal contra el acceso no autorizado, la pérdida o la destrucción.</p>

            <h2 className="text-dark-900">5. Tus derechos</h2>
            <p>Tienes derecho a acceder, corregir o eliminar tus datos personales en cualquier momento. Para ejercer estos derechos, contáctanos a través de nuestro correo electrónico.</p>

            <h2 className="text-dark-900">6. Cambios a esta política</h2>
            <p>Podemos actualizar esta política periódicamente. Te notificaremos sobre cambios significativos a través de nuestro sitio web o por correo electrónico.</p>

            <h2 className="text-dark-900">7. Contacto</h2>
            <p>Si tienes preguntas sobre esta política de privacidad, contáctanos en <strong>{siteConfig.email}</strong>.</p>

            <p className="mt-8 text-sm text-neutral-400">Este documento es un ejemplo de contenido editable que será reemplazado con las políticas reales de la organización.</p>
          </div>
        </Container>
      </Section>
    </PageTransition>
  )
}
