import test from 'node:test';
import assert from 'node:assert/strict';
import { createExampleCharacter } from './characters.js';
import { characterStorageKey, readSavedCharacters, saveCharacter } from './storage.js';

function memoryStorage() {
  const values = new Map();
  return {
    getItem: (key) => values.has(key) ? values.get(key) : null,
    setItem: (key, value) => values.set(key, value),
  };
}

test('an empty library contains no saved characters', () => {
  assert.deepEqual(readSavedCharacters(memoryStorage()), []);
});

test('saving and reading round-trip every character field without sharing editable collections', () => {
  const storage = memoryStorage();
  const character = createExampleCharacter();
  character.defense = 7;
  character.skills[0].bonus = -5;
  const saved = saveCharacter(storage, 'first', character);
  assert.deepEqual(readSavedCharacters(storage), [{ id: 'first', character }]);
  character.skills[0].stats.push('S');
  character.equipment.push('Rope');
  assert.deepEqual(saved[0].character.skills[0].stats, ['I', 'W']);
  assert.equal(saved[0].character.equipment.length, 4);
  saved[0].character.equipment.push('Lantern');
  assert.equal(readSavedCharacters(storage)[0].character.equipment.length, 4);
});

test('saving an existing ID updates its name and data without duplicating it or altering other characters', () => {
  const storage = memoryStorage();
  const first = createExampleCharacter();
  const second = { ...createExampleCharacter(), name: 'Second character' };
  saveCharacter(storage, 'first', first);
  saveCharacter(storage, 'second', second);
  const renamed = { ...first, name: 'Renamed character', hope: 17 };
  assert.deepEqual(saveCharacter(storage, 'first', renamed), [
    { id: 'first', character: renamed },
    { id: 'second', character: second },
  ]);
});

test('different IDs allow independent copies, including characters with the same name', () => {
  const storage = memoryStorage();
  const character = createExampleCharacter();
  saveCharacter(storage, 'first', character);
  saveCharacter(storage, 'copy', character);
  assert.equal(readSavedCharacters(storage).length, 2);
});

test('a save reads the latest library rather than overwriting characters saved elsewhere', () => {
  const storage = memoryStorage();
  saveCharacter(storage, 'first', createExampleCharacter());
  const staleSnapshot = readSavedCharacters(storage);
  saveCharacter(storage, 'other-tab', { ...createExampleCharacter(), name: 'Other tab' });
  assert.equal(staleSnapshot.length, 1);
  const latest = saveCharacter(storage, 'first', { ...staleSnapshot[0].character, health: 9 });
  assert.equal(latest.length, 2);
  assert.equal(latest[1].character.name, 'Other tab');
});

test('blank names and invalid character fields are rejected without changing storage', () => {
  const storage = memoryStorage();
  saveCharacter(storage, 'first', createExampleCharacter());
  const original = storage.getItem(characterStorageKey);
  for (const character of [
    { ...createExampleCharacter(), name: '   ' },
    { ...createExampleCharacter(), className: 'Unknown' },
    { ...createExampleCharacter(), className: '__proto__' },
    { ...createExampleCharacter(), health: Infinity },
    { ...createExampleCharacter(), Body: '30' },
    { ...createExampleCharacter(), equipment: [1] },
    { ...createExampleCharacter(), skills: [{ name: 'Dancing', stats: [], bonus: 15 }] },
    { ...createExampleCharacter(), skills: [{ name: 'Dancing', stats: ['X'], bonus: 15 }] },
    { ...createExampleCharacter(), skills: [{ name: 'Dancing', stats: ['S', 'S'], bonus: 15 }] },
    { ...createExampleCharacter(), skills: [{ name: 'Dancing', stats: ['S'], bonus: NaN }] },
  ]) {
    assert.throws(() => saveCharacter(storage, 'invalid', character));
    assert.equal(storage.getItem(characterStorageKey), original);
  }
});

test('empty skills and equipment are valid', () => {
  const storage = memoryStorage();
  const character = { ...createExampleCharacter(), skills: [], equipment: [] };
  saveCharacter(storage, 'empty-lists', character);
  assert.deepEqual(readSavedCharacters(storage)[0].character, character);
});

test('malformed and unsupported saved data cannot be loaded or overwritten', () => {
  const storage = memoryStorage();
  const record = { id: 'first', character: createExampleCharacter() };
  for (const raw of [
    '{broken',
    'null',
    JSON.stringify({ version: 2, characters: [record] }),
    JSON.stringify({ version: 1, characters: {} }),
    JSON.stringify({ version: 1, characters: [null] }),
    JSON.stringify({ version: 1, characters: [{ ...record, id: '' }] }),
    JSON.stringify({ version: 1, characters: [record, record] }),
    JSON.stringify({ version: 1, characters: [{ id: 'first', character: { name: 'Incomplete' } }] }),
  ]) {
    storage.setItem(characterStorageKey, raw);
    assert.throws(() => readSavedCharacters(storage));
    assert.throws(() => saveCharacter(storage, 'new', createExampleCharacter()));
    assert.equal(storage.getItem(characterStorageKey), raw);
  }
});

test('read failures and quota failures are surfaced and do not modify existing records', () => {
  assert.throws(() => readSavedCharacters({
    getItem() { throw new Error('Storage access denied'); },
  }), /Storage access denied/);

  const storage = memoryStorage();
  saveCharacter(storage, 'first', createExampleCharacter());
  const original = storage.getItem(characterStorageKey);
  assert.throws(() => saveCharacter({
    getItem: storage.getItem,
    setItem() { throw new Error('Storage quota exceeded'); },
  }, 'second', createExampleCharacter()), /Storage quota exceeded/);
  assert.equal(storage.getItem(characterStorageKey), original);
});
