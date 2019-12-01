import React from 'react';
import fetch from 'node-fetch';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      players: [],
      matches: [],
      schedule: [],
      screen: 'LADDER',
      resolveCandidate: null,
      saving: false,
      error: null,
      highlight: document.cookie
    }

    this.updatePlayers = this.updatePlayers.bind(this)
    this.updateMatches = this.updateMatches.bind(this)
    this.updateSchedule = this.updateSchedule.bind(this)
    this.newplayer = this.newplayer.bind(this)
    this.resolvefight = this.resolvefight.bind(this)
    this.setscreen = this.setscreen.bind(this)
    this.newfight = this.newfight.bind(this)
    this.highlightPlayer = this.highlightPlayer.bind(this)
  }

  componentDidMount() {
    this.updatePlayers()
    this.updateMatches()
    this.updateSchedule()
  }

  setscreen(screen, p1, p2) {
    this.setState({ screen: screen })
    if (p1 && p2)
      this.setState({ resolveCandidate: { p1: p1, p2: p2} })
  }

  newfight(p1, p2) {
    const { schedule } = this.state
    this.setState({ schedule: schedule.concat({ p1: p1, p2: p2, date: new Date() }) })
  }

  updatePlayers() {
    fetch('http://localhost:3500/players')
      .then(res => res.json())
      .then(res => this.setState({ players: res }))
      .catch( () => this.setState({error: true}) )
  }

  updateMatches() {
    fetch('http://localhost:3500/matches')
      .then(res => res.json())
      .then(res => this.setState({ matches: res }))
      .catch( () => this.setState({error: true}) )
  }

  updateSchedule() {
    fetch('http://localhost:3500/schedule')
      .then(res => res.json())
      .then(res => this.setState({ schedule: res }))
      .catch( () => this.setState({error: true}) )
  }

  newplayer() {
    const player = this.refs['player-input'].value
    const params = {
      method: 'post',
      body: JSON.stringify({ name: player, main: '?'}),
      headers: { 'Content-Type': 'application/json' }
    }
    this.setState({ saving: true })

    fetch('http://localhost:3500/newplayer', params)
      .then(this.updatePlayers)
      .then(
        () => setTimeout(() => this.setState({ saving: false }), 1000)
      )
  }

  resolvefight(data) {
    const { p1, p2 } = this.state.resolveCandidate
    const { winner, score, date } = data
    const json = JSON.stringify({ p1: p1, p2: p2, winner: winner, score: score, date: date })
    const params = {
      method: 'post',
      body: json,
      headers: { 'Content-Type': 'application/json' }
    }
    this.setState({ saving: true, resolveCandidate: null })

    fetch('http://localhost:3500/resolvefight', params)
      .then(this.updateMatches)
      .then(this.updateSchedule)
      .then(
        () => setTimeout(() => this.setState({ saving: false }), 1000)
      )
  }

  highlightPlayer(name) {
    const highlight = this.state.highlight
    const result = (highlight === slug(name)) ? null : slug(name)

    this.setState({ highlight: result })
    document.cookie = result
  }

  render() {
    const {
      schedule,
      matches,
      players,
      saving,
      screen,
      resolveCandidate,
      error,
      highlight
    } = this.state

    if (screen === 'LADDER') {
      return (
        <Ladder
          schedule={schedule}
          matches={matches}
          players={players}
          saving={saving}
          matchplayed={this.matchplayed}
          newplayer={this.newplayer}
          setscreen={this.setscreen}
          highlightPlayer={this.highlightPlayer}
          error={error}
          highlight={highlight} />
        )
    }
    if (screen === 'CHALLONGE') {
      return (
        <Challonge
          players={players}
          setscreen={this.setscreen}
          newfight={this.newfight} />
      )
    }
    if (screen === 'RESOLVE') {
      return (
        <Resolve
          setscreen={this.setscreen}
          resolvefight={this.resolvefight}
          resolveCandidate={resolveCandidate} />
      )
    }
    return <div>Naaaaiiii</div>
  }
}

function Icon({name, large}) {
  const size = large ? "45" : "32"
  return (
    <img src={`heroes/${slug(name)}.png`} alt={name} width={size} height={size} />
  )
}

function slug(str) {
  if (!str) return null
  return str.replace(/ /g, '-')
    .replace(/\./g, '')
    .replace(/[äÄ]/g, 'a')
    .replace(/[åÅ]/g, 'a')
    .replace(/[öÖ]/g, 'o')
    .replace(/è/g, 'e')
    .toLowerCase()
}

function Ladder(props) {

  const { schedule, matches, players, setscreen, error, highlight, highlightPlayer } = props

  return (
    <div className="App">
      <img src="logo.png" width="355" height="221" alt="logo" />
      <hr />
      {
        schedule.map(({p1,p2, date}, idx, list) => {
          return (
            <div className="match-box" key={`${p1}-${p2}-${date}`}>
              <div className="banner-container">
                <img onClick={() => setscreen('RESOLVE', p1, p2)} className="banner" src="banner.png" alt="schedule-banner" />
                <div className="banner-p1">{p1}</div>
                <div className="banner-p2">{p2}</div>
              </div>
            </div>
          )
        })
      }
      <hr />
      <table className="players" border="0" cellSpacing="0">
        <thead>
        <tr>
          <th>#</th>
          <th>Spelare</th>
          <th>Main</th>
          <th></th>
          <th>Secondary</th>
          <th></th>
        </tr>
        </thead>
        <tbody>
        {
          players.length > 0 &&
          players.map((player, idx) =>
            <PlayerRow
              {...player}
              key={slug(player.name)}
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
          matches.map(({p1, p2, result, date}) => {
            return (
              <div className="resolved-container" key={`${p1}-${p2}-${date}`}>
                <div>
                  <Icon large name={players.find(x => x.name === p1).main} /> vs. <Icon large name={players.find(x => x.name === p2).main} /><br />
                </div>
                <div className="score-box">
                  2-1
                </div>
              </div>
            )
          })
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

function QcIcon({place}) {
  return <img src={`qc-${place}.png`} className="qc-icon" width="10" height="10" alt="Plats" />
}

function PlayerRow({name, main, secondary, qc, idx, highlight, highlightPlayer}) {
  const odd = idx % 2 === 0 ? 'odd' : ''
  const _highlight = slug(name) === highlight ? 'highlight' : ''
  const qcIcons = qc.map(x => <QcIcon key={`${name}-${x}`} place={x} />)
  return (
    <tr
      className={[_highlight, 'player-row', odd].join(' ')}
      onClick={() => highlightPlayer(name)}>
      <td>{idx+1}</td>
      <td>{name}{ qcIcons.length > 0 && qcIcons}</td>
      <td>{main}</td>
      <td><Icon name={main} /></td>
      <td>{secondary}</td>
      <td>{secondary && <Icon name={secondary} />}</td>
    </tr>
  )
}

class Challonge extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      p1: null,
      p2: null
    }
  }

  render() {
    const { players, setscreen, newfight } = this.props
    const { p1, p2 } = this.state

    //<input type="button" value="Tillbaka" onClick={() => setscreen('LADDER')} /><br />

    return (
      <div className="challonge">
        <div className="centered">
          <img src="utmaning.png" width="238" height="65" alt="Utmaning" />
        </div>
        <div className="challonge-container">
          <div className="spacer">
            <h2 className="player-heading">Challanger</h2>
            {
              players.map(({name}) => {
                const selected = p1 === name ? 'selected' : ''
                return (
                  <div key={`${name}-left`} className={[selected].concat('player-list').join(' ')} onClick={() => this.setState({p1: name})}>
                    {name}
                  </div>
                )
              })
            }
          </div>
          <div className="spacer">
            <img className="vs-logo" src="player-versus-player.png" alt="VS" />
          </div>
          <div className="spacer">
            <h2 className="player-heading">Challangee</h2>
            {
              players.map(({name}) => {
                const selected = p2 === name ? 'selected' : ''
                return (
                  <div key={`${name}-left`} className={[selected].concat('player-list').join(' ')} onClick={() => this.setState({p2: name})}>
                    {name}
                  </div>
                )
              })
            }
          </div>
        </div>
        <div className="centered">
          <img
            src="fight.png"
            alt="Slåss"
            className={ [p1 && p2 ? '' : 'invisible', 'button'].join(' ') }
            onClick={() => { newfight(p1, p2); setscreen('LADDER') }} />
        </div>
      </div>
    )
  }

}


class Resolve extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      result: []
    }
  }

  render() {
    const { resolvefight, setscreen, resolveCandidate } = this.props
    const { result } = this.state
    const { p1, p2 } = resolveCandidate

    const p1count = result.filter(x => x === 'p1').length
    const p2count = result.filter(x => x === 'p2').length
    const valid = result.length === 3 || p1count === 2 || p2count === 2
    const winner = p1count > p2count ? 'p1' : 'p2'
    const scoreSet = `${p1count} - ${p2count}`

    const reset = () => this.setState({ result: [] })
    const set = player => {
      if (valid && winner)
        return
      this.setState({ result: result.concat(player) })
    }
    return (
      <div className="resolvefight">
        <h2>Resultat</h2>
        <img alt="p1" onClick={() => set('p1')} src="p1.png" className={ valid && winner === 'p2' ? 'dim' : ''} />
        <input type="button" value="Reset" onClick={reset} />
        <img alt="p2" onClick={() => set('p2')} src="p2.png" className={ valid && winner === 'p1' ? 'dim' : ''} />
        {
          result.map((player, idx) => {
            return (
              <div key={`${player}${idx}`}>
                {
                  player === 'p1' ? <div>{'<-'}</div> : <div>{'->'}</div>
                }
               {
                idx >= result.length && <hr />
               }
              </div>
            )
          })
        }
        { scoreSet }
        {
          valid && winner && (
            <img alt="resolve" onClick={() => { setscreen('LADDER'); resolvefight({p1: p1, p2: p2, result: ['p1', 'p2', 'p1'], date: new Date().toISOString() }) } } key="resolve" src="resolve.png" />
          )
        }
      </div>
    )
  }

}

export default App;
