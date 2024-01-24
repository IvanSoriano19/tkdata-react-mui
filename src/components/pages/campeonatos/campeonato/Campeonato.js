import React, { useEffect, useState } from "react";
import { Navbar } from "../../../home/Navbar";
import {
    Container,
    makeStyles,
    Grid,
    TextField,
    ThemeProvider,
    createTheme,
    Typography,
    IconButton,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Table,
    TableContainer,
    TableCell,
    TableBody,
    TableHead,
    TableRow,
    Checkbox,
    Snackbar,
    Card,
    CardContent,
} from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    where,
    getFirestore,
    writeBatch,
    updateDoc,
    addDoc,
    onSnapshot,
    Timestamp,
} from "firebase/firestore";
import { db } from "../../../../firebase-config";
import { useAuth } from "../../../../context/authContext";
import { EditCampeonato } from "../campeonato/EditCampeonato";
import { ConfirmDelete } from "../campeonato/ConfirmDelete";
import {
    EditOutlined,
    DeleteOutlineOutlined,
    ArrowBackRounded,
    HourglassEmptyOutlined,
    AddCircle,
    ReplayOutlined,
    Send,
} from "@material-ui/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { AgregarCompetidores } from "./AgregarCompetidores";
const theme = createTheme({
    palette: {
        primary: {
            main: "#447cc1",
        },
        secondary: {
            main: "#e55156",
        },
    },
});

const useStyles = makeStyles((theme) => ({
    root: {
        // alignItems: "center",
        width: "95%",
        marginTop: "60px",
        display: "flex",
        // margin: "auto",
    },
    snackbar: {
        width: "100%",
        "& > * + *": {
            marginTop: theme.spacing(2),
        },
    },
    arrowGrid: {
        alignItems: "center",
        display: "flex-start",
        width: "80%",
        marginTop: "80px",
    },
    containerTop: {
        alignItems: "center",
        width: "80%",
        backgroundColor: "#f8f6f4",
        borderRadius: "15px",
        marginTop: "20px",
    },
    containerBottom: {
        alignItems: "center",
        width: "80%",
        borderRadius: "15px",
        marginTop: "30px",
        marginBottom: "30px",
    },
    container: {
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        width: "100%",
        marginTop: "20px",
        marginBottom: "30px",
    },
    leftSide: {
        display: "flex",
        alignItems: "column",
        justifyContent: "center",
        backgroundColor: "#f8f6f4",
        borderRadius: "15px",
    },
    rightSide: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f8f6f4",
        borderRadius: "15px",
    },
    campeonatos: {
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        margin: "10px",
    },
    campeonato: {
        width: "100%",
        textAlign: "center",
    },
    campeonatoBtn: {
        justifyContent: "flex",
    },
    campeonatoBtnEditar: {
        justifyContent: "flex-start",
    },
    personaBtnCrear: {
        justifyContent: "flex-end",
        marginTop: "10px",
    },
    personaBtnEditar: {
        justifyContent: "flex-end",
        marginTop: "10px",
    },
    campeonatoBtnEliminar: {
        justifyContent: "flex-end",
    },
    loading: {
        alignItems: "center",
        margin: "auto",
    },
    loadingContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
    },
    menuItems: {
        marginTop: "7px",
        display: "flex",
        alignItems: "center",
    },
    addPersona: {
        display: "flex",
        alignItems: "left",
    },
    limpiarFiltrosBtn: {
        display: "flex-end",
    },
    foroContainer: {
        display: "flex",
    },
    containerTabla: {
        marginBottom: "20px",
    },
    btnEnviar: {
        display: "flex-end",
    },
    card: {
        borderRadius: "12px 12px 0 12px",
        overflow: "hidden",
        width: "95%",
        alignItems: "center",
    },
    cardContent: {
        padding: "3px ",
        paddingBottom: "0px",
    },
    nombreChat: {
        fontWeight: "bold",
    },
    mensajesContent: {
        marginBottom: "-19px",
    },
    messages: {
        justifyContent: "flex-end",
        marginBottom: "20px",
        width: "90%",
    },
    cardItem: {
        justifyContent: "center",
        alignItems: "center",
    },
}));

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export function Campeonato() {
    const classes = useStyles();
    const { user } = useAuth();
    const [datos, setDatos] = useState(null);
    const [datosCompetidores, setDatosCompetidores] = useState([]);
    const [openEdit, setOpenEdit] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [openSnackbarCombateTecnica, setOpenSnackbarCombateTecnica] =
        useState(false);
    const [agregarCompetidoresOpen, setAgregarCompetidoresOpen] =
        useState(false);
    const [personasSeleccionadas, setPersonasSeleccionadas] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    const { campeonato } = location.state;
    const [refreshCampeonato, setRefreshCampeonato] = useState("");
    const [sexoSeleccionado, setSexoSeleccionado] = useState("");
    const [pesoFiltrado, setPesoFiltrado] = useState([]);
    const [pesoSeleccionado, setPesoSeleccionado] = useState("");
    const [personasFiltradas, setPersonasFiltradas] = useState([]);
    const [modifyButtons, setModifyButtons] = useState("add");
    const [message, setMessage] = useState({
        mensaje: "",
        timestamp: "",
        club: "",
        campeonato: "",
    });
    const [messages, setMessages] = useState([]);

    const handleCloseSnackbar = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setOpenSnackbar(false);
    };
    const handleCloseSnackbarCombateTecnica = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setOpenSnackbarCombateTecnica(false);
    };
    const cadeteM = [
        "-33 Kg",
        "-37 Kg",
        "-41 Kg",
        "-45 Kg",
        "-49 Kg",
        "-53 Kg",
        "-57 Kg",
        "-61 Kg",
        "-65 Kg",
        "+65 Kg",
    ];
    const cadeteF = [
        "-29 Kg",
        "-33 Kg",
        "-37 Kg",
        "-41 Kg",
        "-44 Kg",
        "-47 Kg",
        "-51 Kg",
        "-55 Kg",
        "-59 Kg",
        "+59 Kg",
    ];
    const juniorM = [
        "-45 Kg",
        "-48 Kg",
        "-51 Kg",
        "-55 Kg",
        "-59 Kg",
        "-63 Kg",
        "-68 Kg",
        "-73 Kg",
        "-78 Kg",
        "+78 Kg",
    ];
    const juniorF = [
        "-42 Kg",
        "-44 Kg",
        "-46 Kg",
        "-49 Kg",
        "-52 Kg",
        "-55 Kg",
        "-59 Kg",
        "-63 Kg",
        "-68 Kg",
        "+68 Kg",
    ];
    const seniorM = [
        "-54 Kg",
        "-58 Kg",
        "-63 Kg",
        "-68 Kg",
        "-74 Kg",
        "-80 Kg",
        "-87 Kg",
        "+87 Kg",
    ];
    const seniorF = [
        "-46 Kg",
        "-49 Kg",
        "-53 Kg",
        "-57 Kg",
        "-62 Kg",
        "-67 Kg",
        "-73 Kg",
        "+73 Kg",
    ];

    const handleClickEdit = () => {
        setOpenEdit(true);
    };

    const handleCloseEdit = () => {
        setOpenEdit(false);
        obtenerCampeonato();
    };

    const handleClickDelete = () => {
        setDeleteOpen(true);
    };

    const handleCloseDelete = () => {
        setDeleteOpen(false);
        obtenerCampeonato();
    };

    const handleClickCompetidores = () => {
        setAgregarCompetidoresOpen(true);
    };
    const handleCloseCompetidores = () => {
        setAgregarCompetidoresOpen(false);
        obtenerCampeonato();
        window.location.reload();
    };

    const handleChangeSexo = (event) => {
        const sexo = event.target.value;
        setSexoSeleccionado(sexo);
        setPesoSeleccionado("");
    };
    const handleChangePeso = (event) => {
        const peso = event.target.value;
        setPesoSeleccionado(peso);
    };
    const handleChangeMensajes = (event, campo) => {
        const { value } = event.target;
        setMessage({ ...message, [campo]: value });
    };

    const handleAddClub = async (nuevoClub) => {
        try {
            const campeonatoRef = doc(db, "Campeonatos", campeonato.id);

            const docSnap = await getDoc(campeonatoRef);
            const campeonatoData = docSnap.data();
            if (datos.tipoClub === campeonatoData.combateTecnica) {
                const clubesActuales = campeonatoData.clubes || [];

                clubesActuales.push(nuevoClub);

                await updateDoc(campeonatoRef, { clubes: clubesActuales });
                navigate("/campeonatos");
            } else {
                console.log(
                    "tu club tiene que ser de ",
                    campeonatoData.combateTecnica
                );
                setOpenSnackbarCombateTecnica(true);
            }
        } catch (error) {}
    };

    const handleDeleteClub = async (deleteClub) => {
        const batch = writeBatch(getFirestore());
        try {
            const campeonatoRef = doc(db, "Campeonatos", campeonato.id);

            const docSnap = await getDoc(campeonatoRef);
            const campeonatoData = docSnap.data();
            const clubesActuales = campeonatoData.clubes || [];
            const competidoresActuales = campeonatoData.competidores || [];

            const nuevosClubes = clubesActuales.filter(
                (club) => club !== deleteClub
            );
            const competidoresNuevosSet = new Set(competidoresActuales);
            for (const persona of personasFiltradas) {
                const personasDoc = await getDoc(
                    doc(db, "Personas", persona.id)
                );
                if (personasDoc.data().Club === datos.name) {
                    competidoresNuevosSet.delete(persona.id);
                    const competidoresNuevos = Array.from(
                        competidoresNuevosSet
                    );
                    await updateDoc(campeonatoRef, {
                        competidores: competidoresNuevos,
                    });
                }
            }
            await updateDoc(campeonatoRef, {
                clubes: nuevosClubes,
            });

            await batch.commit();
            navigate("/campeonatos");
        } catch (error) {}
    };

    const obtenerCampeonato = async () => {
        try {
            const docRef = doc(db, "Campeonatos", campeonato.id);
            const docSnap = await getDoc(docRef);
            const unsubscribe = onSnapshot(
                docRef,
                (snapshot) => {
                    if (snapshot.empty) {
                        console.log("snapshot empty");
                        return;
                    }
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        setRefreshCampeonato(data);
                    } else {
                        setRefreshCampeonato(null);
                    }
                },
                (error) => {
                    console.error("Error al obtener campeonato:", error);
                }
            );
            return () => unsubscribe();
        } catch (error) {
            console.error(error);
            setRefreshCampeonato(null);
        }
    };

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

    useEffect(() => {
        obtenerCampeonato();
        obtenerCompetidores();
    }, [datos]);

    useEffect(() => {
        if (personasSeleccionadas.length === 0) {
            setModifyButtons("add");
        } else {
            setModifyButtons("eliminar");
        }
    }, [personasSeleccionadas]);

    const handleSelectPersona = (id) => {
        const isSelected = personasSeleccionadas.includes(id);
        if (isSelected) {
            setPersonasSeleccionadas(
                personasSeleccionadas.filter((selectedId) => selectedId !== id)
            );
        } else {
            setPersonasSeleccionadas([...personasSeleccionadas, id]);
        }
    };

    const handleEliminar = async () => {
        if (personasSeleccionadas.length === 0) {
            return;
        }

        const batch = writeBatch(getFirestore());

        try {
            const campeonatoDoc = await getDoc(
                doc(db, "Campeonatos", campeonato.id)
            );

            if (campeonatoDoc.exists()) {
                const competidoresActuales =
                    campeonatoDoc.data().competidores || [];

                const competidoresNuevosSet = new Set(competidoresActuales);

                for (const personaId of personasSeleccionadas) {
                    const personasDoc = await getDoc(
                        doc(db, "Personas", personaId)
                    );
                    console.log(competidoresNuevosSet);
                    if (datos.name === personasDoc.data().Club) {
                        competidoresNuevosSet.delete(personaId);
                        console.log(personaId);
                        const competidoresNuevos = Array.from(
                            competidoresNuevosSet
                        );
                        console.log(competidoresNuevos);
                        await updateDoc(campeonatoDoc.ref, {
                            competidores: competidoresNuevos,
                        });

                        await batch.commit();
                        window.location.reload();
                    } else {
                        console.error(
                            "No puedes eliminar un competidor que no sea de tu club"
                        );
                        setOpenSnackbar(true);
                    }
                }
            } else {
                console.error("Campeonato no existe");
            }
        } catch (error) {
            console.error("Error al eliminar competidor/es:", error);
        }
    };
    const cambiarSexo = () => {
        if (campeonato.categoria === "Cadete") {
            if (sexoSeleccionado === "Masculino") {
                setPesoFiltrado(cadeteM);
            } else if (sexoSeleccionado === "Femenino") {
                setPesoFiltrado(cadeteF);
            }
        } else if (campeonato.categoria === "Junior") {
            if (sexoSeleccionado === "Masculino") {
                setPesoFiltrado(juniorM);
            } else if (sexoSeleccionado === "Femenino") {
                setPesoFiltrado(juniorF);
            }
        } else if (campeonato.categoria === "Senior") {
            if (sexoSeleccionado === "Masculino") {
                setPesoFiltrado(seniorM);
            } else if (sexoSeleccionado === "Femenino") {
                setPesoFiltrado(seniorF);
            }
        }
    };

    useEffect(() => {
        cambiarSexo();
    }, [sexoSeleccionado]);

    const obtenerCompetidores = async (campeonatoId) => {
        try {
            const docRef = doc(db, "Campeonatos", campeonatoId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const campeonatoData = docSnap.data();
                const competidoresData = campeonatoData.competidores || [];

                const competidores = [];
                for (const competidorId of competidoresData) {
                    try {
                        const competidorDoc = await getDoc(
                            doc(db, "Personas", competidorId)
                        );
                        if (competidorDoc.exists()) {
                            competidores.push({
                                id: competidorDoc.id,
                                ...competidorDoc.data(),
                            });
                        } else {
                            console.error(
                                `El competidor con ID ${competidorId} no existe.`
                            );
                        }
                    } catch (error) {
                        console.error(
                            `Error al obtener datos del competidor con ID ${competidorId}:`,
                            error
                        );
                    }
                }
                setDatosCompetidores(competidores);
            } else {
                console.error(
                    `El campeonato con ID ${campeonatoId} no existe.`
                );
            }
        } catch (error) {
            console.error(
                `Error al obtener datos del campeonato con ID ${campeonatoId}:`,
                error
            );
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const docRef = doc(db, "Campeonatos", campeonato.id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const campeonatoData = docSnap.data();
                    setRefreshCampeonato(campeonatoData);
                    obtenerCompetidores(campeonato.id);
                } else {
                    setRefreshCampeonato(null);
                }
            } catch (error) {
                console.error(error);
                setRefreshCampeonato(null);
            }
        };

        fetchData();
    }, [campeonato]);

    const filtrarPersonas = () => {
        if (!Array.isArray(datosCompetidores)) {
            console.error("datosCompetidores no es valido");
            return;
        }
        if (sexoSeleccionado === "") {
            setPersonasFiltradas(datosCompetidores);
        } else {
            const personasFiltradas = datosCompetidores.filter((persona) => {
                if (
                    (sexoSeleccionado === "Masculino" &&
                        persona.Sexo === "Masculino") ||
                    (sexoSeleccionado === "Femenino" &&
                        persona.Sexo === "Femenino")
                ) {
                    if (
                        !pesoSeleccionado ||
                        persona.Peso === pesoSeleccionado
                    ) {
                        return true;
                    }
                }
                return false;
            });

            setPersonasFiltradas(personasFiltradas);
        }
    };

    useEffect(() => {
        filtrarPersonas();
    }, [datosCompetidores, sexoSeleccionado, pesoSeleccionado]);

    const handleLimpiarFiltros = () => {
        setSexoSeleccionado("");
        setPesoSeleccionado("");
    };

    const onClickEnviarMensaje = async (e) => {
        e.preventDefault();

        const newMessage = {
            ...message,
            timestamp: Date.now(),
            club: datos.name,
            campeonato: refreshCampeonato.nombre,
        };

        await addDoc(collection(db, "Foro"), newMessage);

        setMessage({
            mensaje: "",
            timestamp: "",
            club: "",
            campeonato: "",
        });
    };

    useEffect(() => {
        const obtenerMessages = async () => {
            const datosQuery = query(
                collection(db, "Foro"),
                where("campeonato", "==", refreshCampeonato.nombre)
            );
            const unsubscribe = onSnapshot(
                datosQuery,
                (snapshot) => {
                    if (snapshot.empty) {
                        console.log("No hay mensajes en este campeonato.");
                        return;
                    }
                    const mensajes = [];
                    snapshot.forEach((doc) => {
                        mensajes.push({ id: doc.id, ...doc.data() });
                    });

                    const sortedMessages = mensajes
                        .slice()
                        .sort((a, b) => b.timestamp - a.timestamp);

                    setMessages(sortedMessages);
                },
                (error) => {
                    console.error("Error al obtener mensajes:", error);
                }
            );
            return () => unsubscribe();
        };
        obtenerMessages();
    }, [datos, refreshCampeonato]);

    const mostrarDatosCampeonato = () => {
        if (!datos.name) {
        }
        return (
            <>
                <Grid item xs={12} sm={6}>
                    <TextField
                        className={classes.campeonato}
                        label="Direccion"
                        value={refreshCampeonato.direccion}
                        variant="outlined"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        className={classes.campeonato}
                        InputProps={{
                            readOnly: true,
                        }}
                        label="Lugar"
                        value={refreshCampeonato.lugar}
                        variant="outlined"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        className={classes.campeonato}
                        InputProps={{
                            readOnly: true,
                        }}
                        label="Fecha"
                        value={refreshCampeonato.fecha}
                        variant="outlined"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        className={classes.campeonato}
                        InputProps={{
                            readOnly: true,
                        }}
                        label="Organizador"
                        value={refreshCampeonato.organizador}
                        variant="outlined"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={3}>
                    <TextField
                        className={classes.campeonato}
                        InputProps={{
                            readOnly: true,
                        }}
                        label="Tipo de campeonato"
                        value={refreshCampeonato.tipo}
                        variant="outlined"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={3}>
                    <TextField
                        className={classes.campeonato}
                        InputProps={{
                            readOnly: true,
                        }}
                        label="Tipo de campeonato"
                        value={refreshCampeonato.combateTecnica}
                        variant="outlined"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        className={classes.campeonato}
                        InputProps={{
                            readOnly: true,
                        }}
                        label="Categoria"
                        value={refreshCampeonato.categoria}
                        variant="outlined"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={9}>
                    <Typography variant="h6">
                        {campeonato.clubes && datos.id in campeonato.clubes
                            ? `${datos.name} SI está inscrito en el campeonato.`
                            : `${datos.name} NO está inscrito en el campeonato.`}
                    </Typography>
                </Grid>
                {campeonato.clubes && datos.id in campeonato.clubes ? (
                    datos.name === campeonato.organizador ? (
                        ""
                    ) : (
                        <Grid item xs={12} sm={3}>
                            {/* TODO crear la funcionalidad */}
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="secondary"
                                className={classes.submit}
                                onClick={() => handleDeleteClub(datos.name)}
                            >
                                Desinscribirme
                            </Button>
                        </Grid>
                    )
                ) : (
                    <>
                        <Grid item xs={12} sm={3}>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                                onClick={() => handleAddClub(datos.name)}
                            >
                                Inscribirme
                            </Button>
                        </Grid>
                        <div className={classes.snackbar}>
                            <Snackbar
                                open={openSnackbarCombateTecnica}
                                autoHideDuration={3000}
                                onClose={handleCloseSnackbarCombateTecnica}
                            >
                                <Alert
                                    onClose={handleCloseSnackbarCombateTecnica}
                                    severity="error"
                                >
                                    El club tiene que ser de {refreshCampeonato.combateTecnica}
                                </Alert>
                            </Snackbar>
                        </div>
                    </>
                )}
            </>
        );
    };

    const condicionInscrito = () => {
        return (
            <>
                {modifyButtons === "add" && (
                    <Grid item xs={2}>
                        <IconButton
                            variant="contained"
                            color="primary"
                            onClick={handleClickCompetidores}
                            className={classes.addPersona}
                        >
                            <AddCircle fontSize="large" />
                        </IconButton>
                        <AgregarCompetidores
                            open={agregarCompetidoresOpen}
                            handleClose={handleCloseCompetidores}
                            idCampeonato={campeonato.id}
                        />
                    </Grid>
                )}
                {modifyButtons === "eliminar" && (
                    <Grid item xs={2}>
                        <IconButton
                            variant="contained"
                            color="secondary"
                            onClick={() => {
                                handleEliminar();
                            }}
                            className={classes.personaBtnEliminar}
                        >
                            <DeleteOutlineOutlined fontSize="large" />
                        </IconButton>
                    </Grid>
                )}
            </>
        );
    };

    return (
        <div>
            <Navbar />
            <ThemeProvider theme={theme} className={classes.root}>
                {
                    <Container maxWidth="md" className={classes.arrowGrid}>
                        <Grid container spacing={2}>
                            <Grid item sm={3}>
                                <IconButton
                                    color="primary"
                                    onClick={() => navigate("/campeonatos")}
                                    className={classes.btnBack}
                                >
                                    <ArrowBackRounded fontSize="large" />
                                </IconButton>
                            </Grid>
                            <Grid item sm={9}>
                                <Typography variant="h3">
                                    {refreshCampeonato.nombre}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Container>
                }
                {datos ? (
                    <Container maxWidth="md" className={classes.containerTop}>
                        <Grid container spacing={2}>
                            {datos.name === campeonato.organizador ? (
                                <Grid
                                    item
                                    xs={12}
                                    sm={12}
                                    className={classes.campeonatoBtn}
                                >
                                    <IconButton
                                        color="primary"
                                        onClick={handleClickEdit}
                                        className={classes.campeonatoBtnEditar}
                                    >
                                        <EditOutlined fontSize="large" />
                                    </IconButton>
                                    <EditCampeonato
                                        open={openEdit}
                                        handleClose={handleCloseEdit}
                                        campeonato={campeonato}
                                    />
                                    <IconButton
                                        variant="contained"
                                        color="secondary"
                                        onClick={handleClickDelete}
                                        className={
                                            classes.campeonatoBtnEliminar
                                        }
                                    >
                                        <DeleteOutlineOutlined fontSize="large" />
                                    </IconButton>
                                    <ConfirmDelete
                                        open={deleteOpen}
                                        handleClose={handleCloseDelete}
                                        idCampeonato={campeonato.id}
                                    />
                                </Grid>
                            ) : (
                                ""
                            )}
                            {mostrarDatosCampeonato()}
                        </Grid>
                    </Container>
                ) : (
                    <div className={classes.loadingContainer}>
                        <IconButton className={classes.loading}>
                            <HourglassEmptyOutlined fontSize="large" />
                        </IconButton>
                    </div>
                )}
                {datos ? (
                    <Container spacing={2} className={classes.containerBottom}>
                        <Grid
                            container
                            spacing={2}
                            className={classes.container}
                        >
                            <Grid container xs={7} className={classes.leftSide}>
                                <Grid
                                    className={classes.campeonatos}
                                    item
                                    xs={12}
                                    sm={12}
                                    spacing={2}
                                >
                                    <Typography variant="h4">
                                        Competidores
                                    </Typography>
                                </Grid>
                                <Grid
                                    container
                                    xs={11}
                                    spacing={2}
                                    className={classes.menuItems}
                                >
                                    {campeonato.clubes &&
                                    datos.id in campeonato.clubes ? (
                                        condicionInscrito()
                                    ) : (
                                        <Grid item xs={2}></Grid>
                                    )}

                                    <Grid item xs={4}>
                                        <FormControl
                                            variant="outlined"
                                            fullWidth
                                            label="Sexo"
                                            id="Sexo"
                                        >
                                            <InputLabel>Sexo</InputLabel>
                                            <Select
                                                id="sexo"
                                                onChange={(e) => {
                                                    handleChangeSexo(e);
                                                }}
                                                required
                                                label="Sexo"
                                                value={sexoSeleccionado}
                                            >
                                                <MenuItem value={"Masculino"}>
                                                    Masculino
                                                </MenuItem>
                                                <MenuItem value={"Femenino"}>
                                                    Femenino
                                                </MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <FormControl
                                            variant="outlined"
                                            required
                                            fullWidth
                                            id="Peso"
                                            label="Peso"
                                        >
                                            <InputLabel>Peso</InputLabel>
                                            <Select
                                                value={pesoSeleccionado}
                                                label=""
                                                onChange={(e) => {
                                                    handleChangePeso(e);
                                                }}
                                            >
                                                {pesoFiltrado.map(
                                                    (op, index) => (
                                                        <MenuItem
                                                            key={index}
                                                            value={op}
                                                        >
                                                            {op}
                                                        </MenuItem>
                                                    )
                                                )}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid tem xs={2}>
                                        <IconButton
                                            variant="contained"
                                            color="default"
                                            onClick={handleLimpiarFiltros}
                                            className={
                                                classes.limpiarFiltrosBtn
                                            }
                                        >
                                            <ReplayOutlined fontSize="large" />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                                <Grid
                                    container
                                    xs={12}
                                    sm={12}
                                    className={classes.containerTabla}
                                >
                                    <Grid item xs={12} sm={12}>
                                        <TableContainer>
                                            <Table
                                                className={classes.table}
                                                aria-label="simple table"
                                            >
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell padding="checkbox"></TableCell>
                                                        <TableCell align="left">
                                                            <Typography variant="h6">
                                                                Nombre
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell align="left">
                                                            <Typography variant="h6">
                                                                Apellido
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell align="left">
                                                            <Typography variant="h6">
                                                                Tipo
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell align="left">
                                                            <Typography variant="h6">
                                                                Peso
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell align="left">
                                                            <Typography variant="h6">
                                                                Club
                                                            </Typography>
                                                        </TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {personasFiltradas.map(
                                                        (row) => (
                                                            <TableRow
                                                                key={row.id}
                                                                role="checkbox"
                                                            >
                                                                <TableCell padding="checkbox">
                                                                    <Checkbox
                                                                        checked={personasSeleccionadas.includes(
                                                                            row.id
                                                                        )}
                                                                        onChange={() =>
                                                                            handleSelectPersona(
                                                                                row.id
                                                                            )
                                                                        }
                                                                    />
                                                                </TableCell>
                                                                <TableCell align="left">
                                                                    <Typography>
                                                                        {
                                                                            row.Nombre
                                                                        }
                                                                    </Typography>
                                                                </TableCell>
                                                                <TableCell align="left">
                                                                    <Typography>
                                                                        {
                                                                            row.Apellido
                                                                        }
                                                                    </Typography>
                                                                </TableCell>
                                                                <TableCell align="left">
                                                                    <Typography>
                                                                        {
                                                                            row.Tipo
                                                                        }
                                                                    </Typography>
                                                                </TableCell>
                                                                <TableCell align="left">
                                                                    <Typography>
                                                                        {
                                                                            row.Peso
                                                                        }
                                                                    </Typography>
                                                                </TableCell>
                                                                <TableCell align="left">
                                                                    <Typography>
                                                                        {
                                                                            row.Club
                                                                        }
                                                                    </Typography>
                                                                </TableCell>
                                                            </TableRow>
                                                        )
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={0}></Grid>
                            <Grid
                                container
                                xs={4}
                                className={classes.rightSide}
                            >
                                <Grid
                                    className={classes.campeonatos}
                                    xs={12}
                                    sm={12}
                                    spacing={2}
                                    item
                                >
                                    <Typography variant="h4">Foro</Typography>
                                </Grid>
                                <form onSubmit={(e) => e.preventDefault()}>
                                    <Grid
                                        container
                                        xs={12}
                                        sm={12}
                                        spacing={2}
                                        className={classes.foroContainer}
                                    >
                                        <Grid item xs={9} spacing={2}>
                                            <TextField
                                                onChange={(e) => {
                                                    handleChangeMensajes(
                                                        e,
                                                        "mensaje"
                                                    );
                                                }}
                                                value={message.mensaje}
                                            ></TextField>
                                        </Grid>
                                        <Grid
                                            item
                                            xs={3}
                                            spacing={2}
                                            className={classes.btnEnviar}
                                        >
                                            <IconButton>
                                                <Send
                                                    type="submit"
                                                    onClick={
                                                        onClickEnviarMensaje
                                                    }
                                                />
                                            </IconButton>
                                        </Grid>
                                    </Grid>
                                </form>
                                <Grid
                                    container
                                    spacing={1}
                                    className={classes.messages}
                                >
                                    {messages.map((m) => (
                                        <Grid
                                            item
                                            xs={12}
                                            sm={12}
                                            key={m.id}
                                            className={classes.cardItem}
                                        >
                                            <Card className={classes.card}>
                                                <CardContent
                                                    className={
                                                        classes.cardContent
                                                    }
                                                >
                                                    <Grid
                                                        container
                                                        xs={12}
                                                        sm={12}
                                                        spacing={1}
                                                    >
                                                        <Grid item xs={12}>
                                                            <Typography
                                                                className={
                                                                    classes.nombreChat
                                                                }
                                                            >
                                                                {m.club}
                                                            </Typography>
                                                        </Grid>
                                                        <Grid
                                                            item
                                                            xs={12}
                                                            className={
                                                                classes.mensajesContent
                                                            }
                                                        >
                                                            <Typography>
                                                                {m.mensaje}
                                                            </Typography>
                                                        </Grid>
                                                    </Grid>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Grid>
                        </Grid>
                        <div className={classes.snackbar}>
                            <Snackbar
                                open={openSnackbar}
                                autoHideDuration={6000}
                                onClose={handleCloseSnackbar}
                            >
                                <Alert
                                    onClose={handleCloseSnackbar}
                                    severity="error"
                                >
                                    No puedes eliminar un competidor que no sea
                                    de tu club
                                </Alert>
                            </Snackbar>
                        </div>
                    </Container>
                ) : (
                    <div className={classes.loadingContainer}>
                        <IconButton className={classes.loading}>
                            <HourglassEmptyOutlined fontSize="large" />
                        </IconButton>
                    </div>
                )}
            </ThemeProvider>
        </div>
    );
}
