import React from 'react'
import { QcIcon, Mugshot, Icon } from './helpers'
import Trend from './Trend'

export default function PlayerRow(props) {
  const { delay, playerslug, name, main, secondary, trend, qc, idx, highlight, highlightPlayer } = props
  const hasHighlight = playerslug === highlight
  const qcIcons = qc.map(x => <QcIcon key={`${name}-${x}`} place={x} />)
  const odd = idx % 2 === 0
  const alternate = odd ? 'odd' : 'even'
  const fadeIn = odd ? 'fade-in-odd' : 'fade-in-even'

  const startClass = hasHighlight
    ? 'highlight'
    : alternate

  const delayedClass = hasHighlight
    ? 'fade-in-highlight'
    : fadeIn

  return (
    <tr
      className={[startClass].concat(delay ? delayedClass : []).join(' ')}
      onClick={() => highlightPlayer(playerslug)}>
      <td style={ { textAlign: 'center' } }>
        <Trend amount={trend} />
      </td>
      <td style={ { paddingLeft: '0', textAlign: 'right' } }>
        {idx+1}.
      </td>
      <td>
        <Mugshot playerslug={playerslug} />
      </td>
      <td>
        {name}{ qcIcons.length > 0 && qcIcons}
      </td>
      <td>
        <Icon name={main} />
      </td>
      <td>
        {secondary && <Icon name={secondary} />}
      </td>
    </tr>
  )
}
