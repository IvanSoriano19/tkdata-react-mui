import React, { useCallback, useEffect, useState } from "react";
import { Navbar } from "../../home/Navbar";
import {
    Container,
    makeStyles,
    Grid,
    TextField,
    Button,
    ThemeProvider,
    createTheme,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@material-ui/core";
import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    where,
} from "firebase/firestore";
import { db } from "../../../firebase-config";
import { useAuth } from "../../../context/authContext";
// import { Personas } from "./Personas.js";

const useStyles = makeStyles((theme) => ({
    root: {
        alignItems: "center",
        width: "90%",
    },
    global: {
        alignItems: "center",
        width: "80%",
        backgroundColor: "#f8f6f4",
        borderRadius: "15px",
        marginTop: "30px",
    },
    miclub: {
        width: "100%",
        textAlign: "center",
    },
    miclubBtn: {
        justifyContent: "flex-end",
    },
}));

const theme = createTheme({
    palette: {
        primary: {
            main: "#447cc1",
        },
    },
});

export function MiClub() {
    const classes = useStyles();
    const { user } = useAuth();
    const [datos, setDatos] = useState(null);
    const [datosPersonas, setDatosPersonas] = useState([]);

    const getData = useCallback(async () => {
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
    }, [user]);

    useEffect(() => {
        getData();
    }, [user, getData]);

    useEffect(() => {
        const obtenerDatos = async () => {
            const datosQuery = query(
                collection(db, "Personas"),
                where("Club", "==", datos.club.name)
            );
            const datosSnapshot = await getDocs(datosQuery);
            const datosPers = datosSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setDatosPersonas(datosPers);
        };

        obtenerDatos();
    }, [datos]);

    return (
        <div>
            <Navbar />
            <ThemeProvider theme={theme} className={classes.root}>
                {datos && datos.club ? (
                    formData(classes, datos)
                ) : (
                    <div>Loading</div>
                )}
                {datos && datos.club ? (
                    tablaPersonas(classes, datosPersonas)
                ) : (
                    <div>Loading</div>
                )}
            </ThemeProvider>
        </div>
    );
}

function tablaPersonas(classes, datosPersonas) {
    return (
        <Grid container className={classes.global}>
            <Grid item xs={12} sm={12} className={classes.miclubBtn}>
                {/* TODO: se va mirando
                    crear el boton de crear personas
                */}
                <Button variant="contained" color="primary">
                    Crear
                </Button>
            </Grid>
            <TableContainer>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">
                                <Typography>Nombre</Typography>
                            </TableCell>
                            <TableCell align="left">
                                <Typography>Apellido</Typography>
                            </TableCell>
                            <TableCell align="left">
                                <Typography>Edad</Typography>
                            </TableCell>
                            <TableCell align="left">
                                <Typography>Categoria</Typography>
                            </TableCell>
                            <TableCell align="left">
                                <Typography>Tipo</Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {datosPersonas.map((row) => (
                            <TableRow>
                                <TableCell align="left">
                                    <Typography>{row.Nombre}</Typography>
                                </TableCell>
                                <TableCell align="left">
                                    <Typography>{row.Apellido}</Typography>
                                </TableCell>
                                <TableCell align="left">
                                    <Typography>{row.Edad}</Typography>
                                </TableCell>
                                <TableCell align="left">
                                    <Typography>{row.Categoria}</Typography>
                                </TableCell>
                                <TableCell align="left">
                                    <Typography>{row.Tipo}</Typography>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Grid>
    );
}

function formData(classes, datos) {
    return (
        <Container maxWidth="md" className={classes.global}>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={12} className={classes.miclubBtn}>
                    {/* TODO: se va mirando
                        hay que hacer que los textfield se habiliten menos el email del club(ya que es con lo que se inicia sesion)
                    */}
                    <Button variant="contained" color="primary">
                        Editar
                    </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        className={classes.miclub}
                        disabled
                        label="Nombre del club"
                        defaultValue={datos.club.name}
                        variant="outlined"
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        className={classes.miclub}
                        disabled
                        label="Email del club"
                        defaultValue={datos.club.email}
                        variant="outlined"
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        className={classes.miclub}
                        disabled
                        label="Telefono del club"
                        defaultValue={datos.club.telefono}
                        variant="outlined"
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        className={classes.miclub}
                        disabled
                        label="Provincia del club"
                        defaultValue={datos.club.provincia}
                        variant="outlined"
                    />
                </Grid>
            </Grid>
        </Container>
    );
}
