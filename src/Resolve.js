import React, { useState } from 'react'
import Back from './Back'

export default function Resolve(props) {
  const { resolvefight, setscreen, resolveCandidate, players } = props
  const { p1slug, p2slug } = resolveCandidate

  const [result, setResult] = useState([])

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
    setscreen('LADDER')
  }

  const { name, main } = players.find(x => x.playerslug === (winner === 'p1' ? p1slug : p2slug))

  const imgLeft = `battle-stance/rightfacing/${players.find(x => x.playerslug === p1slug).main}.png`
  const imgRight = `battle-stance/leftfacing/${players.find(x => x.playerslug === p2slug).main}.png`

  return (
    <div className="resolvefight vertical-spacer">
      <Back setscreen={setscreen} />
      <div className="centered small">
        <h1>Resultat</h1>
      </div>
      <div className="large">
        <input type="button" value="Reset" onClick={reset} />
        <div className="matchup-large-portraits">
          <img alt="p1" onClick={() => set('p1')} src={ imgLeft } className={ valid && winner === 'p2' ? 'dim' : ''} />
          <img alt="p2" onClick={() => set('p2')} src={ imgRight } className={ valid && winner === 'p1' ? 'dim' : ''} />
        </div>
      </div>
      <div className="matchup-icons">
        {
          result.map((player, idx) => {
            return (
              <div key={`${player}${idx}`}>
                {
                  player === 'p1' ? <div>{'<-'}</div> : <div>{'->'}</div>
                }
               {
                idx >= result.length && <hr />
               }
              </div>
            )
          })
        }
      </div>
      <div className="winner-text">
        <h1>{ valid && winner && `Vinnare: ${name} med ${main}`}</h1>
      </div>
      <div className="scoreset">
        <h1>{ scoreSet }</h1>
      </div>
      <div className="centered small">
        {
          valid && winner && (
            <img alt="resolve" onClick={done} key="resolve" src="resolve.png" />
          )
        }
      </div>
    </div>
  )
}
