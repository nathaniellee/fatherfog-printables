import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { classes, stats, saves, statCodes, formatSkill, createExampleCharacter } from './characters.js';
import './styles.css';

function NumberField({ label, value, onChange }) {
  return (
    <label>
      {label}
      <input
        type="number"
        step="any"
        value={value}
        onChange={(event) => {
          const next = Number(event.target.value);
          if (Number.isFinite(next)) onChange(next);
        }}
      />
    </label>
  );
}

function CharacterEditor({ character, setCharacter }) {
  const update = (key, value) => setCharacter((previous) => ({ ...previous, [key]: value }));
  const updateSkill = (index, key, value) => {
    setCharacter((previous) => ({
      ...previous,
      skills: previous.skills.map((skill, position) =>
        position === index ? { ...skill, [key]: value } : skill),
    }));
  };

  return (
    <aside className="editor" aria-label="Character editor">
      <h2>Your character</h2>
      <p className="hint">Edit here; the sheet updates as you go. Scores are printed exactly as entered.</p>
      <label>
        Name
        <input value={character.name} onChange={(event) => update('name', event.target.value)} />
      </label>
      <label>
        Class
        <select value={character.className} onChange={(event) => update('className', event.target.value)}>
          {Object.keys(classes).map((name) => <option key={name}>{name}</option>)}
        </select>
      </label>
      <fieldset>
        <legend>Health, Hope &amp; Defense</legend>
        <div className="input-grid">
          {['health', 'hope', 'defense'].map((key) => (
            <NumberField
              key={key}
              label={key[0].toUpperCase() + key.slice(1)}
              value={character[key]}
              onChange={(value) => update(key, value)}
            />
          ))}
        </div>
      </fieldset>
      {[['Stats', stats], ['Saves', saves]].map(([title, fields]) => (
        <fieldset key={title}>
          <legend>{title}</legend>
          <div className="input-grid">
            {fields.map((key) => (
              <NumberField key={key} label={key} value={character[key]} onChange={(value) => update(key, value)} />
            ))}
          </div>
        </fieldset>
      ))}
      <fieldset>
        <legend>Skills</legend>
        {character.skills.map((skill, index) => (
          <div className="skill-editor" key={index}>
            <label>
              Skill {index + 1} name
              <input value={skill.name} onChange={(event) => updateSkill(index, 'name', event.target.value)} />
            </label>
            <NumberField label={`Skill ${index + 1} bonus`} value={skill.bonus} onChange={(value) => updateSkill(index, 'bonus', value)} />
            <fieldset className="related-stats">
              <legend>Related stats</legend>
              {statCodes.map((code, position) => (
                <label key={code} title={stats[position]}>
                  <input
                    type="checkbox"
                    checked={skill.stats.includes(code)}
                    disabled={skill.stats.length === 1 && skill.stats.includes(code)}
                    onChange={(event) => updateSkill(index, 'stats', event.target.checked
                      ? [...skill.stats, code]
                      : skill.stats.filter((item) => item !== code))}
                  />
                  {code}
                </label>
              ))}
            </fieldset>
            <button
              className="subtle"
              aria-label={`Remove skill ${index + 1}`}
              onClick={() => update('skills', character.skills.filter((_, position) => position !== index))}
            >Remove</button>
          </div>
        ))}
        <button className="secondary" onClick={() => update('skills', [...character.skills, { name: '', stats: ['S'], bonus: 0 }])}>
          Add skill
        </button>
        <div className="skill-points-editor">
          <NumberField label="Skill Points" value={character.skillPoints} onChange={(value) => update('skillPoints', value)} />
        </div>
      </fieldset>
      <fieldset>
        <legend>Equipment</legend>
        {character.equipment.map((item, index) => (
          <div className="equipment-editor" key={index}>
            <label>
              Item {index + 1}
              <input value={item} onChange={(event) => update('equipment', character.equipment.map((existing, position) => position === index ? event.target.value : existing))} />
            </label>
            <button
              className="subtle"
              aria-label={`Remove equipment ${index + 1}`}
              onClick={() => update('equipment', character.equipment.filter((_, position) => position !== index))}
            >Remove</button>
          </div>
        ))}
        <button className="secondary" onClick={() => update('equipment', [...character.equipment, ''])}>Add equipment</button>
      </fieldset>
    </aside>
  );
}

function ScoreGroup({ title, fields, character }) {
  return (
    <section className="sheet-section">
      <h3>{title}</h3>
      <dl className="score-list">
        {fields.map((field) => (
          <div key={field}>
            <dt>{field}</dt>
            <dd>{character[field]}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function CharacterSheet({ character }) {
  return (
    <article className="character-sheet" aria-label="Printable character sheet">
      <header className="sheet-name">
        <span className="eyebrow">Name</span>
        <h2>{character.name || '\u00a0'}</h2>
      </header>
      <section className="sheet-section class-section">
        <h3>Class <span>{character.className}</span></h3>
        <ul className="traits">
          {classes[character.className].map((trait) => <li key={trait}>{trait}</li>)}
        </ul>
      </section>
      <div className="vitals">
        {['health', 'hope', 'defense'].map((key) => (
          <section className="vital" key={key} aria-label={key}>
            <h3>{key}</h3>
            <div className="vital-value">
              {key === 'defense'
                ? (character.defense === 0 ? <span className="writing-space" aria-label="Blank defense" /> : character.defense)
                : <><span className="writing-space" aria-label={`Current ${key}: blank`} /><span>/ {character[key]}</span></>}
            </div>
            <span className="vital-caption">{key === 'defense' ? '\u00a0' : 'current / maximum'}</span>
          </section>
        ))}
      </div>
      <div className="attributes">
        <ScoreGroup title="Stats" fields={stats} character={character} />
        <ScoreGroup title="Saves" fields={saves} character={character} />
      </div>
      <div className="skills-and-equipment">
        <section className="sheet-section skills-section">
          <h3>Skills</h3>
          <ul className="ruled-list skills-list">
            {character.skills.map((skill, index) => {
              const { name, relatedStats, bonus } = formatSkill(skill);
              return (
                <li key={index}>
                  <span>{name}</span>
                  <span className="skill-stats">{relatedStats}</span>
                  <span className="skill-bonus">{bonus}</span>
                </li>
              );
            })}
          </ul>
          <div className="skill-points"><span>Skill Points</span><strong>{character.skillPoints}</strong></div>
        </section>
        <section className="sheet-section equipment-section">
          <h3>Equipment</h3>
          <ul className="ruled-list">
            {character.equipment.map((item, index) => <li key={index}>{item || '\u00a0'}</li>)}
          </ul>
        </section>
      </div>
      <footer className="sheet-footer">Fatherfog / Convention character sheet</footer>
    </article>
  );
}

function App() {
  const [character, setCharacter] = useState(createExampleCharacter);

  return (
    <>
      <header className="app-header">
        <div>
          <span className="eyebrow">Ready for the table</span>
          <h1>Fatherfog <span>printables</span></h1>
          <p>Character sheets for adventures in the fog.</p>
        </div>
        <button className="print-button" onClick={() => window.print()}>Print character sheet</button>
      </header>
      <main className="workspace">
        <CharacterEditor character={character} setCharacter={setCharacter} />
        <div className="preview">
          <div className="preview-heading">
            <h2>Print preview</h2>
            <span>Letter or A4 &middot; black &amp; white</span>
          </div>
          <CharacterSheet character={character} />
          <p className="print-hint">Use your browser's print dialog to print or save as PDF. Disable browser headers and footers for a clean sheet.</p>
        </div>
      </main>
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);
