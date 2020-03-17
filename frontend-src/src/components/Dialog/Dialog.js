import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'

export default ({
  open,
  closeDialog,
  openSnackbar,
  component: Component,
  userData,
  tableRef,
  title,
  tableObj
}) => {
  return (
    <Dialog open={open} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">{title}</DialogTitle>
      <DialogContent>
        {Component
          ? <Component
              openSnackbar={openSnackbar}
              tableRef={tableRef}
              tableObj={tableObj}
              closeDialog={closeDialog}
              {...userData}
            />
          : ''}
      </DialogContent>
    </Dialog>
  )
}