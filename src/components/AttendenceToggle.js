import React from 'react'
import { ToggleSwitch } from 'mx-react-components'

export const AttendenceToggle = ({ checked, onToggle, styles }) => {
  return <ToggleSwitch checked={checked} onToggle={onToggle} styles={styles} />
}
