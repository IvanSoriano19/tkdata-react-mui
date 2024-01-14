import React, { useEffect, useState } from "react";
import { Navbar } from "../../home/Navbar";
import {
    Container,
    makeStyles,
    Grid,
    TextField,
    ThemeProvider,
    createTheme,
    Typography,
    IconButton,
    Card,
    CardContent,
    Button,
} from "@material-ui/core";
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
import { db } from "../../../firebase-config";
import { useAuth } from "../../../context/authContext";
import { Personas } from "../miClub/Personas";
import { EditCampeonato } from "./EditCampeonato";
import { ConfirmDelete } from "./ConfirmDelete";
import {
    EditOutlined,
    DeleteOutlineOutlined,
    ArrowBackRounded,
    HourglassEmptyOutlined,
    AddBoxRounded,
    AddBox,
} from "@material-ui/icons";
import { useLocation, useNavigate } from "react-router-dom";

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
        width: "90%",
        marginTop: "60px",
        display: "flex",
        // margin: "auto",
    },
    globalArrow: {
        alignItems: "center",
        display: "flex-start",
        width: "80%",
        marginTop: "80px",
    },
    globalTop: {
        alignItems: "center",
        width: "80%",
        backgroundColor: "#f8f6f4",
        borderRadius: "15px",
        marginTop: "20px",
    },
    global: {
        alignItems: "center",
        width: "80%",
        backgroundColor: "#f8f6f4",
        borderRadius: "15px",
        marginTop: "30px",
        marginBottom: "30px",
    },
    // btnBack: {
    //     marginTop: "60px",
    // },
    miclub: {
        width: "100%",
        textAlign: "center",
    },
    miclubBtn: {
        justifyContent: "flex",
    },
    miclubBtnEditar: {
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
    personaBtnEliminar: {
        justifyContent: "flex-end",
        // marginTop: "10px",
    },
    loading: {
        alignItems: "center",
        margin: "auto",
    },
    loadingContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh", // Ajusta esto según tus necesidades
    },
}));

export function Campeonato() {
    const classes = useStyles();
    const { user } = useAuth();
    const [datos, setDatos] = useState(null);
    const [datosPersonas, setDatosPersonas] = useState([]);
    const [open, setOpen] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [personasSeleccionadas, setPersonasSeleccionadas] = useState([]);
    const [modifyButtons, setModifyButtons] = useState("crear");
    const navigate = useNavigate();
    const location = useLocation();
    const { campeonato } = location.state;
    const [refreshCampeonato, setRefreshCampeonato] = useState("");
    const [datosCampeonatos, setDatosCampeonatos] = useState(null);

    console.log(campeonato);

    const handleClick = () => {
        setOpen(true);
    };

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

    const handleClose = async () => {
        setOpen(false);
        const datosQuery = query(
            collection(db, "Personas"),
            where("Club", "==", datos.name)
        );
        console.log("123 ", datosQuery);
        const datosSnapshot = await getDocs(datosQuery);
        const datosPers = datosSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        setDatosPersonas(datosPers);
    };

    const handleAddClub = async (nuevoClub) =>{
        try {
            const campeonatoRef = doc(db, "Campeonatos", campeonato.id); 
    
            const docSnap = await getDoc(campeonatoRef);
            const campeonatoData = docSnap.data();
            const clubesActuales = campeonatoData.clubes || [];
    
            clubesActuales.push(nuevoClub);
    
            await updateDoc(campeonatoRef, { clubes: clubesActuales });
            // window.location.reload();
            navigate("/campeonatos")
        }catch (error) {

        }
    }

    const obtenerCampeonato = async () => {
        try {
            const docRef = doc(db, "Campeonatos", campeonato.id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                console.log(data);
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
        console.log(datos);
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
                    console.log(data);
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
    console.log(datos);

    useEffect(() => {
        obtenerDatos();
        obtenerCampeonato();
    }, [datos]);

    useEffect(() => {
        if (personasSeleccionadas.length === 0) {
            setModifyButtons("crear");
        } else if (personasSeleccionadas.length === 1) {
            setModifyButtons("editar");
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
    };

    const handleEliminar = async () => {
        if (personasSeleccionadas.length === 0) {
            return;
        }

        const batch = writeBatch(getFirestore());

        personasSeleccionadas.forEach((index) => {
            console.log("index=> ", index);
            const personaId = datosPersonas[index].id;
            const personaRef = doc(collection(db, "Personas"), personaId);
            batch.delete(personaRef);
        });

        try {
            await batch.commit();

            const datosQuery = query(
                collection(db, "Personas"),
                where("Club", "==", datos.name)
            );
            const datosSnapshot = await getDocs(datosQuery);
            const datosPers = datosSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setDatosPersonas(datosPers);
            setModifyButtons("crear");
            setPersonasSeleccionadas([]);
        } catch (error) {
            console.error("Error al eliminar personas:", error);
        }
    };

    const mostrarCampeonatos = (ctos) => {
        return (
            ctos &&
            Object.values(ctos).map((campeonato) => {
                return (
                    <Grid item xs={12} key={campeonato.id}>
                        <Card className={classes.card}>
                            <CardContent>
                                <Typography
                                    className={classes.campeonatoNombre}
                                    spacing={2}
                                    variant="h5"
                                >
                                    {campeonato.nombre}
                                </Typography>
                                <Grid container spacing={1}>
                                    <Grid item xs={12}>
                                        <Typography>
                                            Fecha: {campeonato.fecha}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography>
                                            Lugar: {campeonato.lugar}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography>
                                            Organizador:{" "}
                                            {campeonato.organizador === user.uid
                                                ? datos.name
                                                : campeonato.organizador}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography>
                                            Categoria: {campeonato.categoria}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography>
                                            Clubes inscritos:{" "}
                                            {campeonato.clubes
                                                ? Object.values(
                                                      campeonato.clubes
                                                  ).length
                                                : 0}
                                        </Typography>
                                    </Grid>
                                    <Grid
                                        item
                                        xs={6}
                                        className={classes.btnCampeonato}
                                    >
                                        <IconButton
                                            color="primary"
                                            onClick={() =>
                                                navigate("/campeonato", {
                                                    state: { campeonato },
                                                })
                                            }
                                        >
                                            <AddBoxRounded />
                                        </IconButton>
                                    </Grid>
                                    {console.log(campeonato.clubes)}
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                );
            })
        );
    };

    // const campeonatosUsuario = datosCampeonatos
    //     ? Object.values(datosCampeonatos).filter((campeonato) => {
    //             const clubesCampeonato = Object.values(campeonato.clubes || {});
    //             return clubesCampeonato.some((club) => club === clubesUsuario);
    //         })
    //     : [];

    return (
        <div>
            <Navbar />
            <ThemeProvider theme={theme} className={classes.root}>
                {
                    <Container maxWidth="md" className={classes.globalArrow}>
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
                    <Container maxWidth="md" className={classes.globalTop}>
                        <Grid container spacing={2}>
                            {datos.name === campeonato.organizador ? (
                                <Grid
                                    item
                                    xs={12}
                                    sm={12}
                                    className={classes.miclubBtn}
                                >
                                    <IconButton
                                        color="primary"
                                        onClick={handleClickEdit}
                                        className={classes.miclubBtnEditar}
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
                                        className={classes.personaBtnEliminar}
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
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    className={classes.miclub}
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
                                    className={classes.miclub}
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
                                    className={classes.miclub}
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
                                    className={classes.miclub}
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
                                    className={classes.miclub}
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
                                    className={classes.miclub}
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
                                    {campeonato.clubes &&
                                    datos.id in campeonato.clubes
                                        ? `${datos.name} SI está inscrito en el campeonato.`
                                        : `${datos.name} NO está inscrito en el campeonato.`}
                                </Typography>
                            </Grid>
                            {campeonato.clubes &&
                            datos.id in campeonato.clubes ? (
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
                    <Grid container spacing={2} className={classes.container}>
                        <Grid container xs={5} className={classes.leftSide}>
                            <Grid
                                className={classes.campeonatos}
                                item
                                xs={12}
                                sm={12}
                                spacing={2}
                            >
                                <Typography variant="h4">
                                    Campeonatos
                                </Typography>
                            </Grid>
                            <Grid item xs={10} spacing={2}>
                                {/* {mostrarCampeonatos(datosCampeonatos)} */}
                            </Grid>
                        </Grid>
                        <Grid item xs={1}></Grid>
                        <Grid container xs={5} className={classes.rightSide}>
                            <Grid
                                className={classes.campeonatos}
                                xs={12}
                                sm={12}
                                spacing={2}
                            >
                                <Typography variant="h4">
                                    Mis campeonatos
                                </Typography>
                            </Grid>
                            <Grid item xs={10} spacing={2}>
                                {/* {mostrarCampeonatos(campeonatosUsuario)} */}
                            </Grid>
                        </Grid>
                    </Grid>
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
