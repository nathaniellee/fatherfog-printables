import { classes, stats, saves, statCodes } from './characters.js';

export const characterStorageKey = 'fatherfog-printables.characters.v1';

const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
const scoreFields = ['health', 'hope', 'defense', 'skillPoints', ...stats, ...saves];

function isCharacter(value) {
  return isObject(value)
    && typeof value.name === 'string' && value.name.trim().length > 0
    && typeof value.className === 'string' && Object.hasOwn(classes, value.className)
    && scoreFields.every((field) => typeof value[field] === 'number' && Number.isFinite(value[field]))
    && Array.isArray(value.skills) && value.skills.every((skill) =>
      isObject(skill)
      && typeof skill.name === 'string'
      && typeof skill.bonus === 'number' && Number.isFinite(skill.bonus)
      && Array.isArray(skill.stats) && skill.stats.length > 0
      && skill.stats.every((code) => statCodes.includes(code))
      && new Set(skill.stats).size === skill.stats.length)
    && Array.isArray(value.equipment) && value.equipment.every((item) => typeof item === 'string');
}

export function readSavedCharacters(storage) {
  const raw = storage.getItem(characterStorageKey);
  if (raw === null) return [];

  const data = JSON.parse(raw);
  if (!isObject(data) || data.version !== 1 || !Array.isArray(data.characters)
    || !data.characters.every((record) =>
      isObject(record) && typeof record.id === 'string' && record.id.length > 0 && isCharacter(record.character))
    || new Set(data.characters.map((record) => record.id)).size !== data.characters.length) {
    throw new Error('Saved character data is invalid or uses an unsupported version. It has not been overwritten.');
  }
  return data.characters;
}

export function saveCharacter(storage, id, character) {
  if (typeof character?.name !== 'string' || !character.name.trim()) {
    throw new Error('Enter a character name before saving.');
  }
  if (!isCharacter(character) || typeof id !== 'string' || !id) {
    throw new Error('The character data is invalid and cannot be saved.');
  }

  const characters = readSavedCharacters(storage);
  const record = { id, character: structuredClone(character) };
  const next = characters.some((existing) => existing.id === id)
    ? characters.map((existing) => existing.id === id ? record : existing)
    : [...characters, record];
  storage.setItem(characterStorageKey, JSON.stringify({ version: 1, characters: next }));
  return next;
}
