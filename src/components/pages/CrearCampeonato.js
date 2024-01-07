import React, { useEffect, useState } from "react";
import { Navbar } from "../home/Navbar";
import {
    createTheme,
    makeStyles,
    Grid,
    Button,
    TextField,
    Typography,
    CssBaseline,
    Container,
} from "@material-ui/core";
import { useAuth } from "../../context/authContext";
import { addDoc, collection, doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase-config";
import { useNavigate } from "react-router-dom";

const theme = createTheme({
    palette: {
        primary: {
            main: "#447cc1",
        },
    },
});

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(10),
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
        "&:hover": {
            backgroundColor: "#2765B0",
        },
    },
}));

export function CrearCampeonato() {
    const classes = useStyles();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [datos, setDatos] = useState(null);
    const [campeonatos, setCampeonatos] = useState({
        nombre: "",
        lugar: "",
        direccion: "",
        fecha: "",
        organizador:"",
        clubes: [],
        tipo: "",
        categorias: "",
    });

    useEffect(() => {
        const getData = async () => {
            try {
                const docRef = doc(db, "clubes", user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setDatos(data);
                } else {
                    setDatos(null);
                }
            } catch (error) {
                console.error(error);
                setDatos(null);
            }
        };
        getData();
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault(); 

        if (!campeonatos.nombre || !campeonatos.fecha || !campeonatos.lugar || !campeonatos.direccion || !campeonatos.tipo || !campeonatos.categorias) {
            return;
        }
        try {
            const clubDocRef = doc(db, "clubes", user.uid);
            const clubDocSnap = await getDoc(clubDocRef);
            
            if (clubDocSnap.exists()) {
                const clubData = clubDocSnap.data();

                const newCampeonato = {
                    ...campeonatos,
                    organizador: clubData.name,
                    clubes: [clubData.name],
                };

                await addDoc(collection(db, "Campeonatos"), newCampeonato);

                setCampeonatos({
                    nombre: "",
                    lugar: "",
                    direccion: "",
                    fecha: "",
                    organizador: "",
                    clubes: [],
                    tipo: "",
                    categorias: "",
                });
                navigate('/campeonatos')
            } else {
                console.log("no hay datos del club");
            }
        } catch (error) {
            console.error("Error al agregar el campeonato:", error);
        }
    };
    // console.log(datos)

    const handleChange = ({ target: { id, value } }) => {
        setCampeonatos({ ...campeonatos, [id]: value });
        console.log(campeonatos);
    };

    return (
        <div>
            <Navbar />
            <Container component="main" maxWidth="xs">
                {/* {errors && <p className={classes.error}>{errors}</p>} */}
                <CssBaseline />
                <div className={classes.paper}>
                    <Typography component="h1" variant="h5">
                        Crear Campeonato
                    </Typography>
                    <form className={classes.form} onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={12}>
                                <TextField
                                    name="name"
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="nombre"
                                    label="Nombre del campeonato"
                                    onChange={handleChange}
                                    autoFocus
                                />
                            </Grid>
                            <Grid item xs={12} sm={5}>
                                <TextField
                                    id="fecha"
                                    label="Fecha"
                                    type="date"
                                    className={classes.textField}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={7}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="lugar"
                                    label="Lugar"
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="direccion"
                                    label="Direccion"
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    disabled
                                    id="organizador"
                                    value={datos ? datos.name : ""}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="tipo"
                                    label="Tipo de campeonato"
                                    placeholder="Autonomico / Liga / Open"
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    label="Categorias"
                                    id="categorias"
                                    placeholder="Catede / Junior / Senior / Sub-21"
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
                    </form>
                </div>
            </Container>
        </div>
    );
}
