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

  function getPlayerName(player){
    return player.name !== undefined ? player.name.substring(0, player.name.indexOf(" ") + 2) : "";
  }

  return (
    <div onClick={callback} className='match-card' onMouseEnter={() => setLocatePlayers([p1slug, p2slug])} onMouseLeave={() => setLocatePlayers([])}>
      <StylesProvider injectFirst>
        <CancelIcon className="remove-match" onClick={remove} />
      </StylesProvider>
      <img alt="p1" src={`battle-stance/rightfacing/${slug(p1.main)}.png`} className="match-card-character left"/>
      <img alt="p2" src={`battle-stance/rightfacing/${slug(p2.main)}.png`} className="match-card-character right"/>
      <div className="match-card-background-container">
        <div className="match-card-background p1"/>
        <div className="match-card-background p2"/>
      </div>
      <div className="match-card-name p1">{getPlayerName(p1)}</div>
      <div className="match-card-name p2">{getPlayerName(p2)}</div>
      <div className="match-card-vs-text">vs</div>
    </div>
  )
}
