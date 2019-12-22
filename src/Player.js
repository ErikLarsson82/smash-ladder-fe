import React from 'react'
import { QcIcon, Mugshot, Icon } from './helpers'
import KeyboardArrowUpTwoToneIcon from '@material-ui/icons/KeyboardArrowUpTwoTone'
import KeyboardArrowDownTwoToneIcon from '@material-ui/icons/KeyboardArrowDownTwoTone'
import ArrowRightAltTwoToneIcon from '@material-ui/icons/ArrowRightAltTwoTone'
import DoubleArrowIcon from '@material-ui/icons/DoubleArrow'
import { StylesProvider } from '@material-ui/core/styles'

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
      <td className="center">
        <StylesProvider injectFirst>
          {trendIcon(trend)}
        </StylesProvider>
      </td>
      <td><div className="placement">{idx+1}.</div></td>
      <td><Mugshot playerslug={playerslug} />{name}{ qcIcons.length > 0 && qcIcons}</td>
      <td><Icon name={main} /></td>
      <td>{secondary && <Icon name={secondary} />}</td>
    </tr>
  )
}

function trendIcon(trend) {
  if (trend > 1)
    return <DoubleArrowIcon className="trend-up double-up" />

  if (trend > 0)
    return <KeyboardArrowUpTwoToneIcon className="trend-up" />

  if (trend < -1)
    return <DoubleArrowIcon className="trend-down double-down" />

  if (trend < 0)
    return <KeyboardArrowDownTwoToneIcon className="trend-down" />

  return <ArrowRightAltTwoToneIcon className="unchanged" />
}