import {
    TextField,
    Button,
    makeStyles,
    Typography,
    Link,
    Container,
    CssBaseline,
    Avatar,
    Grid,
    Box,
} from "@material-ui/core";
import { LockOutlined } from "@material-ui/icons";
import { useState } from "react";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";
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
        marginTop: theme.spacing(8),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: "#e55156",
    },
    form: {
        width: "100%",
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
        backgroundColor: "#447cc1",
        '&:hover':{
            backgroundColor: "#2765B0",
        }
    },
    
}));

export function Login() {
    const classes = useStyles();
    const navigate = useNavigate();
    const [user, setUser] = useState({
        name: "",
        password: "",
    });

    const { login } = useAuth();
    const [errors, setErrors] = useState();

    const handleChange = ({ target: { id, value } }) => {
        setUser({ ...user, [id]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors("");
        try {
            await login(user.email, user.password);

            navigate("/");
        } catch (error) {
            setErrors(error.message);
        }
    };

    const handleRegister = () => {
        navigate("/register");
    };

    return (
        <Container component="main" maxWidth="xs" color="#f8f6f4">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlined />
                </Avatar>
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
                        <Grid item xs>
                            <Link href="#" variant="body2">
                                ¿Olvidaste la contraseña?
                            </Link>
                        </Grid>
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
            {errors && <p className={classes.error}>{errors}</p>}
        </Container>
    );
}
