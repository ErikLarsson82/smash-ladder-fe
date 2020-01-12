import React from 'react'

export function Mugshot({playerslug}) {
  return (
    <img src={`mugshots/${playerslug}.jpg`} width="25" height="25" className="mugshot" alt="Mugshot" />
  )
}

export function Icon({name, player, large, small, highlight}) {
  let size = 32
  if (large) {
    size = 45
  }
  if (small) {
    size = 15
  }
  return (
    <div className="relative" style={ {width: size, height: size} }>
      {
        highlight && (
          <img
            src={`heroes/shadow.png`}
            className="character-icon shadow"
            alt={name}
            title={player}
            width={size * 1.2}
            height={size * 1.2} />
        )
      }
      <img
        src={`heroes/${slug(name)}.png`}
        className="character-icon"
        alt={name}
        title={player}
        width={size}
        height={size} />
    </div>
  )
}

export function slug(str) {
  if (!str) return null
  return str.replace(/ /g, '-')
    .replace(/\./g, '')
    .replace(/[äÄ]/g, 'a')
    .replace(/[åÅ]/g, 'a')
    .replace(/[öÖ]/g, 'o')
    .replace(/è/g, 'e')
    .toLowerCase()
}


export function QcIcon({place}) {
  return <img src={`qc-${place}.png`} className="qc-icon" width="10" height="10" alt="Plats" />
}
