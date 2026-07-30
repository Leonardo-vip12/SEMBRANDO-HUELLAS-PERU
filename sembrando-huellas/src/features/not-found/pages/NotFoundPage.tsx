import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, TreePine, ArrowLeft } from 'lucide-react'
import { SEO } from '@/components/seo'
import { PageTransition } from '@/components/ui'
import Button from '@/components/buttons/Button'

export default function NotFoundPage() {
  return (
    <PageTransition>
      <SEO title="404 — Página no encontrada" description="La página que buscas no existe. Regresa al inicio de Sembrando Huellas Perú." />

      <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-dark-900">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-dark-900 to-dark-950" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary-700/10 via-transparent to-transparent" />

        <div className="relative z-10 mx-auto max-w-2xl px-4 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <TreePine size={80} className="mx-auto mb-6 text-primary-400/50" />
          </motion.div>

          <motion.p
            className="mb-4 text-8xl font-bold text-white md:text-9xl"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            4<span className="text-secondary-400">0</span>4
          </motion.p>

          <motion.h1
            className="mb-4 text-3xl font-bold text-white md:text-5xl"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Página no encontrada
          </motion.h1>

          <motion.p
            className="mb-8 text-lg text-white/80"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Parece que te has perdido en el bosque. La página que buscas no existe o ha sido movida.
          </motion.p>

          <motion.div
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Link to="/">
              <Button variant="primary" size="xl" leftIcon={<Home size={18} />}>
                Volver al inicio
              </Button>
            </Link>
            <Link to="/contacto">
              <Button variant="glass" size="xl" leftIcon={<ArrowLeft size={18} />}>
                Contáctanos
              </Button>
            </Link>
          </motion.div>

          <motion.div
            className="mt-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <div className="flex items-center justify-center gap-2 text-sm text-white/30">
              <TreePine size={14} />
              <span>Sembrando Huellas Perú</span>
              <TreePine size={14} />
            </div>
          </motion.div>
        </div>
      </section>
    </PageTransition>
  )
}
