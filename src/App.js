import React from 'react'
import fetch from 'node-fetch'
import './App.css'
import Ladder from './Ladder'
import Challonge from './Challonge'
import Resolve from './Resolve'

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
    this.highlightPlayer = this.highlightPlayer.bind(this)
    this.setError = this.setError.bind(this)
  }

  componentDidMount() {
    this.updatePlayers()
    this.updateMatches()
    this.updateSchedule()
  }

  setscreen(screen, p1slug, p2slug) {
    this.setState({ screen: screen })
    if (p1slug && p2slug)
      this.setState({ resolveCandidate: { p1slug: p1slug, p2slug: p2slug} })
  }

  updatePlayers() {
    fetch('http://localhost:3500/players')
      .then(res => res.json())
      .then(res => this.setState({players: res}))
      .catch(() => this.setState({error: true}))
  }

  setError() {
    this.setState({error: true})
  }

  updateMatches() {
    fetch('http://localhost:3500/matches')
      .then(res => res.json())
      .then(res => this.setState({matches: res}))
      .catch(() => this.setState({error: true}))
  }

  updateSchedule() {
    fetch('http://localhost:3500/schedule')
      .then(res => res.json())
      .then(res => this.setState({ schedule: res}))
      .catch(() => this.setState({error: true}))
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
    const { p1slug, p2slug } = this.state.resolveCandidate
    const { winner, score, date } = data
    const json = JSON.stringify({ p1slug: p1slug, p2slug: p2slug, winner: winner, score: score, date: date })
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
          updateMatches={this.updateMatches}
          updateSchedule={this.updateSchedule}
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
