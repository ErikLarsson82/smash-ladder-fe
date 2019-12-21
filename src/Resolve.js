import React, { useState } from 'react'
import Back from './Back'
import { slug, Icon } from './helpers'
import Button from '@material-ui/core/Button'
import { StylesProvider } from '@material-ui/core/styles'

export default function Resolve(props) {
  const { resolvefight, setscreen, resolveCandidate, players } = props

  const [result, setResult] = useState([])

  if (!resolveCandidate) return null

  const { p1slug, p2slug } = resolveCandidate

  const p1count = result.filter(x => x === 'p1').length
  const p2count = result.filter(x => x === 'p2').length
  const valid = result.length === 3 || p1count === 2 || p2count === 2
  const winner = p1count > p2count ? 'p1' : 'p2'
  const scoreSet = `${p1count} - ${p2count}`

  const reset = () => setResult([])
  const set = player => {
    if (valid && winner)
      return
    setResult(result.concat(player))
  }
  const done = () => {
    const fight = {
      p1slug: p1slug,
      p2slug: p2slug,
      result: result,
      date: new Date().toISOString()
    }
    resolvefight(fight)
      .then(() => setscreen('LADDER'))
  }

  const { name, main } = players.find(x => x.playerslug === (winner === 'p1' ? p1slug : p2slug))

  const imgLeft = `battle-stance/rightfacing/${slug(players.find(x => x.playerslug === p1slug).main)}.png`
  const imgRight = `battle-stance/leftfacing/${slug(players.find(x => x.playerslug === p2slug).main)}.png`

  return (
    <div className="resolvefight vertical-spacer">
      <Back setscreen={setscreen} />
      <h1>Rapportera</h1>
      <div className="matchup-large-portraits">
        <img alt="p1" onClick={() => set('p1')} src={ imgLeft } className={ ['character-portrait', valid && winner === 'p2' ? 'dim' : ''].join(' ')} />
        <img alt="p2" onClick={() => set('p2')} src={ imgRight } className={ ['character-portrait', valid && winner === 'p1' ? 'dim' : ''].join(' ')} />
      </div>
      <input type="button" value="Reset" onClick={reset} />
      {
        new Array(3).fill().map((_, idx) => {
          const player = result[idx]
          if (!player) return <div className="icon-placeholder" />
          const classNames = ["resolve-icon"].concat(idx !== 0 ? 'middle' : '')
          return player === 'p1'
              ? <div key={`${player}-${idx}`} className={classNames.concat('left').join(' ')}><Icon large name={players.find(x => x.playerslug === p1slug).main} /></div>
              : <div key={`${player}-${idx}`} className={classNames.concat('right').join(' ')}><Icon large name={players.find(x => x.playerslug === p2slug).main} /></div>
          }
        )
      }
      <h2>{ (valid && winner && `Vinnare: ${name} med ${main}`) || `Vem vann?`}</h2>
      <h1>{ scoreSet }</h1>
      <StylesProvider injectFirst>
        <Button className="button" variant="contained" color="primary" disabled={!(valid && winner)} onClick={ done }>
          Ok
        </Button>
      </StylesProvider>
    </div>
  )
}
