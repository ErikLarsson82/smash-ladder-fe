import React from 'react'
import { QcIcon, Mugshot, Icon } from './helpers'

export default class PlayerRow extends React.Component {
  componentDidMount() {
    const { playerslug, idx } = this.props
    const refStr = `${playerslug}-row`
    setTimeout( () => {
      this.refs[refStr] && this.refs[refStr].classList.add('fade-in')
    }, 50 * idx)
  }
  render() {
    const {playerslug, name, main, secondary, qc, idx, highlight, highlightPlayer} = this.props
    const odd = idx % 2 === 0 ? 'odd' : ''
    const highlightClass = playerslug === highlight ? 'highlight' : ''
    const qcIcons = qc.map(x => <QcIcon key={`${name}-${x}`} place={x} />)
    const refStr = `${playerslug}-row`
    return (
      <tr
        ref={refStr}
        className={[highlightClass, 'player-row', odd].join(' ')}
        onClick={() => highlightPlayer(playerslug)}>
        <td><div className="placement">{idx+1}</div></td>
        <td><Mugshot name={name} />{name}{ qcIcons.length > 0 && qcIcons}</td>
        <td><Icon name={main} />{main}</td>
        <td>{secondary && <Icon name={secondary} />}{secondary}</td>
      </tr>
    )
  }
}
