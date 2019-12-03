import React from 'react'

export default class Resolve extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      result: []
    }
  }

  render() {
    const { resolvefight, setscreen, resolveCandidate } = this.props
    const { result } = this.state
    const { p1slug, p2slug } = resolveCandidate

    const p1count = result.filter(x => x === 'p1').length
    const p2count = result.filter(x => x === 'p2').length
    const valid = result.length === 3 || p1count === 2 || p2count === 2
    const winner = p1count > p2count ? 'p1' : 'p2'
    const scoreSet = `${p1count} - ${p2count}`

    const reset = () => this.setState({ result: [] })
    const set = player => {
      if (valid && winner)
        return
      this.setState({ result: result.concat(player) })
    }
    return (
      <div className="resolvefight">
        <h2>Resultat</h2>
        <img alt="p1" onClick={() => set('p1')} src="p1.png" className={ valid && winner === 'p2' ? 'dim' : ''} />
        <input type="button" value="Reset" onClick={reset} />
        <img alt="p2" onClick={() => set('p2')} src="p2.png" className={ valid && winner === 'p1' ? 'dim' : ''} />
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
        { scoreSet }
        {
          valid && winner && (
            <img alt="resolve" onClick={() => { setscreen('LADDER'); resolvefight({p1slug: p1slug, p2slug: p2slug, result: result, date: new Date().toISOString() }) } } key="resolve" src="resolve.png" />
          )
        }
      </div>
    )
  }
}
