import React from 'react'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import DialogActions from '@material-ui/core/DialogActions'
import { withFormik } from 'formik'
import * as Yup from 'yup'
import * as moment from 'moment'
import { cpf } from 'cpf-cnpj-validator'

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
      <TextField label="Password Atual" type="password" password {...commonProps('currentPassword')} />
      <TextField label="Nome" type="text" autoFocus {...commonProps('name')} />
      <TextField label="Telefone" type="tel" {...commonProps('phone')} /> 
      <TextField label="Email" type="email" {...commonProps('email')} />
      <TextField label="Password" type="password" password {...commonProps('password')} />
      <TextField label="Data de Nascimento" type="date" {...commonProps('birthday')} />
      <TextField label="CPF" type="text" {...commonProps('cpf')} />

      <DialogActions>
        <Button onClick={closeDialog} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Send
        </Button>
      </DialogActions>
    </form>
  )
}

export default withFormik({
  mapPropsToValues(props) {
    return {
      name: props.name || '',
      phone: props.phone || '',
      birthday: props.birthday || moment().format('YYYY-MM-DD'),
      cpf: props.cpf || '',
      currentEmail: props.email || '',
      email: props.email || '',
      password: '',
    }
  },
  validationSchema: Yup.object().shape({
    currentPassword: Yup.string().min(3).required(),
    name: Yup.string().required(),
    phone: Yup.string().matches(/^[0-9]*$/).required(),
    email: Yup.string().email().required(),
    password: Yup.string().min(3).required(),
    cpf: Yup.string().matches(/^[0-9]*$/).required()
      .test('cpf-test', 'CPF inválido', cpfValue => cpf.isValid(cpfValue) )
  }),
  handleSubmit(values, props) {
    values.email = props.props.email

    fetch('/users', {
      method: 'PATCH',
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