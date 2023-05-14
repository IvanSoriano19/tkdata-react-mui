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
import { Personas } from "./Personas";
import { EditClub } from "./EditClub";
// import { Personas } from "./Personas.js";

const theme = createTheme({
    palette: {
        primary: {
            main: "#447cc1",
        },
    },
});

const useStyles = makeStyles((theme) => ({
    root: {
        // alignItems: "center",
        width: "90%",
        margin: "auto",
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
    list: {
        // pendiente centrar la mierda esta me cago en todo
        marginTop: "30px",
        width: "80%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f8f6f4",
        borderRadius: "15px",
        paddingLeft: "13%",
    },
}));



export function MiClub() {
    const classes = useStyles();
    const { user } = useAuth();
    const [datos, setDatos] = useState(null);
    const [datosPersonas, setDatosPersonas] = useState([]);
    const [open, setOpen] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);

    const handleClick = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleClickEdit = () => {
        setOpenEdit(true);
    };

    const handleCloseEdit = () => {
        setOpenEdit(false);
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
        const obtenerDatos = async () => {
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
        };
        obtenerDatos();
    }, [datos]);

    return (
        <div>
            <Navbar />
            <ThemeProvider theme={theme} className={classes.root}>
                {datos ? (
                    <Container maxWidth="md" className={classes.global}>
                        <Grid container spacing={2}>
                            <Grid
                                item
                                xs={12}
                                sm={12}
                                className={classes.miclubBtn}
                            >
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleClickEdit}
                                >
                                    Editar
                                </Button>
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
                                    defaultValue={datos.name}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    className={classes.miclub}
                                    disabled
                                    label="Email del club"
                                    defaultValue={datos.email}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    className={classes.miclub}
                                    disabled
                                    label="Telefono del club"
                                    defaultValue={datos.telefono}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    className={classes.miclub}
                                    disabled
                                    label="Tipo de club"
                                    defaultValue={datos.tipoClub}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    className={classes.miclub}
                                    disabled
                                    label="Provincia del club"
                                    defaultValue={datos.provincia}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    className={classes.miclub}
                                    disabled
                                    label="Direccion del club"
                                    defaultValue={datos.direccion}
                                    variant="outlined"
                                />
                            </Grid>
                        </Grid>
                    </Container>
                ) : (
                    <div>Loading</div>
                )}
                {datos ? (
                    <Grid container className={classes.global}>
                        <Grid
                            item
                            xs={12}
                            sm={12}
                            className={classes.miclubBtn}
                        >
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleClick}
                            >
                                Crear
                            </Button>
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
                                            <TableCell align="left">
                                                <Typography>Nombre</Typography>
                                            </TableCell>
                                            <TableCell align="left">
                                                <Typography>
                                                    Apellido
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="left">
                                                <Typography>Edad</Typography>
                                            </TableCell>
                                            <TableCell align="left">
                                                <Typography>
                                                    Categoria
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="left">
                                                <Typography>Tipo</Typography>
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {/* mirar a ver como eliminar alguna persona */}
                                        {datosPersonas.map((row) => (
                                            <TableRow>
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
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                    </Grid>
                ) : (
                    <div>Loading</div>
                )}
            </ThemeProvider>
        </div>
    );
}
