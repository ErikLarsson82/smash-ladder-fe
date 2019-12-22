import React from 'react'
import KeyboardArrowUpTwoToneIcon from '@material-ui/icons/KeyboardArrowUpTwoTone'
import KeyboardArrowDownTwoToneIcon from '@material-ui/icons/KeyboardArrowDownTwoTone'
import ArrowRightAltTwoToneIcon from '@material-ui/icons/ArrowRightAltTwoTone'
import DoubleArrowIcon from '@material-ui/icons/DoubleArrow'
import { StylesProvider } from '@material-ui/core/styles'

export default function Trend(props) {
  return (
    <StylesProvider injectFirst>
      {trendIcon(props.amount)}
    </StylesProvider>
  )
}

function trendIcon(trend) {
  if (trend > 1)
    return <DoubleArrowIcon className="trend-up double-up" />

  if (trend > 0)
    return <KeyboardArrowUpTwoToneIcon className="trend-up" />

  if (trend < -1)
    return <DoubleArrowIcon className="trend-down double-down" />

  if (trend < 0)
    return <KeyboardArrowDownTwoToneIcon className="trend-down" />

  return <ArrowRightAltTwoToneIcon className="unchanged" />
}