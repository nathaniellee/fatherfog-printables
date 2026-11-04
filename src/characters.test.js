import assert from 'node:assert/strict'
import test from 'node:test'
import { characters, classes, deriveCharacter } from './characters.js'

const statNames = ['strength', 'intellect', 'will', 'body', 'mind', 'spirit']

const expectedStats = {
  Worker: [47, 28, 31, 31, 24, 28],
  Philosopher: [37, 38, 31, 26, 24, 23],
  Stranger: [37, 33, 36, 16, 59, 13],
  Hunter: [37, 28, 41, 31, 19, 33],
}

for (const [className, values] of Object.entries(expectedStats)) {
  test(`${className} applies its stat and save adjustments and trait`, () => {
    const sheet = deriveCharacter({ ...characters[0], class: className })
    assert.deepEqual(statNames.map((stat) => sheet[stat]), values)
    assert.equal(sheet.maxHealth, sheet.strength)
    assert.equal(sheet.trait, classes[className].trait)
    assert.ok(sheet.trait.length > 0)
  })
}

test('derivation preserves character data and does not apply adjustments to the source', () => {
  const source = structuredClone(characters[0])
  const original = structuredClone(source)
  const sheet = deriveCharacter(source)

  assert.deepEqual(source, original)
  assert.deepEqual(deriveCharacter(source), sheet)
  for (const key of ['name', 'class', 'maxHope', 'defense', 'skillPoints', 'skills', 'equipment']) {
    assert.deepEqual(sheet[key], source[key])
  }
  assert.equal(deriveCharacter({ ...source, maxHealth: 999 }).maxHealth, 47)
})

test('unknown classes are rejected, including inherited object properties', () => {
  for (const className of ['Wizard', 'toString', '__proto__']) {
    assert.throws(() => deriveCharacter({ ...characters[0], class: className }), /Unknown Fatherfog class/)
  }
})
