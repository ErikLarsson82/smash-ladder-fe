import React from 'react'
import fetch from 'node-fetch'
import './App.scss'
import './animations.css'
import Dashboard from './Dashboard'
import Challonge from './Challonge'
import Resolve from './Resolve'

const api = 'https://hiqombo-ladder-be.herokuapp.com'

class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      players: [],
      matches: [],
      schedule: [],
      screen: 'DASHBOARD',
      resolveCandidate: null,
      error: null,
      highlight: [null, 'null', ''].indexOf(document.cookie) !== -1 ? null : document.cookie,
      network: false
    }

    this.newplayer = this.newplayer.bind(this)
    this.resolvefight = this.resolvefight.bind(this)
    this.scheduleFight = this.scheduleFight.bind(this)
    this.setscreen = this.setscreen.bind(this)
    this.highlightPlayer = this.highlightPlayer.bind(this)
    this.setError = this.setError.bind(this)
    this.useApi = this.useApi.bind(this)
    this.createCandidate = this.createCandidate.bind(this)
  }

  componentDidMount() {
    this.useApi('matches')
    this.useApi('schedule')
    this.useApi('players')
  }

  setscreen(screen) {
    this.setState({ screen: screen })
  }

  createCandidate(p1slug, p2slug, callback) {
    if (p1slug && p2slug)
      this.setState({ resolveCandidate: { p1slug: p1slug, p2slug: p2slug } }, () => callback && callback())
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

    return fetch(`${api}/resolvefight`, params)
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

    return fetch(`${api}/schedulefight`, params)
      .then(() => this.useApi('matches'))
      .then(() => this.useApi('schedule'))
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

    if (screen === 'DASHBOARD') {
      return (
        <Dashboard
          schedule={schedule}
          matches={matches}
          players={players}
          network={network}
          matchplayed={this.matchplayed}
          newplayer={this.newplayer}
          setscreen={this.setscreen}
          highlightPlayer={this.highlightPlayer}
          createCandidate={this.createCandidate}
          error={error}
          highlight={highlight} />
        )
    }
    if (screen === 'CHALLONGE') {
      return (
        <Challonge
          players={players}
          fight
          setscreen={this.setscreen}
          scheduleFight={this.scheduleFight}
          createCandidate={this.createCandidate}
          network={network}
          highlight={highlight} />
      )
    }
    if (screen === 'SCHEDULE') {
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
          players={players}
          setscreen={this.setscreen}
          resolvefight={this.resolvefight}
          resolveCandidate={resolveCandidate} />
      )
    }
  }
}

export default App
