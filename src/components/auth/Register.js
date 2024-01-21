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
    FormControl,
    InputLabel,
    MenuItem,
    Select,
} from "@material-ui/core";
import { LockOutlined } from "@material-ui/icons";
import { useState } from "react";
import { useAuth } from "../../context/authContext";
import { useNavigate } from "react-router-dom";
import { Logo } from "./LogoAuth";

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
}));

export function Register(props) {
    const classes = useStyles();
    const { signup } = useAuth();
    const navigate = useNavigate();
    const [errors, setErrors] = useState();
    const [tipoClub, setTipoClub] = useState("");
    const [provincia, setProvincia] = useState("");
    
    const [user, setUser] = useState({
        id: "",
        name: "",
        provincia: "",
        direccion: "",
        municipio:"",
        email: "",
        telefono: "",
        tipoClub: "",
        password: "",
    });
    const handleChange = (event, campo) => {
        const { value } = event.target;
        setUser({ ...user, [campo]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors("");
        try {
            await signup(user);
            navigate("/");
        } catch (error) {
            setErrors(error.message);
        }
    };

    const handleLogin = () => {
        navigate("/login");
    };

    const handleChangeTipoClub = (event) => {
        const tipo = event.target.value;
        setTipoClub(tipo);
    };

    const handleChangeProvincia = (event) => {
        const provincia = event.target.value;
        setProvincia(provincia);
    };

    console.log(user);
    return (
        <Container component="main" maxWidth="xs">
            {errors && <p className={classes.error}>{errors}</p>}
            <CssBaseline />
            <div className={classes.paper}>
                <div className={classes.avatar}>
                    <Logo />
                </div>
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
                                onChange={(e) => {
                                    handleChange(e, "name");
                                }}
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
                                onChange={(e) => {
                                    handleChange(e, "telefono");
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl
                                variant="outlined"
                                fullWidth
                                label="Tipo de club"
                                id="tipoClub"
                            >
                                <InputLabel>Tipo de club</InputLabel>
                                <Select
                                    id="tipoClub"
                                    onChange={(e) => {
                                        handleChange(e, "tipoClub");
                                        handleChangeTipoClub(e);
                                    }}
                                    required
                                    label="Tipo de Club"
                                >
                                    <MenuItem value={"Combate"}>
                                        Combate
                                    </MenuItem>
                                    <MenuItem value={"Técnica"}>
                                        Técnica
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl
                                variant="outlined"
                                fullWidth
                                label="Provincia"
                                id="provincia"
                            >
                                <InputLabel>Provincia</InputLabel>
                                <Select
                                    id="provincia"
                                    onChange={(e) => {
                                        handleChange(e, "provincia");
                                        handleChangeProvincia(e);
                                    }}
                                    required
                                    label="Provincia"
                                >
                                    <MenuItem value={"Castellón"}>
                                        Castellón
                                    </MenuItem>
                                    <MenuItem value={"Valencia"}>
                                        Valencia
                                    </MenuItem>
                                    <MenuItem value={"Alicante"}>
                                        Alicante
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="municipio"
                                label="Municipio"
                                onChange={(e) => {
                                    handleChange(e, "municipio");
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="direccion"
                                label="Direccion"
                                onChange={(e) => {
                                    handleChange(e, "direccion");
                                }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="email"
                                label="Correo electronico"
                                onChange={(e) => {
                                    handleChange(e, "email");
                                }}
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
                                onChange={(e) => {
                                    handleChange(e, "password");
                                }}
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
