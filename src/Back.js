import React from 'react'

export default function Back({ setscreen }) {
	return (
		<div onClick={() => setscreen('LADDER')} className="back">X</div>
	)
}