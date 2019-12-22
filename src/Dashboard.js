import React from 'react'
import Player from './Player'
import Delay from './Delay'
import ScheduledMatchCard from './ScheduledMatchCard'
import Match from './Match'

import CircularProgress from '@material-ui/core/CircularProgress'
import Button from '@material-ui/core/Button'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import { StylesProvider } from '@material-ui/core/styles'

export default function Dashboard(props) {

  const { schedule, matches, players, setscreen, error, highlight, highlightPlayer, createCandidate } = props

  const circleClasses = ['add'].concat(schedule.length === 0 ? 'lower' : '')

  return (
    <div className="dashboard background red">
      <div className="content-separator">
        <table className="players" border="0" cellSpacing="0">
          <thead>
          <tr>
            <th className="trend">Trend</th>
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
          <StylesProvider injectFirst>
            <AddCircleIcon onClick={ () => setscreen('UTMANING') } className={circleClasses.join(' ')} />
          </StylesProvider>
          <img src="hiqombo-logo.png" width="330" height="300" alt="logo" />
          {
            schedule.map(x => x).reverse().map(x => (
              <ScheduledMatchCard
                key={`${x.p1slug}-${x.p2slug}-${x.date}`}
                {...x}
                createCandidate={createCandidate}
                setscreen={setscreen}
                players={players} />
            ))
          }
          {
            players.length === 0 && !error && (
              <div className="loading">
                Laddar spelare...<CircularProgress className="main-loader" color="secondary" /><br /><br />
                ...undrar vart Mega Man är på listan?
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
          <div className="matches-insert">
            {
              matches.map(x => x).reverse().slice(0, 4).map(matchData => 
                <Match
                  key={`${matchData.p1slug}-${matchData.p2slug}-${matchData.date}`}
                  matchData={matchData}
                  players={players} />
              )
            }
            {
              matches.length === 0 && <div>Inga matcher spelade än...</div>
            }
            <StylesProvider injectFirst>
              <Button className="button tiny" variant="contained" color="primary" onClick={ () => { console.log('nej') } }>
                Mer ...
              </Button>
            </StylesProvider>
          </div>
          <h2 className="matches">VÄLKOMNA BUTTON MASHERS!</h2>
          <p>Välkomna till betan av nya stegen. Än så länge testar vi bara sidan så prova att mata in matcher, schemalägg utmaningar och försök att hitta konstiga corner-cases där saker inte fungerar som det är tänkt.</p>
          <hr />
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
    </div>
  );
}
