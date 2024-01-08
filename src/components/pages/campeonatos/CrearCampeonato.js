import React, { useEffect, useState } from "react";
import { Navbar } from "../../home/Navbar";
import {
    createTheme,
    makeStyles,
    Grid,
    Button,
    TextField,
    Typography,
    CssBaseline,
    Container,
    Select,
    MenuItem, FormControl, InputLabel
} from "@material-ui/core";
import { useAuth } from "../../../context/authContext";
import { addDoc, collection, doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase-config";
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
        categoria: "",
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

        if (!campeonatos.nombre || !campeonatos.fecha || !campeonatos.lugar || !campeonatos.direccion || !campeonatos.tipo || !campeonatos.categoria) {
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
                    categoria: "",
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

    // const handleChange = ({ target: { id, value } }) => {
    //     setCampeonatos({ ...campeonatos, [id]: value });
    //     
    // };

    const handleChange = (event, campo ) => {
        const { value } = event.target;
        setCampeonatos({... campeonatos, [campo]: value});
        console.log(campeonatos);
    }

    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
    const handleChangeCategoria = (event) => {
        const categoria = event.target.value;
        setCategoriaSeleccionada(categoria);
    };
    const [tipoSeleccionado, setTipoSeleccionado] = useState("")
    const handleChangeTipo = (event) => {
        const tipo = event.target.value;
        setCategoriaSeleccionada(tipo);
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
                                    onChange={(e) => {
                                        handleChange(e, "nombre")
                                    }}
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
                                    onChange={(e) => {
                                        handleChange(e, "fecha")
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={7}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="lugar"
                                    label="Lugar"
                                    onChange={(e) => {
                                        handleChange(e, "lugar")
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
                                        handleChange(e, "direccion")
                                    }}
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
                                    onChange={(e) => {
                                        handleChange(e, "organizador")
                                    }}
                                    
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl
                                    variant="outlined"
                                    fullWidth
                                    label="Tipo"
                                    id="tipo"
                                >
                                    <InputLabel>Tipo</InputLabel>
                                    <Select
                                            id="tipo"
                                            onChange={(e) => {
                                                handleChange(e, "tipo");
                                                handleChangeTipo(e);
                                            }}
                                            required
                                            label="Tipo de campeonato"
                                        >
                                            <MenuItem value={"Autonomico"}>Autonomico</MenuItem>
                                            <MenuItem value={"Liga"}>Liga</MenuItem>
                                            <MenuItem value={"Open"}>Open</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                            <FormControl
                                variant="outlined"
                                fullWidth
                                label="Categoria"
                                id="Categoria"
                            >
                                <InputLabel>Categoria</InputLabel>
                                <Select
                                        id="Categoria"
                                        onChange={(e) => {
                                            handleChange(e, "categoria");
                                            handleChangeCategoria(e);
                                        }}
                                        required
                                        label="Categoria"
                                    >
                                        <MenuItem value={"Cadete"}>Cadete</MenuItem>
                                        <MenuItem value={"Junior"}>Junior</MenuItem>
                                        <MenuItem value={"Senior"}>Senior</MenuItem>
                                </Select>
                            </FormControl>
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                        >
                            Registrar campeonato
                        </Button>
                    </form>
                </div>
            </Container>
        </div>
    );
}
