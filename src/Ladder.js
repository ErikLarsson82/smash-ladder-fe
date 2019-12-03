import React from 'react'
import PlayerRow from './PlayerRow'
import { Icon } from './helpers'

export default function Ladder(props) {
  const { schedule, matches, players, setscreen, error, highlight, highlightPlayer } = props

  return (
    <div className="App">
      <img src="logo.png" width="355" height="221" alt="logo" />
      <hr />
      {
        schedule.map(({p1slug, p2slug, date}, idx, list) => {
          return (
            <div className="match-box" key={`${p1slug}-${p2slug}-${date}`}>
              <div className="banner-container">
                <img onClick={() => setscreen('RESOLVE', p1slug, p2slug)} className="banner" src="banner.png" alt="schedule-banner" />
                <div className="banner-p1">{p1slug}</div>
                <div className="banner-p2">{p2slug}</div>
              </div>
            </div>
          )
        })
      }
      <hr />
      <table className="players" border="0" cellSpacing="0">
        <thead>
        <tr>
          <th><div className="placement">#</div></th>
          <th>Spelare</th>
          <th>Main</th>
          <th>Secondary</th>
        </tr>
        </thead>
        <tbody>
        {
          players.length > 0 &&
          players.map((player, idx) =>
            <PlayerRow
              {...player}
              key={player.playerslug}
              idx={idx}
              highlight={highlight}
              highlightPlayer={highlightPlayer} />
          )
        }
        </tbody>
      </table>
      {
        players.length === 0 && !error && (
          <div className="loading">
            Laddar spelare...... undrar vart Mega Man är på listan?
          </div>
        )
      }
      {
        error && (
          <div className="loading">
            Kunde inte hämta listan - är servern uppe?
          </div>
        )
      }
      <hr />
      <h2 className="matches">Matcher</h2>
      <div>
        {
          matches.map(x=>x).reverse().map(({p1slug, p2slug, result, date}) => {
            return (
              <div className="resolved-container" key={`${p1slug}-${p2slug}-${date}`}>
                <div>
                  <Icon large name={players.find(x => x.playerslug === p1slug).main} /> vs. <Icon large name={players.find(x => x.playerslug === p2slug).main} /><br />
                </div>
                <div className="score-box">
                  2-1
                </div>
              </div>
            )
          })
        }
        {
          matches.length === 0 && <div>Inga matcher spelade än...</div>
        }
      </div>
      <div className="footer">Powered by Cargo and Bonko</div>
      <div className="icon-row">
        <img className="menu-icon" onClick={() => setscreen('CHALLONGE')} src="boxing-glove.png" alt="Schemalägg match" />
        <img className="menu-icon" onClick={() => {}}  src="scoreboard.png" alt="Registrera resultat" />
        <img className="menu-icon" src="gear.png" alt="Inställningar" />
      </div>
    </div>
  );
}
