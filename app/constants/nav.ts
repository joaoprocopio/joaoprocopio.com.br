export const links = [
  {
    label: 'home',
    href: '/',
  },
  {
    label: 'writing',
    href: '/writing',
  },
] as const satisfies {
  label: string
  href: string
}[]
