export const classes = {
  Worker: {
    adjustments: { strength: 10, body: 5, mind: 5, spirit: 5 },
    trait: 'When you roll a critical success, you gain 1 Skill Point.',
  },
  Philosopher: {
    adjustments: { intellect: 10, mind: 5 },
    trait: 'When you roll a critical success, nearby party members gain 5 Hope. When you roll a critical failure, nearby party members lose 5 Hope.',
  },
  Stranger: {
    adjustments: { intellect: 5, will: 5, body: -10, mind: 40, spirit: -10 },
    trait: 'When non-Stranger party members touch you or wake up in your presence, they lose 2 Hope.',
  },
  Hunter: {
    adjustments: { will: 10, body: 5, spirit: 10 },
    trait: 'When you roll a critical success on a Will check, increase your Will by 1. When you Despair, all nearby party members must succeed a Hope Save or Despair as well.',
  },
}

export function deriveCharacter(character) {
  if (!Object.hasOwn(classes, character.class)) {
    throw new Error(`Unknown Fatherfog class: ${character.class}`)
  }

  const { adjustments, trait } = classes[character.class]
  const adjusted = { ...character, trait }

  for (const [stat, bonus] of Object.entries(adjustments)) {
    adjusted[stat] += bonus
  }

  return { ...adjusted, maxHealth: adjusted.strength }
}

export const characters = [
  {
    name: 'Working Joe',
    class: 'Worker',
    strength: 37,
    intellect: 28,
    will: 31,
    body: 26,
    mind: 19,
    spirit: 23,
    maxHope: 75,
    defense: 0,
    skillPoints: 0,
    skills: [
      { name: 'Tinkering', stats: ['S', 'I', 'W'], bonus: 10 },
      { name: 'Alchemy', stats: ['I', 'W'], bonus: 10 },
      { name: 'Handaxe', stats: ['S', 'W'], bonus: 15 },
    ],
    equipment: ['Handaxe', 'Tinderbox', 'Rope (50 ft.)', 'Torches (5)'],
  },
]
