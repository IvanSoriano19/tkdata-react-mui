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
} from "firebase/firestore";
import { db } from "../../../../firebase-config";
import { useAuth } from "../../../../context/authContext";
import { Personas } from "../../miClub/Personas";
import { EditCampeonato } from "../campeonato/EditCampeonato";
import { ConfirmDelete } from "../campeonato/ConfirmDelete";
import {
    EditOutlined,
    DeleteOutlineOutlined,
    ArrowBackRounded,
    HourglassEmptyOutlined,
    AddCircle,
    ReplayOutlined,
} from "@material-ui/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { AgregarCompetidores } from "./AgregarCompetidores";
import { useChat } from "../foro/useChat";

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
        alignItems: "flex-start",
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
        // alignItems: "right",
    },
}));

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export function Campeonato() {
    const classes = useStyles();
    const { user } = useAuth();
    const [datos, setDatos] = useState(null);
    const [datosPersonas, setDatosPersonas] = useState([]);
    const [datosCompetidores, setDatosCompetidores] = useState([]);
    const [openEdit, setOpenEdit] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
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
    const [message, setMessage] = useState("");
    // const { loading, messages, error } = useChat();

    // const onClickEnviarMensaje = (e) =>{
    //     e.preventDefault();

    //     doc(db,'messages').add({
    //         timestamp: Date.now(),
    //         message
    //     });
    // }

    const handleClickSnackbar = () => {
        setOpenSnackbar(true);
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setOpenSnackbar(false);
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

    const handleAddClub = async (nuevoClub) => {
        try {
            const campeonatoRef = doc(db, "Campeonatos", campeonato.id);

            const docSnap = await getDoc(campeonatoRef);
            const campeonatoData = docSnap.data();
            const clubesActuales = campeonatoData.clubes || [];

            clubesActuales.push(nuevoClub);

            await updateDoc(campeonatoRef, { clubes: clubesActuales });
            navigate("/campeonatos");
        } catch (error) {}
    };

    const obtenerCampeonato = async () => {
        try {
            const docRef = doc(db, "Campeonatos", campeonato.id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                setRefreshCampeonato(data);
            } else {
                setRefreshCampeonato(null);
            }
        } catch (error) {
            console.error(error);
            setRefreshCampeonato(null);
        }
    };

    const obtenerDatos = async () => {
        const datosQuery = query(
            collection(db, "Personas"),
            where("Club", "==", datos.name)
        );
        const datosSnapshot = await getDocs(datosQuery);
        const datosPers = {};
        datosSnapshot.docs.forEach((doc) => {
            datosPers[doc.id] = {
                id: doc.id,
                ...doc.data(),
            };
        });
        setDatosPersonas(datosPers);
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
        obtenerDatos();
        obtenerCampeonato();
        obtenerCompetidores();
    }, [datos]);

    useEffect(() => {
        if (personasSeleccionadas.length === 0) {
            setModifyButtons("add");
        } else {
            setModifyButtons("eliminar");
        }
        console.log("Después de actualizar useffect:", personasSeleccionadas);
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
        console.log(
            "Estado de personasSeleccionadas: handleSelectPersona===",
            personasSeleccionadas
        );
        console.log(
            "Después de actualizar: handleSelectPersona===",
            personasSeleccionadas
        );
        console.log(personasSeleccionadas);
    };

    const handleEliminar = async () => {
        if (personasSeleccionadas.length === 0) {
            return;
        }

        const batch = writeBatch(getFirestore());

        console.log(personasFiltradas);
        console.log(personasSeleccionadas);
        console.log(refreshCampeonato.competidores);
        console.log(campeonato.id);

        try {
            const campeonatoDoc = await getDoc(
                doc(db, "Campeonatos", campeonato.id)
            );

            if (campeonatoDoc.exists()) {
                const competidoresActuales =
                    campeonatoDoc.data().competidores || [];

                const competidoresNuevosSet = new Set(competidoresActuales);

                console.log(datos.name);

                for (const personaId of personasSeleccionadas) {
                    const personasDoc = await getDoc(
                        doc(db, "Personas", personaId)
                    );

                    console.log(personasDoc.data());

                    if (datos.name === personasDoc.data().Club) {
                        competidoresNuevosSet.delete(personaId);
                        const competidoresNuevos = Array.from(
                            competidoresNuevosSet
                        );

                        await updateDoc(campeonatoDoc.ref, {
                            competidores: competidoresNuevos,
                        });
                        await batch.commit();
                        window.location.reload();
                    } else {
                        console.log(
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

    console.log(refreshCampeonato);

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

    // const campeonatosUsuario = datosCampeonatos
    //     ? Object.values(datosCampeonatos).filter((campeonato) => {
    //             const clubesCampeonato = Object.values(campeonato.clubes || {});
    //             return clubesCampeonato.some((club) => club === clubesUsuario);
    //         })
    //     : [];

    const mostrarDatosCampeonato = () => {
        console.log(datos.name);
        console.log(campeonato.clubes);
        if (!datos.name) {
        }
        return (
            <>
                <Grid item xs={12} sm={6}>
                    <TextField
                        className={classes.campeonato}
                        disabled
                        label="Direccion"
                        value={refreshCampeonato.direccion}
                        variant="outlined"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        className={classes.campeonato}
                        disabled
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
                        disabled
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
                        disabled
                        label="Organizador"
                        value={refreshCampeonato.organizador}
                        variant="outlined"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        className={classes.campeonato}
                        disabled
                        label="Tipo de campeonato"
                        value={refreshCampeonato.tipo}
                        variant="outlined"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        className={classes.campeonato}
                        disabled
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
                    ""
                ) : (
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
                                <Grid>
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
                                                                Edad
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
                                                            console.log(
                                                                "ROW",
                                                                row
                                                            ),
                                                            (
                                                                <TableRow
                                                                    key={row.id}
                                                                    role="checkbox"
                                                                >
                                                                    <TableCell padding="checkbox">
                                                                        {console.log(
                                                                            personasSeleccionadas
                                                                        )}
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
                                                                                row.Edad
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
                                                        )
                                                    )}
                                                    {console.log(
                                                        datosCompetidores
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
                                >
                                    <Typography variant="h4">Foro</Typography>
                                </Grid>
                                {/* <form>
                                    <Grid item xs={10} spacing={2}>
                                        <TextField
                                            value={message}
                                            onChange={(e) =>
                                                setMessage(e.target.value)
                                            }
                                        ></TextField>
                                        <Button type="submit" onClick={onClickEnviarMensaje}>
                                            enviar mensaje
                                        </Button>
                                    </Grid>
                                </form>
                                <ul>
                                    {messages.map(m=> <li key={m.id}>{m.message}</li>)}
                                </ul> */}
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
