import {
    TextField,
    Button,
    makeStyles,
    Typography,
    Link,
    Container,
    CssBaseline,
    Grid,
    Box,
    Snackbar,
} from "@material-ui/core";
import { useState } from "react";
import { useAuth } from "../../context/authContext";
import { useNavigate } from "react-router-dom";
import { Logo } from "./LogoAuth";
import MuiAlert from "@material-ui/lab/Alert";

// import ImageLogin from "../images/login.jpg";

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {"Copyright © "}
            <Link
                color="inherit"
                target="_blank"
                href="https://github.com/IvanSoriano19"
            >
                TKDATA
            </Link>{" "}
            {new Date().getFullYear()}
            {"."}
        </Typography>
    );
}

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(6),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: "#FAFAFA",
    },
    form: {
        width: "100%",
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
        backgroundColor: "#447cc1",
        "&:hover": {
            backgroundColor: "#2765B0",
        },
    },
    snackbar: {
        width: "100%",
        "& > * + *": {
            marginTop: theme.spacing(2),
        },
    },
}));

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export function Login() {
    const classes = useStyles();
    const navigate = useNavigate();
    const [user, setUser] = useState({
        email: "",
        password: "",
    });
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const { login } = useAuth();
    const [errors, setErrors] = useState();

    const handleCloseSnackbar = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setOpenSnackbar(false);
    };

    const handleChange = ({ target: { id, value } }) => {
        setUser((prevUser) => {
            const newUser = { ...prevUser, [id]: value };
            return newUser;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors("");
        try {
            await login(user);
            navigate("/");
        } catch (error) {
            setErrors(error.message);
            setOpenSnackbar(true);
        }
    };

    const handleRegister = () => {
        navigate("/register");
    };

    return (
        <Container component="main" maxWidth="xs" color="#f8f6f4">
            <CssBaseline />
            <div className={classes.paper}>
                <div className={classes.avatar}>
                    <Logo />
                </div>
                <Typography component="h1" variant="h5">
                    Iniciar Sesión
                </Typography>
                <form className={classes.form} onSubmit={handleSubmit}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email"
                        autoComplete="email"
                        autoFocus
                        onChange={handleChange}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        label="Contraseña"
                        type="password"
                        id="password"
                        onChange={handleChange}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Iniciar Sesión
                    </Button>
                    <Grid container>
                        <Grid item>
                            <Link onClick={handleRegister} variant="body2">
                                {"¿Aun no tienes cuenta?"}
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
            <Box mt={8}>
                <Copyright />
            </Box>
            <div className={classes.snackbar}>
                <Snackbar
                    open={openSnackbar}
                    autoHideDuration={6000}
                    onClose={handleCloseSnackbar}
                >
                    <Alert onClose={handleCloseSnackbar} severity="error">
                        Email o contraseña incorrectas
                    </Alert>
                </Snackbar>
            </div>
        </Container>
    );
}
