import React from 'react'

export function Mugshot({playerslug}) {
  return (
    <img src={`mugshots/${playerslug}.jpg`} width="25" height="25" className="mugshot" alt="Mugshot" />
  )
}

export function Icon({name, large, small}) {
  let size = '32'
  if (large) {
    size = '45'
  }
  if (small) {
    size = '15'
  }
  return (
    <img
      src={`heroes/${slug(name)}.png`}
      className="character-icon"
      alt={name}
      width={size}
      height={size} />
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


export function leftpad(str) {
  if (str.length === 1) {
    return `0${str}`
  }
  return str
}


export function getPlayerAbove(players, playerslug) {
  const current = players.findIndex(({name}) => slug(name) === playerslug)
  const result = current-1
  return result === -1 ? 1 : result
}
