import { z } from 'zod'

export const emailSchema = z.string().email('Correo electrónico inválido')

export const phoneSchema = z.string().regex(
  /^(\+?\d{1,3}[-.\s]?)?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/,
  'Número de teléfono inválido'
)

export const urlSchema = z.string().url('URL inválida')

export const nameSchema = z.string()
  .min(2, 'El nombre debe tener al menos 2 caracteres')
  .max(100, 'El nombre no puede exceder 100 caracteres')

export const passwordSchema = z.string()
  .min(8, 'La contraseña debe tener al menos 8 caracteres')
  .regex(/[a-z]/, 'Debe contener al menos una letra minúscula')
  .regex(/[A-Z]/, 'Debe contener al menos una letra mayúscula')
  .regex(/[0-9]/, 'Debe contener al menos un número')
  .regex(/[^a-zA-Z0-9]/, 'Debe contener al menos un carácter especial')

export const dateSchema = z.string().datetime('Fecha inválida')

export const fileSchema = (maxSizeMB = 5, allowedTypes: string[] = ['image/jpeg', 'image/png', 'image/webp']) =>
  z.custom<File>((val) => val instanceof File, { message: 'Debe ser un archivo' })
    .refine((file) => file.size <= maxSizeMB * 1024 * 1024, { message: `El archivo debe ser menor a ${maxSizeMB}MB` })
    .refine((file) => allowedTypes.includes(file.type), { message: 'Tipo de archivo no soportado' })
