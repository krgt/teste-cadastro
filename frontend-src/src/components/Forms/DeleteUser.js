import React from 'react'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import DialogActions from '@material-ui/core/DialogActions'
import { withFormik } from 'formik'
import * as Yup from 'yup'

const Form = ({
  values,
  errors,
  touched,
  handleBlur,
  handleChange,
  handleSubmit,
  closeDialog
}) => {
  const fieldError = field => Boolean(errors[field]) && touched[field]

  const commonProps = fieldId => {
    return {
      required: true,
      margin: "dense",
      id: fieldId,
      name: fieldId,
      fullWidth: true,
      value: values[fieldId],
      onChange: handleChange,
      onBlur: handleBlur,
      helperText: fieldError(fieldId) ? errors[fieldId] : '',
      error: fieldError(fieldId)
    }
  }

  return (
    <form>
      <TextField label="Password" type="password" password {...commonProps('password')} />

      <DialogActions>
        <Button onClick={closeDialog} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Delete
        </Button>
      </DialogActions>
    </form>
  )
}

export default withFormik({
  mapPropsToValues(props) {
    return {
      password: '',
    }
  },
  validationSchema: Yup.object().shape({
    password: Yup.string().min(3).required(),
  }),
  handleSubmit(values, props) {
    values.email = props.props.email

    fetch('/users', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(values)
    })
      .then(res => res.json().then( body => {
        const { tableObj, closeDialog, openSnackbar } = props.props

        if (res.status !== 200)
          throw Error(body.error)
        openSnackbar('Success', 'success')
        setTimeout(tableObj.onQueryChange, 1000)
        closeDialog()
      }))
      .catch(e => {
        props.props.openSnackbar(e.message, 'error')
      })
  }
})(Form)