import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import {
    Button,
    makeStyles,
    AppBar,
    Toolbar,
    MenuItem,
    Menu,
    Grid,
    createTheme,
    ThemeProvider,
} from "@material-ui/core";
import { Logo } from "./Logo.js";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    icon:{
        marginRight: "5px"
    },
    title: {
        flexGrow: 1,
    },
    items: {
        display: "flex",
        textAlign: "center",
        paddingRight: 20,
    },
}));

const theme = createTheme({
    palette: {
        primary: {
            main: "#447cc1",
        },
    },
});

export function Navbar() {
    const classes = useStyles();
    const [openMenu, setOpenMenu] = useState(null);

    const handleClick = (event) => {
        setOpenMenu(event.currentTarget);
    };

    const handleClose = () => {
        setOpenMenu(null);
    };
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
        navigate("/");
    };


    return (
        <div className={classes.root}>
            <ThemeProvider theme={theme}>
                <AppBar position="static" color="primary">
                    <Toolbar>
                        <Grid container spacing={12}>
                            <Button
                                id="logo"
                                color="inherit"
                                className={classes.icon}
                                onClick={() => navigate("/")}
                            >
                                <Logo/>
                            </Button>
                            <Button
                                id="miclub"
                                color="inherit"
                                className={classes.items}
                                onClick={() => navigate("/mi-club")}
                            >
                                Mi club
                            </Button>
                            <Button
                                id="campeonatos"
                                color="inherit"
                                className={classes.items}
                                onClick={() => navigate("/campeonatos")}
                            >
                                Campeonatos
                            </Button>
                            <Button
                                id="crear"
                                color="inherit"
                                className={classes.items}
                                onClick={() => navigate("/crear-campeonato")}
                            >
                                Crear campeonato
                            </Button>
                        </Grid>

                        <div>
                            <Button
                                color="inherit"
                                aria-controls="fade-menu"
                                aria-haspopup="true"
                                onClick={handleClick}
                            >
                                {user.email}
                            </Button>
                            <Menu
                                anchorEl={openMenu}
                                open={Boolean(openMenu)}
                                onClose={handleClose}
                            >
                                <MenuItem onClick={handleLogout}>
                                    Logout
                                </MenuItem>
                            </Menu>
                        </div>
                    </Toolbar>
                </AppBar>
            </ThemeProvider>
        </div>
    );
}
