import { Box, Container, Paper } from '@mui/material'
import { Outlet } from 'react-router-dom'
import UserNavbar from '../../components/customer/CustomerNavbar'
import UserFooter from '../../components/customer/CustomerFooter'

const UserLayout = () => {
  return (
    <Box>
        <Container>

            <Paper>
                
                <UserNavbar/>
                <Outlet/>
                <UserFooter/>

            </Paper>

        </Container>

    </Box>
  )
}

export default UserLayout