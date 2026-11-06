import test from 'node:test';
import assert from 'node:assert/strict';
import { classes, formatSkill, createExampleCharacter } from './characters.js';

test('skills format separate columns with ordered stats, no brackets and a signed bonus', () => {
  assert.deepEqual(formatSkill({ name: 'Dancing', stats: ['I', 'W'], bonus: 15 }), {
    name: 'Dancing', relatedStats: 'I \u2022 W', bonus: '+15',
  });
  assert.deepEqual(formatSkill({ name: 'Tinkering', stats: ['W', 'S', 'I'], bonus: 0 }), {
    name: 'Tinkering', relatedStats: 'S \u2022 I \u2022 W', bonus: '+0',
  });
  assert.deepEqual(formatSkill({ name: 'Hiding', stats: ['W'], bonus: -5 }), {
    name: 'Hiding', relatedStats: 'W', bonus: '-5',
  });
});

test('all four classes have the supplied traits', () => {
  assert.deepEqual(Object.keys(classes), ['Worker', 'Philosopher', 'Stranger', 'Hunter']);
  assert.deepEqual(classes.Worker, ['When you roll a critical success, you gain 1 Skill Point.']);
  assert.deepEqual(classes.Philosopher, [
    'When you roll a critical success, nearby party members gain 5 Hope.',
    'When you roll a critical failure, nearby party members lose 5 Hope.',
  ]);
  assert.deepEqual(classes.Stranger, [
    'When non-Stranger party members touch you or wake up in your presence, they lose 2 Hope.',
  ]);
  assert.deepEqual(classes.Hunter, [
    'When you roll a critical success on a Will check, increase your Will by 1.',
    'When you Despair, all nearby party members must succeed a Hope Save or Despair as well.',
  ]);
});

test('example characters have independent editable collections', () => {
  const first = createExampleCharacter();
  const second = createExampleCharacter();
  first.skills[0].stats.push('S');
  first.equipment.push('Rope');
  assert.deepEqual(second.skills[0].stats, ['I', 'W']);
  assert.equal(second.equipment.length, 4);
});
