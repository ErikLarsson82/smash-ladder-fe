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
          const now = new Date().getTime()
          const fadeIn = now - new Date(date).getTime() < 5000 ? 'fade-in shake' : ''
          return (
            <div className="match-box" key={`${p1slug}-${p2slug}-${date}`}>
              <div className={ ['banner-container'].concat(fadeIn).join(' ') }>
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
          <th className="place"><div className="placement">#</div></th>
          <th className="player">Spelare</th>
          <th className="main">Main</th>
          <th className="secondary">Secondary</th>
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
          matches.map(({p1slug, p2slug, result, date}) => {
            const find1 = x => x.playerslug === p1slug
            const find2 = x => x.playerslug === p2slug
            const name1 = players.find(find1) && players.find(find1).main
            const name2 = players.find(find2) && players.find(find2).main
            console.log(players, name1, name2)
            return (
              <div className="resolved-container" key={`${p1slug}-${p2slug}-${date}`}>
                <div>
                  <Icon large name={name1} /> vs. <Icon large name={name2} /><br />
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
        <div className="menu-icon-container">
          <img className="menu-icon" onClick={() => setscreen('CHALLONGE')} src="boxing-glove.png" alt="Schemalägg match" />
          <img className="menu-icon" onClick={() => {}}  src="scoreboard.png" alt="Registrera resultat" />
          <img className="menu-icon" src="gear.png" alt="Inställningar" />
        </div>
      </div>
    </div>
  );
}
