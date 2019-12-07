import React from 'react'
import fetch from 'node-fetch'
import './App.css'
import './animations.css'
import Ladder from './Ladder'
import Challonge from './Challonge'
import Resolve from './Resolve'

const api = 'https://hiqombo-ladder.herokuapp.com'
//const api = 'http://localhost:3500'

class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      players: [],
      matches: [],
      schedule: [],
      screen: 'LADDER',
      resolveCandidate: null,
      error: null,
      highlight: [null, 'null', ''].indexOf(document.cookie) ? null : document.cookie,
      network: false
    }

    this.newplayer = this.newplayer.bind(this)
    this.resolvefight = this.resolvefight.bind(this)
    this.scheduleFight = this.scheduleFight.bind(this)
    this.setscreen = this.setscreen.bind(this)
    this.highlightPlayer = this.highlightPlayer.bind(this)
    this.setError = this.setError.bind(this)
    this.useApi = this.useApi.bind(this)
  }

  componentDidMount() {
    this.useApi('matches')
    this.useApi('schedule')
    this.useApi('players')
  }

  setscreen(screen, p1slug, p2slug) {
    this.setState({ screen: screen })
    if (p1slug && p2slug)
      this.setState({ resolveCandidate: { p1slug: p1slug, p2slug: p2slug } })
  }

  useApi(resource) {
    this.setState({network: true}, () => {

      fetch(`${api}/${resource}`)
        .then(res => res.json())
        .then(res => this.setState({[resource]: res}))
        .then(res => this.setState({network: false}))
        .catch(() => this.setState({error: true}))

    })
  }

  setError() {
    this.setState({error: true})
  }

  newplayer() {
    const player = this.refs['player-input'].value
    const params = {
      method: 'post',
      body: JSON.stringify({ name: player, main: '?'}),
      headers: { 'Content-Type': 'application/json' }
    }
    this.setState({ network: true })

    fetch(`${api}/newplayer`, params)
      .then(this.updatePlayers)
      .then(() => this.setState({ network: false }))
  }

  resolvefight(data) {
    const { p1slug, p2slug } = this.state.resolveCandidate
    const { winner, score, date, result } = data
    const json = JSON.stringify({ p1slug: p1slug, p2slug: p2slug, winner: winner, score: score, date: date, result: result })
    const params = {
      method: 'post',
      body: json,
      headers: { 'Content-Type': 'application/json' }
    }
    this.setState({ network: true, resolveCandidate: null })

    fetch(`${api}/resolvefight`, params)
      .then(() => this.useApi('matches'))
      .then(() => this.useApi('schedule'))
      .then(() => this.useApi('players'))
      .then(() => this.setState({ network: false }))

  }

  scheduleFight(p1slug, p2slug) {
    const json = JSON.stringify({ p1slug: p1slug, p2slug: p2slug, date: new Date().toISOString() })
    const params = {
      method: 'post',
      body: json,
      headers: { 'Content-Type': 'application/json' }
    }
    this.setState({ network: true })

    fetch(`${api}/schedulefight`, params)
      .then(() => this.useApi('matches'))
      .then(() => this.useApi('schedule'))
      .then(() => this.setscreen('LADDER'))
      .then(() => this.setState({ network: false }))
  }

  highlightPlayer(playerslug) {
    const highlight = this.state.highlight
    const result = (highlight === playerslug) ? null : playerslug

    this.setState({ highlight: result })
    document.cookie = result
  }

  render() {
    const {
      schedule,
      matches,
      players,
      network,
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
          network={network}
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
          scheduleFight={this.scheduleFight}
          network={network}
          highlight={highlight} />
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
    return <div>Nothing here</div>
  }
}

export default App
