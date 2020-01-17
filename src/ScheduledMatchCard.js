import React from 'react'
import { slug } from './helpers'
import CancelIcon from '@material-ui/icons/Cancel'
import { StylesProvider } from '@material-ui/core/styles'

export default function ScheduledMatchCard(props) {
  const {p1slug, p2slug, id, createCandidate, setscreen, players, removefight, setLocatePlayers } = props

  const callback = () => createCandidate(id, p1slug, p2slug, () => setscreen('RAPPORTERA'))

  const find1 = x => x.playerslug === p1slug
  const find2 = x => x.playerslug === p2slug

  const p1 = players.find(find1) || {}
  const p2 = players.find(find2) || {}

  const remove = e => {
    e.stopPropagation()
    removefight(id)
  }
  return (
    <div onClick={callback} className="match-card" onMouseEnter={() => setLocatePlayers([p1slug, p2slug]) } onMouseLeave={() => setLocatePlayers([]) }>
      <StylesProvider injectFirst>
        <CancelIcon className="remove-match" onClick={remove} />
      </StylesProvider>
      <div className="match-card-name p1">{p1.name}</div>
      <div className="match-card-name p2">{p2.name}</div>
      <img alt="p1" src={`battle-stance/rightfacing/${slug(p1.main)}.png`} className="match-card-character left" />
      <img alt="p2" src={`battle-stance/leftfacing/${slug(p2.main)}.png`} className="match-card-character right" />
      <img className="match-card-vs-logo" src="player-versus-player.png" alt="VS" />
    </div>
  )
}
