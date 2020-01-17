import React from 'react'
import fetch from 'node-fetch'
import cookie from 'js-cookie'
import './App.scss'
import Dashboard from './Dashboard'
import Utmaning from './Utmaning'
import Rapportera from './Rapportera'
import Matcher from './Matcher'
import Preloader from './Preloader'

const api = window.location.host.indexOf('localhost') === -1 ? 'https://hiqombo-ladder-be.herokuapp.com' : 'http://localhost:1337'

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
      highlight: cookie.get('selected-player') || null,
      network: false
    }

    this.newplayer = this.newplayer.bind(this)
    this.resolvefight = this.resolvefight.bind(this)
    this.schedulefight = this.schedulefight.bind(this)
    this.removefight = this.removefight.bind(this)
    this.announcefight = this.announcefight.bind(this)
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

  createCandidate(id, p1slug, p2slug, callback) {
    if (p1slug && p2slug)
      this.setState({ resolveCandidate: { id: id, p1slug: p1slug, p2slug: p2slug } }, () => callback && callback())
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
    const { winner, score, date, result, id } = data
    const json = JSON.stringify({ id: id, p1slug: p1slug, p2slug: p2slug, winner: winner, score: score, date: date, result: result })
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

  schedulefight(p1slug, p2slug) {
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

  removefight(id) {
    const json = JSON.stringify({ id: id })
    const params = {
      method: 'post',
      body: json,
      headers: { 'Content-Type': 'application/json' }
    }
    this.setState({ network: true })

    return fetch(`${api}/removefight`, params)
      .then(() => this.useApi('schedule'))
      .then(() => this.setState({ network: false }))
  }

  announcefight(player1, player2) {
    const json = JSON.stringify({ player1: player1, player2: player2 })
    const params = {
      method: 'post',
      body: json,
      headers: { 'Content-Type': 'application/json' }
    }
    return fetch(`${api}/announcefight`, params)
  }

  highlightPlayer(playerslug) {
    const highlight = this.state.highlight
    const result = (highlight === playerslug) ? null : playerslug

    this.setState({ highlight: result })
    cookie.set('selected-player', result, { expires: 1337 })
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

    let scene

    if (screen === 'DASHBOARD') {
      scene = (
        <Dashboard
          key="Dashboard"
          schedule={schedule}
          matches={matches}
          players={players}
          network={network}
          matchplayed={this.matchplayed}
          newplayer={this.newplayer}
          setscreen={this.setscreen}
          highlightPlayer={this.highlightPlayer}
          createCandidate={this.createCandidate}
          removefight={this.removefight}
          api={api}
          error={error}
          highlight={highlight} />
        )
    }
    if (screen === 'UTMANING') {
      scene = (
        <Utmaning
          key="Utmaning"
          players={players}
          fight
          setscreen={this.setscreen}
          schedulefight={this.schedulefight}
          createCandidate={this.createCandidate}
          announcefight={this.announcefight}
          network={network}
          highlight={highlight} />
      )
    }
    if (screen === 'RAPPORTERA') {
      scene = (
        <Rapportera
          key="Rapportera"
          players={players}
          setscreen={this.setscreen}
          resolvefight={this.resolvefight}
          resolveCandidate={resolveCandidate} />
      )
    }

    if (screen === 'MATCHER') {
      scene = (
        <Matcher
          key="Matcher"
          players={players}
          setscreen={this.setscreen}
          highlight={highlight}
          matches={matches} />
      )
    }

    return [
      scene,
      <Preloader key="Preloader" />
    ]
  }
}

export default App
