import React from 'react'
import { slug, getPlayerAbove, Icon } from './helpers'
import CircularProgress from '@material-ui/core/CircularProgress'
import Back from './Back'

export default class Challonge extends React.Component {
  constructor(props) {
    super(props)

    const { highlight, players } = props

    const p1slug = highlight && slug(highlight)

    const p2slug = highlight && slug(players[getPlayerAbove(players, slug(highlight))].name)

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
    const { fight, players, setscreen, scheduleFight, createCandidate, network } = this.props
    const { p1slug, p2slug } = this.state

    const showFight = p1slug && p2slug && (p1slug !== p2slug)

    const done = () => {
      if (network) return

      if (fight) {
        setTimeout(() => {
          createCandidate(p1slug, p2slug, () => setscreen('RESOLVE'))
        }, 500)
      } else {
        scheduleFight(p1slug, p2slug)
          .then(() => setscreen('LADDER'))
      }
    }

    //<img src="utmaning.png" width="238" height="65" alt="Utmaning" />
    return (
      <div className="challonge vertical-spacer">
        <Back setscreen={setscreen} />
        <div className="centered small">
          {
            fight
              ? 'Slåss'
              : 'Schemalägg'
          }
        </div>
        <div className="challonge-container large">
          <table className="challange-player-list">
            <tbody>
              <tr>
                <th className="right">#</th>
                <th></th>
                <th>Challanger</th>
              </tr>
              {
                players.map(({playerslug, name, main}, idx) => {
                  const selected = p1slug === playerslug ? 'selected' : ''
                  return (
                    <tr key={`${name}-left`} className={[selected].concat('player-list').join(' ')} onClick={() => this.setState({p1slug: playerslug})}>
                      <td className="right mono">
                        {`${(idx+1).toString()}.`}
                      </td>
                      <td className="icon">
                        <Icon small name={main} />
                      </td>
                      <td>
                        {name}
                      </td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
          <div className="spacer">
            <img className="vs-logo" src="player-versus-player.png" alt="VS" />
          </div>
          <table className="challange-player-list">
            <tbody>
              <tr>
                <th className="right">#</th>
                <th></th>
                <th>Challanger</th>
              </tr>
              {
                players.map(({playerslug, name, main}, idx) => {
                  const selected = p2slug === playerslug ? 'selected' : ''
                  return (
                    <tr key={`${name}-left`} className={[selected].concat('player-list').join(' ')} onClick={() => this.setState({p2slug: playerslug})}>
                      <td className="right mono">
                        {`${(idx+1).toString()}.`}
                      </td>
                      <td className="icon">
                        <Icon small name={main} />
                      </td>
                      <td>
                        {name}
                      </td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
        </div>
        <div className="centered fixed relative small">
          {
            (p1slug) && (p2slug) && (p1slug === p2slug) && (
              <img className="derp" src="spicy-memelord.png" alt="Till dig batsis ;)" />
            )
          }
          {
            network === true && showFight && (
              <CircularProgress className="loader-position" color="secondary" />
            )
          }
          <img
            src="fight.png"
            alt="Slåss"
            className={ [showFight ? '' : 'invisible', 'button'].join(' ') }
            onClick={ done } />
        </div>
      </div>
    )
  }

}

