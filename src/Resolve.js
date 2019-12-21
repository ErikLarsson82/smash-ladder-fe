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
      <div className="centered small">
        <h1>Rapportera</h1>
      </div>
      <div className="large">
        <input type="button" value="Reset" onClick={reset} />
        <div className="matchup-large-portraits">
          <img alt="p1" onClick={() => set('p1')} src={ imgLeft } className={ ['character-portrait', valid && winner === 'p2' ? 'dim' : ''].join(' ')} />
          <img alt="p2" onClick={() => set('p2')} src={ imgRight } className={ ['character-portrait', valid && winner === 'p1' ? 'dim' : ''].join(' ')} />
        </div>
      </div>
      <div className="matchup-icons">
        {
          result.map((player, idx) =>
              player === 'p1'
                ? <div key={`${player}-${idx}`} className="left-icon"><Icon name={players.find(x => x.playerslug === p1slug).main} /></div>
                : <div key={`${player}-${idx}`} className="right-icon"><Icon name={players.find(x => x.playerslug === p2slug).main} /></div>
          )
        }
      </div>
      <div className="winner-text">
        <h2>{ (valid && winner && `Vinnare: ${name} med ${main}`) || `Vem vann?`}</h2>
      </div>
      <div className="scoreset">
        <h2>{ scoreSet }</h2>
      </div>
      <StylesProvider injectFirst>
        <Button className="button" variant="contained" color="primary" onClick={ done }>
          Ok
        </Button>
      </StylesProvider>
    </div>
  )
}
