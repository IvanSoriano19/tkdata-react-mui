import React from 'react';
import { Route } from 'react-router-dom';
import {context, useAuth} from '../context/authContext'
import {useContext} from 'react'


export function Home() {

    const {user} = useAuth()
    console.log(user)

    return (
        <div>
            
        </div>
    )
}

