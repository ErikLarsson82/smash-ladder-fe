import React from 'react'

export default function Back({ setscreen }) {
	return (
		<div onClick={() => setscreen('DASHBOARD')} className="back">X</div>
	)
}