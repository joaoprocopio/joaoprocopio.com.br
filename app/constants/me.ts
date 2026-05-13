export const social = [
  {
    label: 'linkedin',
    href: 'https://www.linkedin.com/in/joao-procopio/',
  },
  {
    label: 'github',
    href: 'https://github.com/joaoprocopio/',
  },
] as const satisfies {
  label: string
  href: string
}[]

export const mail = 'joaovitorcprocopio@gmail.com' as const
