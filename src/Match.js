import React from 'react'
import { Icon } from './helpers'
import Trend from './Trend'

export default function Match(props) {
  const { players, matchData, highlight, setLocatePlayers, spacey, wide, callback } = props
  const { p1slug, p2slug, p1trend, p2trend, result, date } = matchData

  const find1 = x => x.playerslug === p1slug
  const find2 = x => x.playerslug === p2slug
  const p1 = players.find(find1) || {}
  const p2 = players.find(find2) || {}

  const classNames = ['resolved-container']
    .concat(spacey ? 'spacers' : '')
    .concat(wide ? 'wide' : '')

  const autobreak = name => <React.Fragment>{name.split(' ')[0]}<br />{name.split(' ')[1]}</React.Fragment>

  const leftpad = number => number.toString().length === 1 ? `0${number}` : number
  const formatDate = date => `${leftpad(date.getDate())}-${leftpad(date.getMonth()+1)}-${date.getFullYear()}` 

  return (
    <div
      className={ classNames.join(' ') }
      onMouseEnter={() => setLocatePlayers && setLocatePlayers([p1slug, p2slug]) }
      onMouseLeave={() => setLocatePlayers && setLocatePlayers([]) }
      onClick={callback}>
      { wide && <div key="p1-name" className="p1-name">{ autobreak(p1.name) }</div> }
      { wide && <div key="p2-name" className="p2-name">{ autobreak(p2.name) }</div> }
      { wide && <div key="date" className="date">{ formatDate(new Date(date)) }</div> }
      <div className="icon-box">
        <Icon large player={p1.name} name={p1.main} highlight={p1slug === highlight} /> vs. <Icon large player={p2.name} name={p2.main} highlight={p2slug === highlight} />
      </div>
      <div className="score-box">
        <Trend amount={p1trend} />
        {`${result.filter(x=>x==='p1').length} - ${result.filter(x=>x==='p2').length}`}
        <Trend amount={p2trend} />
      </div>
    </div>
  )
}