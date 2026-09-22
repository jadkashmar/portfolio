export type BeyondEntry = {
  title: string
  subtitle: string
  description: string
  kind: 'work' | 'interest' | 'community'
}

export const beyondTheCode: BeyondEntry[] = [
  {
    title: 'Inflatable Games Operator',
    subtitle: 'Seasonal Summer Role · 3+ Years',
    description:
      "For the past three summers, I've worked as an inflatable games operator, setting up equipment and running games for families and kids. It's fast-paced and puts me directly in front of the public, which has taught me how to handle people, resolve issues on the spot, and stay patient under pressure.",
    kind: 'work',
  },
  {
    title: 'Karting',
    subtitle: 'Lebanese Rental Karting Championships',
    description:
      'I race as a driver in the Lebanese Rental Karting Championships. I also follow Formula 1 closely, an interest that led me to build Sector Seven.',
    kind: 'interest',
  },
  {
    title: 'Olive Tree Planting Initiative',
    subtitle: 'Majdelyoun Municipality · School Project',
    description:
      'Worked with the Majdelyoun Municipality on a school project to plant olive trees, contributing to a local environmental initiative.',
    kind: 'community',
  },
  {
    title: 'Clothes For a Cause',
    subtitle: 'School Community Project',
    description:
      'Helped organize a clothes-gathering drive across the school, collecting and donating clothing to people in need.',
    kind: 'community',
  },
]
