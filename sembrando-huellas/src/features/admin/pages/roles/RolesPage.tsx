import CardBase from '@/components/cards/CardBase';
import { Shield, Check, X } from 'lucide-react';
import { cn } from '@/lib/cn';

const roles = [
  { name: 'Administrador', description: 'Acceso completo al sistema', users: 2, color: 'text-red-500' },
  { name: 'Editor', description: 'Puede crear y editar contenido', users: 5, color: 'text-blue-500' },
  { name: 'Redactor', description: 'Puede crear contenido pero no publicar', users: 8, color: 'text-green-500' },
  { name: 'Moderador', description: 'Puede revisar y aprobar contenido', users: 3, color: 'text-purple-500' },
  { name: 'Invitado', description: 'Acceso de solo lectura', users: 12, color: 'text-neutral-500' },
];

const permissions = ['Lectura', 'Escritura', 'Edición', 'Publicación', 'Eliminación', 'Configuración'];

const rolePermissions: Record<string, boolean[]> = {
  'Administrador': [true, true, true, true, true, true],
  'Editor': [true, true, true, true, false, false],
  'Redactor': [true, true, true, false, false, false],
  'Moderador': [true, false, true, true, false, false],
  'Invitado': [true, false, false, false, false, false],
};

export default function RolesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Roles y Permisos</h1>
        <p className="mt-1 text-sm text-neutral-500">Administra los roles y permisos del sistema</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {roles.map((role) => (
          <CardBase key={role.name} variant="default" padding="md">
            <div className="flex items-center gap-3">
              <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 dark:bg-neutral-700', role.color)}>
                <Shield size={20} />
              </div>
              <div>
                <p className="font-medium text-neutral-900 dark:text-neutral-100">{role.name}</p>
                <p className="text-xs text-neutral-500">{role.users} usuarios</p>
              </div>
            </div>
            <p className="mt-3 text-sm text-neutral-500">{role.description}</p>
          </CardBase>
        ))}
      </div>

      <CardBase variant="default" padding="lg">
        <h3 className="mb-4 text-sm font-semibold text-neutral-900 dark:text-neutral-100">Matriz de Permisos</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-700">
                <th className="py-2 pr-4 text-left font-medium text-neutral-700 dark:text-neutral-300">Rol</th>
                {permissions.map((p) => (
                  <th key={p} className="px-3 py-2 text-center font-medium text-neutral-700 dark:text-neutral-300">{p}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {roles.map((role) => (
                <tr key={role.name} className="border-b border-neutral-100 dark:border-neutral-800">
                  <td className="py-3 pr-4 font-medium text-neutral-900 dark:text-neutral-100">{role.name}</td>
                  {(rolePermissions[role.name] || []).map((has, i) => (
                    <td key={i} className="px-3 py-3 text-center">
                      {has ? <Check size={16} className="inline text-green-500" /> : <X size={16} className="inline text-neutral-300" />}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardBase>
    </div>
  );
}
