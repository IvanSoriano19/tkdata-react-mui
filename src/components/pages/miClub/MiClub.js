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
import { Personas } from "./Personas";
import { EditClub } from "./EditClub";
import { EditPersona } from "./EditPersona";
import {
    EditOutlined,
    DeleteOutlineOutlined,
    AddCircle,
    HourglassEmptyOutlined
} from "@material-ui/icons";

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
        // margin: "auto",
    },
    globalTop: {
        alignItems: "center",
        width: "80%",
        backgroundColor: "#f8f6f4",
        borderRadius: "15px",
        marginTop: "100px",
    },
    global: {
        alignItems: "center",
        width: "80%",
        backgroundColor: "#f8f6f4",
        borderRadius: "15px",
        marginTop: "30px",
        marginBottom: "30px",
    },
    miclub: {
        width: "100%",
        textAlign: "center",
    },
    miclubBtn: {
        justifyContent: "flex-end",
    },
    miclubBtnEditar: {
        justifyContent: "flex-end",
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
    loading: {
        alignItems: "center",
        margin: "auto",
    },
    loadingContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh', // Ajusta esto según tus necesidades
    },
}));

export function MiClub() {
    const classes = useStyles();
    const { user } = useAuth();
    const [datos, setDatos] = useState(null);
    const [datosPersonas, setDatosPersonas] = useState([]);
    const [open, setOpen] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openEditPersona, setOpenEditPersona] = useState(false);
    const [personasSeleccionadas, setPersonasSeleccionadas] = useState([]);
    const [modifyButtons, setModifyButtons] = useState("crear");
    const [tempPersonasSeleccionadas, setTempPersonasSeleccionadas] = useState([])
    const handleClick = () => {
        setOpen(true);
    };

    const handleClose = async () => {
        setOpen(false);
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
        setPersonasSeleccionadas([]);
        window.location.reload();
    };

    const handleClickEdit = () => {
        setOpenEdit(true);
    };

    const handleClickEditPersona = () => {
        setOpenEditPersona(true);
    };

    const handleCloseEdit = () => {
        setOpenEdit(false);
        getData();
        setPersonasSeleccionadas([]);
        window.location.reload();
    };

    const handleCloseEditPersona = () => {
        setOpenEditPersona(false);
        getData();
        setPersonasSeleccionadas([]);
    };

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

    useEffect(() => {
        getData();
    }, [user]);

    useEffect(() => {
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
        obtenerDatos();
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
            console.log("persona id", personaId);
            const personaRef = doc(collection(db, "Personas"), personaId);
            console.log("persona ref", personaRef);
            batch.delete(personaRef);
        });

        try {
            await batch.commit();

            setTempPersonasSeleccionadas([]);

            console.log(
                    "Después de resetear personasSeleccionadas",
                    tempPersonasSeleccionadas
                );

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
            window.location.reload();
        } catch (error) {
            console.error("Error al eliminar personas:", error);
        }
    };
    useEffect(() => {
        setPersonasSeleccionadas(tempPersonasSeleccionadas);
    }, [tempPersonasSeleccionadas]);

    return (
        <div>
            <Navbar />
            <ThemeProvider theme={theme} className={classes.root}>
                {datos ? (
                    <Container maxWidth="md" className={classes.globalTop}>
                        <Grid container spacing={2}>
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
                                <EditClub
                                    open={openEdit}
                                    handleClose={handleCloseEdit}
                                    club={datos}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    className={classes.miclub}
                                    disabled
                                    label="Nombre del club"
                                    value={datos.name}
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
                                    label="Email del club"
                                    value={datos.email}
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
                                    label="Telefono del club"
                                    value={datos.telefono}
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
                                    label="Tipo de club"
                                    value={datos.tipoClub}
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
                                    label="Provincia del club"
                                    value={datos.provincia}
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
                                    label="Direccion del club"
                                    value={datos.direccion}
                                    variant="outlined"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>
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
                                        onClick={handleClickEditPersona}
                                        className={classes.personaBtnEditar}
                                    >
                                        <EditOutlined fontSize="large" />
                                    </IconButton>
                                    <EditPersona
                                        open={openEditPersona}
                                        handleClose={handleCloseEditPersona}
                                        persona={personasSeleccionadas}
                                    />
                                    {console.log(personasSeleccionadas)}
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
                                                    Sexo
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="left">
                                                <Typography variant="h6">
                                                    Tipo
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="left">
                                                <Typography variant="h6">
                                                    Categoria
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="left">
                                                <Typography variant="h6">
                                                    Peso
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
                                                                {row.Sexo}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell align="left">
                                                            <Typography>
                                                                {row.Tipo}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell align="left">
                                                            <Typography>
                                                                {row.Categoria}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell align="left">
                                                            <Typography>
                                                                {row.Peso}
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
                    <IconButton className={classes.loading}>
                        <HourglassEmptyOutlined/>
                    </IconButton>
                )}
            </ThemeProvider>
        </div>
    );
}
