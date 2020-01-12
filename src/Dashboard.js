import React from 'react'
import Player from './Player'
import Delay from './Delay'
import ScheduledMatchCard from './ScheduledMatchCard'
import Match from './Match'
import { TransitionGroup, CSSTransition } from 'react-transition-group'

import CircularProgress from '@material-ui/core/CircularProgress'
import Button from '@material-ui/core/Button'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import { StylesProvider } from '@material-ui/core/styles'

export default function Dashboard(props) {

  const {
    schedule,
    matches,
    players,
    setscreen,
    error,
    highlight,
    highlightPlayer,
    createCandidate,
    removefight
  } = props

  const circleClasses = ['add'].concat(schedule.length === 0 ? 'lower' : '')

  const fresh = matchData => {
    const now = new Date().getTime()
    return now - new Date(matchData.date).getTime() < 1000
  }

  return (
    <div className="dashboard background red">
      <div className="content-separator">
        <table className="players" border="0" cellSpacing="0">
          <thead>
          <tr>
            <th style={ { paddingRight: '0' } }>Trend</th>
            <th style={ { paddingLeft: '0', textAlign: 'right' } }>#</th>
            <th></th>
            <th>Spelare</th>
            <th>Main</th>
            <th>Secondary</th>
          </tr>
          </thead>
          <tbody>
            {
              players.length > 0 &&
              players.map(x=>x).sort((a, b) => a.rank > b.rank ? 1 : -1).map((player, idx) => {
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
          <TransitionGroup component={null}>
            {
              schedule.map(matchData => (
                <CSSTransition classNames={fresh(matchData) ? 'fader-new' : 'fader-old' } timeout={700} key={`${matchData.p1slug}-${matchData.p2slug}-${matchData.date}-schedule`}>
                    <ScheduledMatchCard
                      {...matchData}
                      createCandidate={createCandidate}
                      removefight={removefight}
                      setscreen={setscreen}
                      players={players} />
                </CSSTransition>
              ))
            }
          </TransitionGroup>
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
            <TransitionGroup component={null}>
            {
              matches.map(x => x).reverse().slice(0, 4).map(matchData =>
                <CSSTransition classNames={fresh(matchData) ? 'fader-new-delayed' : '' } timeout={1400} key={`${matchData.p1slug}-${matchData.p2slug}-${matchData.date}-match`}>
                  <Match
                    highlight={highlight}
                    matchData={matchData}
                    players={players} />
                </CSSTransition>
              )
            }
            </TransitionGroup>
            {
              matches.length === 0 && <div>Inga matcher spelade än...</div>
            }
          </div>
          <StylesProvider injectFirst>
            <Button className="button tiny" variant="contained" color="primary" onClick={ () => { console.log('nej') } }>
              Mer ...
            </Button>
          </StylesProvider>
          <h2 className="matches">VÄLKOMNA BUTTON MASHERS!</h2>
          <p>Nu är Season 3 live! Välkomna att börja SMASHA! Schemalägg, slåss direkt eller rapportera resultat!</p>
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
      <div className="footer">Powered by Cargo, Bonko, Kamden, Beibei and Itayo</div>
    </div>
  );
}
