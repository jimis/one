/* ------------------------------------------------------------------------- *
 * Copyright 2002-2021, OpenNebula Project, OpenNebula Systems               *
 *                                                                           *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may   *
 * not use this file except in compliance with the License. You may obtain   *
 * a copy of the License at                                                  *
 *                                                                           *
 * http://www.apache.org/licenses/LICENSE-2.0                                *
 *                                                                           *
 * Unless required by applicable law or agreed to in writing, software       *
 * distributed under the License is distributed on an "AS IS" BASIS,         *
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  *
 * See the License for the specific language governing permissions and       *
 * limitations under the License.                                            *
 * ------------------------------------------------------------------------- */
/* eslint-disable jsdoc/require-jsdoc */
import * as React from 'react'
import PropTypes from 'prop-types'
import { makeStyles, Paper, Typography, Button } from '@material-ui/core'

import { Tr } from 'client/components/HOC'

import * as VirtualMachine from 'client/models/VirtualMachine'
import { prettyBytes } from 'client/utils'
import { T, VM_ACTIONS } from 'client/constants'

const useStyles = makeStyles(theme => ({
  root: {
    marginBlock: '0.8em',
    padding: '1em',
    display: 'grid',
    gap: '1em',
    gridAutoFlow: 'column',
    [theme.breakpoints.down('sm')]: {
      gridAutoFlow: 'initial'
    }
  },
  item: {
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      gap: '1em',
      '& > *': {
        width: '50%'
      }
    }
  },
  actions: {
    [theme.breakpoints.down('sm')]: {
      borderBottom: `1px solid ${theme.palette.divider}`,
      padding: '1em'
    },
    [theme.breakpoints.up('md')]: {
      order: 1,
      textAlign: 'end'
    }
  },
  title: {
    fontWeight: theme.typography.fontWeightBold
  }
}))

const InformationPanel = ({ actions, vm = {}, handleOpenResizeDialog }) => {
  const classes = useStyles()
  const { TEMPLATE } = vm

  const isVCenter = VirtualMachine.isVCenter(vm)

  const capacity = [
    {
      name: T.PhysicalCpu,
      value: TEMPLATE?.CPU
    },
    {
      name: T.VirtualCpu,
      value: TEMPLATE?.VCPU ?? '-'
    },
    (isVCenter && {
      name: T.VirtualCores,
      value: (
        <>
          {`${Tr(T.Cores)} x ${TEMPLATE?.TOPOLOGY?.CORES || '-'} |
          ${Tr(T.Sockets)} ${TEMPLATE?.TOPOLOGY?.SOCKETS || '-'}`}
        </>
      )
    }),
    {
      name: T.Memory,
      value: prettyBytes(+TEMPLATE?.MEMORY, 'MB')
    },
    {
      name: T.CostCpu,
      value: TEMPLATE?.CPU_COST || 0
    },
    {
      name: T.CostMByte,
      value: TEMPLATE?.MEMORY_COST || 0
    }
  ].filter(Boolean)

  return (
    <Paper variant='outlined' className={classes.root}>
      <div className={classes.actions}>
        {actions?.includes?.(VM_ACTIONS.RESIZE_CAPACITY) && (
          <Button
            data-cy='resize'
            size='small'
            color='secondary'
            onClick={handleOpenResizeDialog}
            variant='contained'
          >
            {Tr(T.Resize)}
          </Button>
        )}
      </div>
      {capacity.map(({ name, value }) => (
        <div key={name} className={classes.item}>
          <Typography className={classes.title} noWrap title={name}>
            {name}
          </Typography>
          <Typography variant='body2' noWrap title={value}>
            {value}
          </Typography>
        </div>
      ))}
    </Paper>
  )
}

InformationPanel.propTypes = {
  handleOpenResizeDialog: PropTypes.function,
  actions: PropTypes.array,
  vm: PropTypes.object
}

InformationPanel.displayName = 'InformationPanel'

export default InformationPanel