import React from 'react';
import { useNavigate } from 'react-router-dom';
import {useAuth} from '../context/authContext'
import { Button, Typography } from '@material-ui/core'


export function Home() {
    
    const navigate = useNavigate()
    const {user, logout, loading} = useAuth()
    console.log(user)

    const handleLogout = async () =>{
        await logout()
        navigate("/")
    }

    if (loading) return <h1>LOADING</h1>

    return (
        <div>
            <Typography variant="subtitle1" color="initial">
                {user.email}
            </Typography>

            <Button onClick={handleLogout} variant="text" color="default">
                logout
            </Button>
        </div>
    )
}

