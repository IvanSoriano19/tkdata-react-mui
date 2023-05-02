import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import { makeStyles} from "@material-ui/core";
import { Navbar } from "./Navbar";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
}));


export function Home() {
    const classes = useStyles();

    const { user, loading } = useAuth();
    console.log(user);

    

    if (loading) return <h1>LOADING</h1>;

    return (
        <Navbar/>
    );
}
