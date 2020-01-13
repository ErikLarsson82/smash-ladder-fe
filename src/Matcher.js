import React, { useState } from 'react'
import Match from './Match'
import { groupBy } from 'ramda'
import Back from './Back'

export default function Matcher(props) {
  const { players, matches, highlight, setscreen } = props

  const [large, setLarge] = useState([])
  
  const today = new Date()
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate()-1)

  const same = (x, y) => x.getDate() === y.getDate() && x.getMonth() === y.getMonth() && x.getYear() === y.getYear()

  const dateDivider = ({ date }) => {
    if (same(new Date(date), today))
      return 'today'
    if (same(new Date(date), yesterday))
      return 'yesterday'

    return 'rest'
  }

  const groupedMatches = groupBy(dateDivider, matches)

  return (
    <div className="fit-to-screen-height background orange">
      <Back setscreen={setscreen} />
      {
        groupedMatches.today && [
          <h1 key="today-heading">Idag</h1>,
          <div key="today-content" className="matches-container">
            {
              groupedMatches.today.map(x => x).reverse().map(matchData =>
                <Match
                    key={`${matchData.p1slug}-${matchData.p2slug}-${matchData.date}-match`}
                    wide={large.includes(matchData.date)}
                    callback={() => setLarge( large.includes(matchData.date) ? large.filter(x=>x!==matchData.date) : large.concat(matchData.date) )}
                    spacey
                    highlight={highlight}
                    matchData={matchData}
                    players={players} />
              )
            }
          </div>
        ]
      }
      {
        groupedMatches.yesterday && [
          <h1 key="yesterday-heading">Igår</h1>,
          <div key="yesterday-content" className="matches-container">
            {
              groupedMatches.yesterday.map(x => x).reverse().map(matchData =>
                <Match
                    key={`${matchData.p1slug}-${matchData.p2slug}-${matchData.date}-match`}
                    wide={large.includes(matchData.date)}
                    callback={() => setLarge( large.includes(matchData.date) ? large.filter(x=>x!==matchData.date) : large.concat(matchData.date) )}
                    spacey
                    highlight={highlight}
                    matchData={matchData}
                    players={players} />
              )
            }
          </div>
        ]
      }
      {
        groupedMatches.rest && [
          <h1 key="rest-heading">Tidigare</h1>,
          <div key="rest-content" className="matches-container">
            {
              groupedMatches.rest.map(x => x).reverse().map(matchData =>
                <Match
                    key={`${matchData.p1slug}-${matchData.p2slug}-${matchData.date}-match`}
                    wide={large.includes(matchData.date)}
                    callback={() => setLarge( large.includes(matchData.date) ? large.filter(x=>x!==matchData.date) : large.concat(matchData.date) )}
                    spacey
                    highlight={highlight}
                    matchData={matchData}
                    players={players} />
              )
            }
          </div>
        ]
      }
    </div>      
  )
}

