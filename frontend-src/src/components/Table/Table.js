import React, { useState, useEffect } from 'react'
import MaterialTable from 'material-table'
import * as moment from "moment"
import Dialog from '../Dialog/Dialog'
import config from '../../config.json'
import Snackbar from '../Snackbar/Snackbar'

import {
  PostUser,
  PatchUser,
  DeleteUser
} from '../Forms'

const defaultDialogState = {
  title: '',
  open: false,
  component: null,
  userData: {},
}

const defaultSnackbarState = {
  open: false,
  message: '',
  severity: 'info'
}

const dataQuery = query =>
  new Promise((resolve, reject) => {
    console.log('dataquery')
    const offset = query.pageSize * query.page
    let url = `/users?offset=${offset}&limit=${query.pageSize}`
    fetch(url)
      .then(response => response.json())
      .then(result => {
        console.log(result.data)
        result.data.forEach( row => row.age = moment().diff(row.birthday, 'years') )
        resolve({ data: result.data, page: result.page, totalCount: result.count, })
      })
      .catch(e => {
        console.log(e)
        resolve({ data: [], page: 0, totalCount: 0 })
      })
  })

export default props => {
  const [dialogState, setDialogState] = useState(defaultDialogState)
  const [snackbarState, setSnackbarState] = useState(defaultSnackbarState)
  const [tableObj, setTableObj] = useState({})
  const closeDialog = () => setDialogState(defaultDialogState)
  const closeSnackbar = () => setSnackbarState(defaultSnackbarState)
  const openSnackbar = (message, severity) => setSnackbarState({ open: true, message, severity })
  const tableRef = React.createRef()

  useEffect(() => {
    setTableObj(tableRef.current)
  }, []);


  return (
    <React.Fragment>
      <MaterialTable
        tableRef={tableRef}
        title="Teste CRUD de usuário"
        initialPage={0}
        options={{
          pageSize: config.pageSize,
          pageSizeOptions: config.pageSizeOptions
        }}
        columns={[
          { title: 'Nome', field: 'name' },
          { title: 'Telefone', field: 'phone' },
          { title: 'Data de Nascimento', field: 'birthday' },
          { title: 'Idade', field: 'age', type: 'numeric' },
          { title: 'CPF', field: 'cpf' },
          { title: 'E-mail', field: 'email' },
        ]}
        data={dataQuery}
        actions={[
          {
            icon: 'add',
            tooltip: 'Add User',
            isFreeAction: true,
            onClick: (event) => setDialogState({
              title: 'POST User',
              open: true,
              component: PostUser,
              tableRef: tableRef
            })
          },
          {
            icon: 'edit',
            tooltip: 'Edit User',
            onClick: (event, rowData) => setDialogState({
              title: 'PATCH User',
              open: true,
              component: PatchUser,
              userData: rowData
            })
          },
          {
            icon: 'delete',
            tooltip: 'Delete User',
            onClick: (event, rowData) => setDialogState({
              title: 'DELETE User',
              open: true,
              component: DeleteUser,
              userData: rowData,
            })
          },
        ]}
      />

      <Snackbar 
        closeSnackbar={closeSnackbar}
        {...snackbarState}
      />

      <Dialog
        closeDialog={closeDialog}
        openSnackbar={openSnackbar}
        tableObj={tableObj}
        {...dialogState}
      />
    </React.Fragment>
  )
}