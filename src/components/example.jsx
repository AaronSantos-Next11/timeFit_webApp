import React from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Menu from '@mui/icons-material/Menu'

function example() {
  return (
    <div>example

      <AppBar position="fixed" color="primary">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <Menu />
          </IconButton>
          <Typography variant="h6">
            
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
    
  )
}

export default example