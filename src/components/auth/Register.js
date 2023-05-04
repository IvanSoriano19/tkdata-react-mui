import {
    TextField,
    Button,
    makeStyles,
    Container,
    CssBaseline,
    Typography,
    Avatar,
    Grid,
    Box,
    Link,
} from "@material-ui/core";
import { LockOutlined } from "@material-ui/icons";
import { useState } from "react";
import { useAuth } from "../../context/authContext";
import { useNavigate } from "react-router-dom";

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
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
        backgroundColor: "#447cc1",
        '&:hover':{
            backgroundColor: "#2765B0",
        }
    },
}));

export function Register(props) {
    const classes = useStyles();
    const [user, setUser] = useState({
        id: "", 
        name: "",
        provincia: "",
        email: "",
        telefono: "",
        password: ""
    });

    const { signup } = useAuth();
    const navigate = useNavigate();
    const [errors, setErrors] = useState();

    const handleChange = ({ target: { id, value } }) => {
        setUser({ ...user, [id]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors("");
        try {
            await signup(user)
            navigate("/");
        } catch (error) {
            setErrors(error.message);
        }
    };

    const handleLogin = () => {
        navigate("/login");
    };

    console.log(user);
    return (
        <Container component="main" maxWidth="xs">
            {errors && <p className={classes.error}>{errors}</p>}
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlined />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Registro
                </Typography>
                <form className={classes.form} onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12}>
                            <TextField
                                name="name"
                                variant="outlined"
                                required
                                fullWidth
                                id="name"
                                label="Nombre del club"
                                onChange={handleChange}
                                autoFocus
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="telefono"
                                label="Telefono"
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="provincia"
                                label="Provincia"
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="email"
                                label="Correo electronico"
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                onChange={handleChange}
                            />
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Registrar
                    </Button>
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Link onClick={handleLogin} variant="body2">
                                Ya tienes el club registrado? Inicia sesión
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
            <Box mt={5}>
                <Copyright />
            </Box>
        </Container>
    );
}
