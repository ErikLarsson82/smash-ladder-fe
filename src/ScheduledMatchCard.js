import React from 'react'

export default function ScheduledMatchCard(props) {
  const {p1slug, p2slug, date, createCandidate, setscreen, players } = props

  const now = new Date().getTime()
  const fadeIn = now - new Date(date).getTime() < 5000 ? 'fade-in shake' : ''
  const callback = () => createCandidate(p1slug, p2slug, () => setscreen('RAPPORTERA'))

  const find1 = x => x.playerslug === p1slug
  const find2 = x => x.playerslug === p2slug

  const name1 = players.find(find1) && players.find(find1).name
  const name2 = players.find(find2) && players.find(find2).name

  const classNames = ['match-card'].concat(fadeIn).join(' ')

  return (
    <div onClick={callback} className={classNames}>
      <div className="match-card-name p1">{name1}</div>
      <div className="match-card-name p2">{name2}</div>
      <img alt="p1" src="battle-stance/rightfacing/ike.png" className="match-card-character left" />
      <img alt="p2" src="battle-stance/leftfacing/mega-man.png" className="match-card-character right" />
      <img className="match-card-vs-logo" src="player-versus-player.png" alt="VS" />
    </div>
  )
}