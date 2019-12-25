import React from 'react'
import { slug, Icon } from './helpers'
import CircularProgress from '@material-ui/core/CircularProgress'
import Back from './Back'
import Button from '@material-ui/core/Button'
import { StylesProvider } from '@material-ui/core/styles'

// eslint-disable-next-line
import startAnimation from './startAnimation'

export default class Utmaning extends React.Component {
  constructor(props) {
    super(props)

    const { highlight, players } = props

    const p1slug = highlight && slug(highlight)

    let p2slug = null

    if (highlight) {
      const highlightRank = players.find(player => player.playerslug === slug(highlight)).rank
      p2slug = players.find(player => player.rank === (highlightRank === 1 ? 2 : highlightRank - 1)).playerslug
    }

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
      const player = players.find(player => player.playerslug === p1slug)
      const highlightRank = player && player.rank
      const next = players.find(player => player.rank === (highlightRank === 1 ? 2 : highlightRank - 1))
      this.setState({ p2slug: next.playerslug })
    }
  }

  render() {
    const { players, setscreen, scheduleFight, createCandidate, network } = this.props
    const { p1slug, p2slug, spam } = this.state

    const showFight = p1slug && p2slug && (p1slug !== p2slug)

    const derp = (p1slug) && (p2slug) && (p1slug === p2slug)

    const book = () => {
      if (network || spam) return

      this.setState({spam: true})

      scheduleFight(p1slug, p2slug)
        .then(() => setscreen('DASHBOARD'))
    }

    const fight = () => {
      if (network || spam) return

      this.setState({spam: true})

      setTimeout(() => {
        const p1 = players.find(x => x.playerslug === p1slug) || {}
        const p2 = players.find(x => x.playerslug === p2slug) || {}
        startAnimation(p1, p2)
      }, 250)

      setTimeout(() => {
        createCandidate(p1slug, p2slug, () => setscreen('RAPPORTERA'))
      }, 2250)
    }

    return (
      <div className="fit-to-screen-height background blue">
        <Back setscreen={setscreen} />
        <h1>Utmaning</h1>
        <div className="challonge-container">
          <table className="challange-player-list">
            <tbody>
              <tr>
                <th className="right">#</th>
                <th></th>
                <th>Challanger</th>
              </tr>
              {
                players.map(x=>x).sort((a, b) => a.rank > b.rank ? 1 : -1).map(({playerslug, name, main}, idx) => {
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
                <th>Challangee</th>
              </tr>
              {
                players.map(x=>x).sort((a, b) => a.rank > b.rank ? 1 : -1).map(({playerslug, name, main}, idx) => {
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
        <div className="button-holder">
          {
            derp && (
              <img className="derp" src="spicy-memelord.png" alt="Till dig batsis ;)" title="Erumenubatsis!?" />
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
                <Button className="button" variant="contained" color="primary" disabled={ !showFight } onClick={ fight }>
                  Slåss
                </Button>
              </StylesProvider>
            )
          }
          { !derp && (
              <StylesProvider injectFirst>
                <Button className="button" variant="contained" color="primary" disabled={ !showFight } onClick={ book }>
                  Boka
                </Button>
              </StylesProvider>
            )
          }
        </div>
      </div>
    )
  }
}

