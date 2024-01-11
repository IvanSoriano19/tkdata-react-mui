import React, { useEffect, useState } from "react";
import { Navbar } from "../../home/Navbar";
import {
    Container,
    makeStyles,
    Grid,
    TextField,
    ThemeProvider,
    createTheme,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Checkbox,
    IconButton,
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
} from "firebase/firestore";
import { db } from "../../../firebase-config";
import { useAuth } from "../../../context/authContext";
import { Personas } from "../miClub/Personas";
import { EditClub } from "../miClub/EditClub";
import { EditCampeonato } from "./EditCampeonato";
import {
    EditOutlined,
    DeleteOutlineOutlined,
    AddCircle,
    ArrowBackRounded,
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
        marginTop: "10px",
    },
}));

export function Campeonato() {
    const classes = useStyles();
    const { user } = useAuth();
    const [datos, setDatos] = useState(null);
    const [datosPersonas, setDatosPersonas] = useState([]);
    const [open, setOpen] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [personasSeleccionadas, setPersonasSeleccionadas] = useState([]);
    const [modifyButtons, setModifyButtons] = useState("crear");
    const navigate = useNavigate();
    const location = useLocation();
    const { campeonato } = location.state;
    const [refreshCampeonato, setRefreshCampeonato] = useState("")
    
    console.log(campeonato);

    const handleClick = () => {
        setOpen(true);
    };

    const handleClose = async () => {
        setOpen(false);
        const datosQuery = query(
            collection(db, "Personas"),
            where("Club", "==", datos.name)
        );
        console.log("123 ",datosQuery)
        const datosSnapshot = await getDocs(datosQuery);
        const datosPers = datosSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        setDatosPersonas(datosPers);
    };

    const handleClickEdit = () => {
        setOpenEdit(true);
    };

    const handleCloseEdit = () => {
        setOpenEdit(false);
        obtenerCampeonato();
    };

    const obtenerCampeonato = async() => {
        try{
            const docRef = doc(db,"Campeonatos", campeonato.id);
            const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    console.log(data);
                    setRefreshCampeonato(data);
                } else {
                    setRefreshCampeonato(null);
                }
        }catch (error) {
            console.error(error);
            setRefreshCampeonato(null);
        }
    }

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

    const obtenerDatos = async () => {
        const datosQuery = query(
            collection(db, "Personas"),
            where("Club", "==", datos.name)
        );
        console.log(datos.name);
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
    //TODO
    const handleEditar = () => {};

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
                                </Grid>
                            ) : (
                                ""
                            )}
                            {console.log("refreshCampeonato ",refreshCampeonato)}
                            {console.log("campeonato ",campeonato)}
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
                        </Grid>
                    </Container>
                ) : (
                    <div>Loading</div>
                )}
                {datos ? (
                    <Container maxWidth="md" className={classes.global}>
                        <Grid item xs={12} sm={12}>
                            {modifyButtons === "crear" && (
                                <IconButton
                                    variant="contained"
                                    color="primary"
                                    onClick={handleClick}
                                    className={classes.personaBtnCrear}
                                >
                                    <AddCircle fontSize="large" />
                                </IconButton>
                            )}
                            {modifyButtons === "editar" && (
                                <div>
                                    <IconButton
                                        color="default"
                                        onClick={handleEditar}
                                        className={classes.personaBtnEditar}
                                    >
                                        <EditOutlined fontSize="large" />
                                    </IconButton>
                                    <IconButton
                                        variant="contained"
                                        color="secondary"
                                        onClick={handleEliminar}
                                        className={classes.personaBtnEliminar}
                                    >
                                        <DeleteOutlineOutlined fontSize="large" />
                                    </IconButton>
                                </div>
                            )}
                            {modifyButtons === "eliminar" && (
                                <IconButton
                                    variant="contained"
                                    color="secondary"
                                    onClick={handleEliminar}
                                    className={classes.personaBtnEliminar}
                                >
                                    <DeleteOutlineOutlined fontSize="large" />
                                </IconButton>
                            )}
                            <Personas
                                open={open}
                                handleClose={handleClose}
                                club={datos.name}
                            />
                        </Grid>
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
                                                    Categoria
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
                                                    Sexo
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {Object.keys(datosPersonas).map(
                                            (personaId) => {
                                                const row =
                                                    datosPersonas[personaId];
                                                return (
                                                    <TableRow
                                                        key={personaId}
                                                        role="checkbox"
                                                    >
                                                        <TableCell padding="checkbox">
                                                            <Checkbox
                                                                checked={personasSeleccionadas.includes(
                                                                    personaId
                                                                )}
                                                                onChange={() =>
                                                                    handleSelectPersona(
                                                                        personaId
                                                                    )
                                                                }
                                                            />
                                                        </TableCell>
                                                        <TableCell align="left">
                                                            <Typography>
                                                                {row.Nombre}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell align="left">
                                                            <Typography>
                                                                {row.Apellido}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell align="left">
                                                            <Typography>
                                                                {row.Edad}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell align="left">
                                                            <Typography>
                                                                {row.Categoria}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell align="left">
                                                            <Typography>
                                                                {row.Tipo}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell align="left">
                                                            <Typography>
                                                                {row.Peso}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell align="left">
                                                            <Typography>
                                                                {row.Sexo}
                                                            </Typography>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            }
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                    </Container>
                ) : (
                    <div>Loading</div>
                )}
            </ThemeProvider>
        </div>
    );
}
