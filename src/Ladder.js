import React from 'react'
import Player from './Player'
import Delay from './Delay'
import { Icon } from './helpers'

export default function Ladder(props) {

  const { schedule, matches, players, setscreen, error, highlight, highlightPlayer, createCandidate } = props

  return (
    <div className="App">
      <div className="content-separator">
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
              players.map((player, idx) => {
                return (
                  <Delay delayDuration={ idx * 100 } key={ player.playerslug }>
                    <Player
                      {...player}
                      key={player.playerslug}
                      idx={idx}
                      highlight={highlight}
                      highlightPlayer={highlightPlayer} />
                  </Delay>
                )
              })
            }
          </tbody>
        </table>
        <div className="feed">
          <img src="hiqombo-logo.png" width="330" height="300" alt="logo" />
          {
            schedule.map(x => x).reverse().map(({p1slug, p2slug, date}, idx, list) => {
              const now = new Date().getTime()
              const fadeIn = now - new Date(date).getTime() < 5000 ? 'fade-in shake' : ''
              const callback = () => createCandidate(p1slug, p2slug, () => setscreen('RESOLVE'))

              return (
                <div className="match-box" key={`${p1slug}-${p2slug}-${date}`}>
                  <div className={ ['banner-container'].concat(fadeIn).join(' ') }>
                    <img onClick={callback} className="banner" src="banner.png" alt="schedule-banner" />
                    <div className="banner-p1">{p1slug}</div>
                    <div className="banner-p2">{p2slug}</div>
                  </div>
                </div>
              )
            })
          }
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
          <h2 className="matches no-border-dim">Matcher</h2>
          <div>
            {
              matches.map(x => x).reverse().map(({p1slug, p2slug, result, date}) => {
                const find1 = x => x.playerslug === p1slug
                const find2 = x => x.playerslug === p2slug
                const name1 = players.find(find1) && players.find(find1).main
                const name2 = players.find(find2) && players.find(find2).main
                return (
                  <div className="resolved-container" key={`${p1slug}-${p2slug}-${date}`}>
                    <div className="icon-box">
                      <Icon large name={name1} /> vs. <Icon large name={name2} /><br />
                    </div>
                    <div className="score-box">
                      {`${result.filter(x=>x==='p1').length}-${result.filter(x=>x==='p2').length}`}
                    </div>
                  </div>
                )
              })
            }
            {
              matches.length === 0 && <div>Inga matcher spelade än...</div>
            }
          </div>
          <h2 className="matches">VÄLKOMNA BUTTON MASHERS!</h2>
          <p>Vill du öva på dina 1 frame links, wiff punishes, short jump bair combos, okizeme eller bara ha de kul å spela lite smash?
            <br />Då kan denna grupp vara för dig!
          </p>
          <p>Vi kör Smash Ultimate på HiQ's Switch så ofta vi kan, joina vår slack-kanal (HiQombo) så får du snart reda på när nästa tillfälle ges!
            <br />Vi spelar gärna alla sorters fighting games men just nu är de SSBU som vi nöter, det är helt fritt att ta med egen konsol/spel och arcade stick om man vill!
            <br />På kontoret har vi ett Switch och pro-controllers, om du föredrar Gamecube-kontroller så får du ta med den själv eller låna av någon annan som har med.
          </p>
          <p>Vi har en stege för de mer kompetitiva av oss, men bli inte avskräckt av den, alla nybörjare är välkomna!
            <br />Den här gruppen är lika mycket till för folk som vill spela lite mer avslappnat.
          </p>
        </div>
      </div>
      <div className="footer">Powered by Cargo, Bonko, Kamden and Beibei</div>
      <div className="icon-row">
        <div className="menu-icon-container">
          <img className="menu-icon smash-green" onClick={() => setscreen('CHALLONGE')} src="boxing-glove.png" alt="Spela match direkt" />
          <img className="menu-icon smash-blue" onClick={() => setscreen('SCHEDULE')}  src="scoreboard.png" alt="Schemalägg match" />
          <img className="menu-icon smash-red" src="gear.png" alt="Inställningar" />
        </div>
      </div>
    </div>
  );
}
