export const classes = {
  Worker: [
    'When you roll a critical success, you gain 1 Skill Point.',
  ],
  Philosopher: [
    'When you roll a critical success, nearby party members gain 5 Hope.',
    'When you roll a critical failure, nearby party members lose 5 Hope.',
  ],
  Stranger: [
    'When non-Stranger party members touch you or wake up in your presence, they lose 2 Hope.',
  ],
  Hunter: [
    'When you roll a critical success on a Will check, increase your Will by 1.',
    'When you Despair, all nearby party members must succeed a Hope Save or Despair as well.',
  ],
};

export const stats = ['Strength', 'Intellect', 'Will'];
export const saves = ['Body', 'Mind', 'Spirit'];
export const statCodes = ['S', 'I', 'W'];

export function formatSkill(skill) {
  const related = statCodes.filter((code) => skill.stats.includes(code));
  const bonus = skill.bonus >= 0 ? `+${skill.bonus}` : String(skill.bonus);
  return { name: skill.name, relatedStats: related.join(' \u2022 '), bonus };
}

export function createExampleCharacter() {
  return {
    name: 'Merrin Ash',
    className: 'Worker',
    health: 35,
    hope: 40,
    defense: 0,
    Strength: 35,
    Intellect: 30,
    Will: 25,
    Body: 30,
    Mind: 25,
    Spirit: 25,
    skillPoints: 3,
    skills: [
      { name: 'Dancing', stats: ['I', 'W'], bonus: 15 },
      { name: 'Tinkering', stats: ['S', 'I', 'W'], bonus: 10 },
    ],
    equipment: ['Rucksack', 'Cloak', 'Waterskin', 'Rations'],
  };
}
