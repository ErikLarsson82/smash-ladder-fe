import React from 'react'
import { QcIcon, Mugshot, Icon } from './helpers'

export default function PlayerRow({playerslug, name, main, secondary, qc, idx, highlight, highlightPlayer}) {
  const odd = idx % 2 === 0 ? 'odd' : ''
  const highlightClass = playerslug === highlight ? 'highlight' : ''
  const qcIcons = qc.map(x => <QcIcon key={`${name}-${x}`} place={x} />)
  return (
    <tr
      className={[highlightClass, 'player-row', odd].join(' ')}
      onClick={() => highlightPlayer(playerslug)}>
      <td><div className="placement">{idx+1}</div></td>
      <td><Mugshot name={name} />{name}{ qcIcons.length > 0 && qcIcons}</td>
      <td><Icon name={main} />{main}</td>
      <td>{secondary && <Icon name={secondary} />}{secondary}</td>
    </tr>
  )
}

