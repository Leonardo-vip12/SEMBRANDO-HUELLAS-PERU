import { PrismaClient, RoleName } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed...');

  const permissions = await Promise.all([
    prisma.permission.create({ data: { name: 'Crear noticias', key: 'news:create', description: 'Permite crear nuevas noticias' } }),
    prisma.permission.create({ data: { name: 'Editar noticias', key: 'news:update', description: 'Permite editar noticias existentes' } }),
    prisma.permission.create({ data: { name: 'Eliminar noticias', key: 'news:delete', description: 'Permite eliminar noticias' } }),
    prisma.permission.create({ data: { name: 'Publicar noticias', key: 'news:publish', description: 'Permite cambiar estado de noticias' } }),
    prisma.permission.create({ data: { name: 'Crear proyectos', key: 'projects:create' } }),
    prisma.permission.create({ data: { name: 'Editar proyectos', key: 'projects:update' } }),
    prisma.permission.create({ data: { name: 'Eliminar proyectos', key: 'projects:delete' } }),
    prisma.permission.create({ data: { name: 'Gestionar usuarios', key: 'users:manage' } }),
    prisma.permission.create({ data: { name: 'Gestionar roles', key: 'roles:manage' } }),
    prisma.permission.create({ data: { name: 'Ver dashboard', key: 'dashboard:view' } }),
    prisma.permission.create({ data: { name: 'Gestionar configuraciones', key: 'settings:manage' } }),
    prisma.permission.create({ data: { name: 'Subir archivos', key: 'uploads:create' } }),
    prisma.permission.create({ data: { name: 'Ver reportes', key: 'analytics:view' } }),
  ]);

  console.log(permissions.length + ' permisos creados');

  const adminRole = await prisma.role.create({
    data: {
      name: RoleName.ADMINISTRADOR,
      description: 'Acceso total al sistema',
      rolePermissions: { create: permissions.map(p => ({ permissionId: p.id })) },
      isSystem: true,
    },
  });

  const editorRole = await prisma.role.create({
    data: {
      name: RoleName.EDITOR,
      description: 'Puede crear y editar contenido',
      rolePermissions: {
        create: permissions.filter(p => !['users:manage', 'roles:manage', 'settings:manage', 'analytics:view'].includes(p.key)).map(p => ({ permissionId: p.id })),
      },
    },
  });

  await prisma.role.create({
    data: {
      name: RoleName.REDACCTOR,
      description: 'Puede crear contenido borrador',
      rolePermissions: {
        create: permissions.filter(p => p.key.endsWith(':create') && !p.key.startsWith('users') && !p.key.startsWith('roles') && !p.key.startsWith('settings')).map(p => ({ permissionId: p.id })),
      },
    },
  });

  await prisma.role.create({
    data: {
      name: RoleName.INVITADO,
      description: 'Usuario invitado con acceso limitado',
      rolePermissions: { create: permissions.filter(p => p.key === 'dashboard:view').map(p => ({ permissionId: p.id })) },
    },
  });

  console.log('Roles creados');

  const hashedPassword = await bcrypt.hash('admin123', 10);
  const adminUser = await prisma.user.create({
    data: {
      name: 'Administrador',
      email: 'admin@sembrandohuellas.org',
      passwordHash: hashedPassword,
      roleId: adminRole.id,
      isActive: true,
    },
  });

  console.log('Usuario admin creado: ' + adminUser.email);

  const categories = await Promise.all([
    prisma.category.create({ data: { name: 'Reforestación', slug: 'reforestacion', description: 'Noticias y proyectos de reforestación', color: '#16a34a', type: 'news' } }),
    prisma.category.create({ data: { name: 'Conservación', slug: 'conservacion', description: 'Iniciativas de conservación ambiental', color: '#2563eb', type: 'news' } }),
    prisma.category.create({ data: { name: 'Educación', slug: 'educacion', description: 'Programas educativos ambientales', color: '#d97706', type: 'news' } }),
    prisma.category.create({ data: { name: 'Comunidad', slug: 'comunidad', description: 'Eventos y actividades comunitarias', color: '#dc2626', type: 'events' } }),
    prisma.category.create({ data: { name: 'Fauna', slug: 'fauna', description: 'Especies y conservación de fauna', color: '#7c3aed', type: 'species' } }),
  ]);

  console.log(categories.length + ' categorías creadas');

  await prisma.organization.create({
    data: {
      name: 'Sembrando Huellas Perú',
      description: 'Organización dedicada a la reforestación y conservación ambiental en el Perú',
      mission: 'Recuperar ecosistemas degradados mediante la reforestación con especies nativas...',
      vision: 'Ser líderes en la recuperación de ecosistemas en Perú para 2030',
      email: 'contacto@sembrandohuellas.org',
      phone: '+51 999 888 777',
      address: 'Av. de la Naturaleza 123, Lima, Perú',
      website: 'https://sembrandohuellas.org',
      logo: '/images/logo.png',
      socialMedia: { facebook: 'https://facebook.com/sembrandohuellas', instagram: 'https://instagram.com/sembrandohuellas', twitter: 'https://twitter.com/sembrandohuellas', youtube: 'https://youtube.com/@sembrandohuellas' },
    },
  });

  console.log('Organización creada');

  await prisma.news.create({
    data: {
      title: 'Iniciamos la temporada de reforestación 2025',
      slug: 'iniciamos-temporada-reforestacion-2025',
      excerpt: 'Este año plantaremos más de 100,000 árboles nativos en la región Amazonas.',
      content: 'Contenido completo de la noticia...',
      status: 'PUBLISHED',
      featured: true,
      author: 'Admin',
      categoryId: categories[0].id,
      userId: adminUser.id,
    },
  });

  console.log('Contenido de ejemplo creado');

  const defaultSettings = [
    { key: 'site_name', value: 'Sembrando Huellas Perú', type: 'string', group: 'general' },
    { key: 'site_description', value: 'Plataforma de reforestación y conservación ambiental', type: 'string', group: 'general' },
    { key: 'contact_email', value: 'contacto@sembrandohuellas.org', type: 'string', group: 'contact' },
    { key: 'donation_goal', value: '500000', type: 'number', group: 'donations' },
    { key: 'currency', value: 'PEN', type: 'string', group: 'donations' },
    { key: 'maintenance_mode', value: 'false', type: 'boolean', group: 'system' },
    { key: 'items_per_page', value: '12', type: 'number', group: 'system' },
  ];

  for (const s of defaultSettings) {
    await prisma.setting.create({ data: s });
  }

  console.log(defaultSettings.length + ' configuraciones creadas');

  const impactMetrics = [
    { label: 'Árboles Plantados', value: '250000', icon: 'tree', year: 2025 },
    { label: 'Hectáreas Recuperadas', value: '500', icon: 'globe', year: 2025 },
    { label: 'Voluntarios Activos', value: '1200', icon: 'users', year: 2025 },
    { label: 'Comunidades Alcanzadas', value: '45', icon: 'home', year: 2025 },
    { label: 'Especies Protegidas', value: '80', icon: 'heart', year: 2025 },
  ];

  for (const m of impactMetrics) {
    await prisma.impactMetric.create({ data: m });
  }

  console.log(impactMetrics.length + ' métricas de impacto creadas');
  console.log('\nSeed completado exitosamente!');
  console.log('   Admin: admin@sembrandohuellas.org / admin123');
}

main()
  .catch(e => {
    console.error('Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
