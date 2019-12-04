import React, { useState } from 'react'

/*
-- Takes prop 'delayDuration' that specifies in milisecons when
-- prop (to children) 'delay' should go from false to true
*/

export default function Delay(props) {
  const [inProp, setInProp] = useState(false)

  setTimeout( () => setInProp(true), props.delayDuration)

  return React.Children.map(props.children, child => {
    return React.cloneElement(
      child,
      {...props, delay: inProp }
    )
  })
}

