export const links = [
  {
    label: 'home',
    href: '/',
  },
] as const satisfies {
  label: string
  href: string
}[]
