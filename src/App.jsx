import { useId } from 'react'
import { characters, deriveCharacter } from './characters.js'
import './App.css'

const stats = ['strength', 'intellect', 'will', 'body', 'mind', 'spirit']

function Resource({ label, maximum }) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>
        <span className="pencil-space" aria-label={`Current ${label.toLowerCase()} (write in pencil)`} />
        <span> / {maximum}</span>
      </dd>
    </div>
  )
}

function CharacterSheet({ character }) {
  const id = useId()
  const sheet = deriveCharacter(character)

  return (
    <article className="character-sheet" aria-label={`${sheet.name} character sheet`}>
      <header className="sheet-header">
        <p className="eyebrow">Fatherfog · Character sheet</p>
        <h1>{sheet.name}</h1>
        <p className="class-name">{sheet.class}</p>
        <p className="trait">{sheet.trait}</p>
      </header>

      <dl className="resources">
        <Resource label="Health" maximum={sheet.maxHealth} />
        <Resource label="Hope" maximum={sheet.maxHope} />
        <div>
          <dt>Defense</dt>
          <dd>{sheet.defense}</dd>
        </div>
      </dl>

      <section aria-label="Stats and saves">
        <div className="stat-groups">
          <h2>Stats</h2>
          <h2>Saves</h2>
        </div>
        <dl className="stats">
          {stats.map((stat) => (
            <div key={stat}>
              <dt>{stat}</dt>
              <dd>{sheet[stat]}</dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="inventory">
        <section aria-labelledby={`${id}-skills`}>
          <h2 id={`${id}-skills`}>Skills</h2>
          <p className="skill-points">Skill Points: <strong>{sheet.skillPoints}</strong></p>
          <table>
            <thead>
              <tr><th scope="col">Skill</th><th scope="col">Stats</th><th scope="col">Bonus</th></tr>
            </thead>
            <tbody>
              {sheet.skills.map((skill, index) => (
                <tr key={index}>
                  <th scope="row">{skill.name}</th>
                  <td>{skill.stats.join(', ')}</td>
                  <td>{skill.bonus >= 0 ? '+' : ''}{skill.bonus}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="skill-key">S = Strength · I = Intellect · W = Will</p>
        </section>

        <section aria-labelledby={`${id}-equipment`}>
          <h2 id={`${id}-equipment`}>Equipment</h2>
          <ul className="equipment">
            {sheet.equipment.map((item, index) => <li key={index}>{item}</li>)}
          </ul>
        </section>
      </div>
    </article>
  )
}

export default function App() {
  return (
    <main>
      <div className="print-controls">
        <p>Ready for your next one-shot.</p>
        <button type="button" onClick={() => window.print()}>Print sheets</button>
      </div>
      {characters.map((character, index) => (
        <CharacterSheet key={index} character={character} />
      ))}
    </main>
  )
}
