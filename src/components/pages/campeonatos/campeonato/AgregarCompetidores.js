import {
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    Grid,
    makeStyles,
    createTheme,
    ThemeProvider,
    Table,
    TableContainer,
    TableCell,
    TableBody,
    TableHead,
    TableRow,
    Typography,
    Checkbox,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../../../firebase-config";
import {
    collection,
    doc,
    getDoc,
    getDocs,
    getFirestore,
    query,
    updateDoc,
    where,
    writeBatch,
} from "firebase/firestore";
import { useAuth } from "../../../../context/authContext";

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
    dialog: {
        width: "100%",
        maxWidth: "100%",
    },
    fullWidthTable: {
        width: "100%",
    },
    
}));

export function AgregarCompetidores(props) {
    const classes = useStyles();
    const { open, handleClose, idCampeonato } = props;
    const { user } = useAuth();
    const navigate = useNavigate();
    const [datos, setDatos] = useState("");
    const [datosCampeonato, setDatosCampeonato] = useState("");
    const [datosPersonas, setDatosPersonas] = useState([]);
    const [personasSeleccionadas, setPersonasSeleccionadas] = useState([]);

    const handleSubmit = async (e) => {
        
    };
    const getDataCampeonato = async () => {
        try {
            const docRef = doc(db, "Campeonatos", idCampeonato);
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
                const data = docSnap.data();
                console.log(data)
                setDatosCampeonato(data);
            } else {
                setDatosCampeonato(null);
            }
        } catch (error) {
            console.error(error);
        }
    }

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
        getDataCampeonato();
    }, [user]);

    useEffect(() => {
        const obtenerDatos = async () => {
            const datosQuery = query(
                collection(db, "Personas"),
                where("Club", "==", datos.name),
                where("Categoria", "==", datosCampeonato.categoria),
                // where("Tipo", "==", "Entrenador"),
                // where("Categoria", "==", ""),
            );
            const queryEntrenadores = query(
                collection(db, "Personas"),
                where("Club", "==", datos.name),
                where("Tipo", "==", "Entrenador"),
            );

            const datosSnapshot = await getDocs(datosQuery);
            const datosSnapshotEntrenadores = await getDocs(queryEntrenadores);
            
            const datosPers = {};
            datosSnapshot.docs.forEach((doc) => {
                datosPers[doc.id] = {
                    id: doc.id,
                    ...doc.data(),
                };
            });
            const datosEntrenadores = {};
            datosSnapshotEntrenadores.docs.forEach((doc) => {
                datosEntrenadores[doc.id] = {
                    id: doc.id,
                    ...doc.data(),
                };
            });

            console.log(datosEntrenadores)
            const datosCombinados = {
                ...datosPers,
                ...datosEntrenadores,
            };
            console.log(datosCombinados)
            setDatosPersonas(datosCombinados);
        };
        obtenerDatos();
    }, [datos]);

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

    const handleGuardarCompetidores = async () => {
        const batch = writeBatch(getFirestore());
        try {
            const campeonatoDoc = await getDoc(
                doc(db, "Campeonatos", idCampeonato)
            );

            if (campeonatoDoc.exists()) {
                const competidoresActuales =
                    campeonatoDoc.data().competidores || [];

                const competidoresNuevosSet = new Set(competidoresActuales);

                personasSeleccionadas.forEach((personaId) => {
                    competidoresNuevosSet.add(personaId);
                });

                const competidoresNuevos = Array.from(competidoresNuevosSet);

                await updateDoc(campeonatoDoc.ref, {
                    competidores: competidoresNuevos,
                });
                handleClose();
                await batch.commit();
            } else {
                console.error("El campeonato no existe");
            }
        } catch (error) {
            console.error("Error al guardar competidores:", error);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Dialog open={open} onClose={handleClose} maxWidth="lg" className={classes.dialog}>
                <DialogTitle>Competidores</DialogTitle>
                <DialogContent >
                    <Grid item xs={12} sm={12}>
                        <TableContainer className={classes.fullWidthTable}>
                            <Table
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
                                                Sexo
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="left">
                                            <Typography variant="h6">
                                                Peso
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="left">
                                            <Typography variant="h6">
                                                Tipo
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
                                                            {row.Sexo}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align="left">
                                                        <Typography>
                                                            {row.Peso}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align="left">
                                                        <Typography>
                                                            {row.Tipo}
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
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onClick={handleGuardarCompetidores}
                    >
                        Guardar Competidores
                    </Button>
                </DialogContent>
            </Dialog>
        </ThemeProvider>
    );
}
