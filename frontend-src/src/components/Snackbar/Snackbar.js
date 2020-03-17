import React from 'react'
import { Snackbar, Slide } from '@material-ui/core'
import { Alert } from '@material-ui/lab'

const errorMessages = {
  '23505': 'ERRO: Código duplicado.'
}

export default function SimpleSnackbar(props) {
  const { open, closeSnackbar, message, severity } = props

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    closeSnackbar()
  }

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      TransitionComponent={Slide}
    >
      <Alert variant="filled" severity={severity}>
        {message}
      </Alert>
    </Snackbar>
  )
}