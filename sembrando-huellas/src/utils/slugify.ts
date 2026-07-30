const SPANISH_CHARS: Record<string, string> = {
  ñ: 'n', á: 'a', é: 'e', í: 'i', ó: 'o', ú: 'u', ü: 'u',
  Ñ: 'n', Á: 'a', É: 'e', Í: 'i', Ó: 'o', Ú: 'u', Ü: 'u',
}

export function slugify(text: string): string {
  return text
    .split('')
    .map((char) => SPANISH_CHARS[char] ?? char)
    .join('')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}
