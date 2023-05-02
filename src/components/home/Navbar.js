import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import {
    Button,
    Typography,
    makeStyles,
    AppBar,
    Toolbar,
    MenuItem,
    Menu,
    Grid,
    createTheme,
    ThemeProvider,
} from "@material-ui/core";

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
    items: {
        display: "flex",
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
                            <Typography
                                variant="body1"
                                className={classes.items}
                            >
                                Gestionar mi club
                            </Typography>
                            <Typography
                                variant="body1"
                                className={classes.items}
                            >
                                Campeonatos
                            </Typography>
                            <Typography
                                variant="body1"
                                className={classes.items}
                            >
                                Crear campeonato
                            </Typography>
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
                                <MenuItem>Profile</MenuItem>
                                <MenuItem>My account</MenuItem>
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
