import React from 'react'
import { Icon } from './helpers'
import Trend from './Trend'

export default function Match(props) {
  const { players, matchData, highlight } = props
  const { p1slug, p2slug, p1trend, p2trend, result } = matchData

  const find1 = x => x.playerslug === p1slug
  const find2 = x => x.playerslug === p2slug
  const p1 = players.find(find1) || {}
  const p2 = players.find(find2) || {}

  return (
    <div className="resolved-container">
      <div className="icon-box">
        <Icon large player={p1.name} name={p1.main} highlight={p1slug === highlight} /> vs. <Icon large player={p2.name} name={p2.main} highlight={p2slug === highlight} /><br />
      </div>
      <div className="score-box">
        <Trend amount={p1trend} />
        {`${result.filter(x=>x==='p1').length} - ${result.filter(x=>x==='p2').length}`}
        <Trend amount={p2trend} />
      </div>
    </div>
  )
}