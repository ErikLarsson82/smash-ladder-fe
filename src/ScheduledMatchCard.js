import React from 'react'
import { slug } from './helpers'

export default function ScheduledMatchCard(props) {
  const {p1slug, p2slug, date, createCandidate, setscreen, players } = props

  const now = new Date().getTime()
  const fadeIn = now - new Date(date).getTime() < 5000 ? 'fade-in shake' : ''
  const callback = () => createCandidate(p1slug, p2slug, () => setscreen('RAPPORTERA'))

  const find1 = x => x.playerslug === p1slug
  const find2 = x => x.playerslug === p2slug

  const p1 = players.find(find1) || {}
  const p2 = players.find(find2) || {}

  const classNames = ['match-card'].concat(fadeIn).join(' ')

  return (
    <div onClick={callback} className={classNames}>
      <div className="match-card-name p1">{p1.name}</div>
      <div className="match-card-name p2">{p2.name}</div>
      <img alt="p1" src={`battle-stance/rightfacing/${slug(p1.main)}.png`} className="match-card-character left" />
      <img alt="p2" src={`battle-stance/leftfacing/${slug(p2.main)}.png`} className="match-card-character right" />
      <img className="match-card-vs-logo" src="player-versus-player.png" alt="VS" />
    </div>
  )
}