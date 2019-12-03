import React from 'react'
import { slug, getPlayerAbove, leftpad, Icon } from './helpers'

export default class Challonge extends React.Component {
  constructor(props) {
    super(props)

    const { highlight, players } = props

    const p1slug = highlight === "null" || highlight === null
      ? null
      : slug(highlight)

    const p2slug = highlight === "null" || highlight === null
      ? null
      : slug(players[getPlayerAbove(players, slug(highlight))].name)

    this.state = {
      p1slug: p1slug,
      p2slug: p2slug
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { p1slug, p2slug } = this.state
    const { players } = this.props

    if (prevState.p1slug === null && p1slug !== null && p2slug === null) {
      this.setState({ p2slug: slug(players[getPlayerAbove(players, p1slug)].name) })
    }
  }

  render() {
    const { players, setscreen, updateMatches, updateSchedule } = this.props
    const { p1slug, p2slug } = this.state

    const fightButton = () => {

      const json = JSON.stringify({ p1slug: p1slug, p2slug: p2slug, date: new Date().toISOString() })
      const params = {
        method: 'post',
        body: json,
        headers: { 'Content-Type': 'application/json' }
      }
      fetch('http://localhost:3500/schedulefight', params)
        .then(updateMatches)
        .then(updateSchedule)
        .then(() => setscreen('LADDER'))
    }

    return (
      <div className="challonge">
        <div onClick={() => setscreen('LADDER')} className="back">X</div>
        <div className="centered">
          <img src="utmaning.png" width="238" height="65" alt="Utmaning" />
        </div>
        <div className="challonge-container">
          <div className="spacer">
            <h2 className="player-heading">Challanger</h2>
            {
              players.map(({name, main}, idx) => {
                const selected = p1slug === slug(name) ? 'selected' : ''
                return (
                  <div key={`${name}-left`} className={[selected].concat('player-list').join(' ')} onClick={() => this.setState({p1slug: slug(name)})}>
                    {`${leftpad((idx+1).toString())}. `}<Icon small name={main} />{name}
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
              players.map(({name, main}, idx) => {
                const selected = p2slug === slug(name) ? 'selected' : ''
                return (
                  <div key={`${name}-left`} className={[selected].concat('player-list').join(' ')} onClick={() => this.setState({p2slug: slug(name)})}>
                    {`${leftpad((idx+1).toString())}. `}<Icon small name={main} />{name}
                  </div>
                )
              })
            }
          </div>
        </div>
        <div className="centered fixed">
          {
            (p1slug) && (p2slug) && (p1slug === p2slug) && (
              <img className="derp" src="spicy-memelord.png" alt="Till dig batsis ;)" />
            )
          }
          <img
            src="fight.png"
            alt="Slåss"
            className={ [p1slug && p2slug && (p1slug !== p2slug) ? '' : 'invisible', 'button'].join(' ') }
            onClick={fightButton} />
        </div>
      </div>
    )
  }

}

