import React from 'react'
import { slug, getPlayerAbove, Icon } from './helpers'
import CircularProgress from '@material-ui/core/CircularProgress'
import Back from './Back'
import Button from '@material-ui/core/Button'
import { StylesProvider } from '@material-ui/core/styles'

// eslint-disable-next-line
import startAnimation from './startAnimation'

export default class Challonge extends React.Component {
  constructor(props) {
    super(props)

    const { highlight, players } = props

    const p1slug = highlight && slug(highlight)

    const p2slug = highlight && slug(players[getPlayerAbove(players, slug(highlight))].name)

    this.state = {
      p1slug: p1slug,
      p2slug: p2slug,
      spam: false
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
    const { p1slug, p2slug, spam } = this.state

    const showFight = p1slug && p2slug && (p1slug !== p2slug)

    const derp = (p1slug) && (p2slug) && (p1slug === p2slug)

    const done = () => {
      if (network || spam) return

      this.setState({spam: true})

      if (fight) {

        setTimeout(() => {
          startAnimation()        
        }, 250)

        setTimeout(() => {
          createCandidate(p1slug, p2slug, () => setscreen('RESOLVE'))
        }, 2250)

      } else {
        scheduleFight(p1slug, p2slug)
          .then(() => setscreen('LADDER'))
      }
    }

    return (
      <div className="challonge fit-to-screen-height">
        <Back setscreen={setscreen} />
        <h1>
          {
            fight
              ? 'Utmaning'
              : 'Schemalägg'
          }
        </h1>
        <div className="challonge-container">
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
        <div>
          {
            derp && (
              <img className="derp" src="spicy-memelord.png" alt="Till dig batsis ;)" />
            )
          }
          {
            //This code doesnt run
            network === true && showFight && (
              <CircularProgress className="loader-position" color="secondary" />
            )
          }
          { !derp && (
              <StylesProvider injectFirst>
                <Button className="button" variant="contained" color="primary" disabled={ !showFight } onClick={ done }>
                  Slåss
                </Button>
              </StylesProvider>
            )
          }
        </div>
      </div>
    )
  }
}

