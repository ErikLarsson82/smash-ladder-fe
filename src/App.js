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
      saving: false
    }

    this.updatePlayers = this.updatePlayers.bind(this)
    this.updateMatches = this.updateMatches.bind(this)
    this.updateSchedule = this.updateSchedule.bind(this)
    this.newplayer = this.newplayer.bind(this)
    this.resolvefight = this.resolvefight.bind(this)
    this.setscreen = this.setscreen.bind(this)
    this.newfight = this.newfight.bind(this)
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
  }

  updateMatches() {
    fetch('http://localhost:3500/matches')
      .then(res => res.json())
      .then(res => this.setState({ matches: res }))
  }

  updateSchedule() {
    fetch('http://localhost:3500/schedule')
      .then(res => res.json())
      .then(res => this.setState({ schedule: res }))
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

  render() {
    const { schedule, matches, players, saving, screen, resolveCandidate } = this.state

    if (screen === 'LADDER') {
      return (
        <Ladder
          schedule={schedule}
          matches={matches}
          players={players}
          saving={saving}
          matchplayed={this.matchplayed}
          newplayer={this.newplayer}
          setscreen={this.setscreen} />
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

function Ladder(props) {

  const { schedule, matches, players, setscreen } = props

  return (
    <div className="App">
      <img src="logo.png" className="logo" alt="logo" />
      <hr />
      {
        schedule.map(({p1,p2, date}, idx, list) => {
          return (
            <div className="match-box" key={`${p1}-${p2}-${date}`}>
              {p1} vs. {p2}<br />
              <img onClick={() => setscreen('RESOLVE', p1, p2)} className="banner" src="banner.png" alt="schedule-banner" />

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
          <th>Secondary</th>
        </tr>
        </thead>
        <tbody>
        {
          players.map(({name, main, secondary}, idx) => {
            const odd = idx % 2 === 0 ? 'odd' : ''
            return (
              <tr key={name} className={odd}>
                <td>{idx+1}</td>
                <td>{name}</td>
                <td>{main}</td>
                <td>{secondary}</td>
              </tr>
            )
          })
        }
        </tbody>
      </table>
      <hr />
      <h2 className="matches">Matcher</h2>
      {
        /*<ol>
          {
            matches.map(({p1, p2, winner, score, date}) =>
              <li key={`${p1}-${p2}-${date}`}>{p1} - {p2} vinnare: {winner} resultat: {score}</li>)
          }
        </ol>
        */
      }
      <div>
        {
          matches.map(({p1, p2, result, date}) => {
            return (
              <div className="resolved-container" key={`${p1}-${p2}-${date}`}>
                <div>
                  <img src="ike.png" width="40px" alt="ike" /> vs. <img src="joker.png" width="40px" alt="ike" /><br />
                </div>
                <div className="score-box">
                  2-1
                </div>
              </div>
            )
          })
        }
      </div>
      <div className="footer">Powered by Cargo</div>
      <div className="icon-row">
        <img className="menu-icon" onClick={() => setscreen('CHALLONGE')} src="boxing-glove.png" alt="Schemalägg match" />
        <img className="menu-icon" onClick={() => {}}  src="scoreboard.png" alt="Registrera resultat" />
        <img className="menu-icon" src="gear.png" alt="Inställningar" />
      </div>
    </div>
  );
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

    return (
      <div className="challonge">
        <h2>Utmaning</h2>
        <input type="button" value="Tillbaka" onClick={() => setscreen('LADDER')} /><br />
        <div className="challonge-container">
          <div className="player-list">
            {
              players.map(({name}) => {
                const selected = p1 === name ? 'selected' : ''
                return <div key={`${name}-left`} className={selected} onClick={() => this.setState({p1: name})}>{name}</div>
              })
            }
          </div>
          <img src="player-versus-player.png" alt="VS" />
          <div>
            {
              players.map(({name}) => {
                const selected = p2 === name ? 'selected' : ''
                return <div key={`${name}-left`} className={selected} onClick={() => this.setState({p2: name})}>{name}</div>
              })
            }
          </div>
        </div>
        {
          p1 && p2 && (
            <input type="button" value="Fight" onClick={() => { newfight(p1, p2); setscreen('LADDER') }} />
          )
        }
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
