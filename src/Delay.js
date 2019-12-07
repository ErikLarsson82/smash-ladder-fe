import React, { useState, useEffect } from 'react'

/*
-- Takes prop 'delayDuration' that specifies in milisecons when
-- prop (to children) 'delay' should go from false to true
*/

export default function Delay(props) {
  const [inProp, setInProp] = useState(false)
  const [stateTimeout, setStateTimeout] = useState(null)

  if (!stateTimeout) {
    setStateTimeout(
      setTimeout( () => {
        setInProp(true)
      }, props.delayDuration)
    )
  }

  useEffect(() => {
    return function cleanup() {
      clearTimeout(stateTimeout)
    }
  }, [stateTimeout])

  return React.Children.map(props.children, child => {
    return React.cloneElement(
      child,
      {...props, delay: inProp }
    )
  })
}

