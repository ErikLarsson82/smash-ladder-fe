import React from 'react'
import CancelIcon from '@material-ui/icons/Cancel'
import { StylesProvider } from '@material-ui/core/styles'

export default function Back({ setscreen }) {
	return (
		<StylesProvider injectFirst>
	      <CancelIcon className="remove-match" onClick={() => setscreen('DASHBOARD')} />
	    </StylesProvider>
	)
}