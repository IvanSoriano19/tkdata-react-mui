import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/authContext";
import { Navbar } from "./Navbar";
import {
    Container,
    makeStyles,
    Grid,
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
import { db } from "../../firebase-config";

const useStyles = makeStyles((theme) => ({
    global: {
        alignItems: "center",
        width: "99%",
        marginTop: "100px",
    },
    leftSide: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "left",
        backgroundColor: "#f8f6f4",
        borderRadius: "15px",
        marginRight: "0px",
    },
    rightSide: {
        // Estilos para la mitad derecha
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f8f6f4",
        borderRadius: "15px",
    }
}));

export function Home() {
    const classes = useStyles();

    const { user, loading } = useAuth();
    const [datos, setDatos] = useState(null);
    const [datosPersonas, setDatosPersonas] = useState([]);
    console.log(user);

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
            console.log("datosSnapshot ", datosSnapshot);
            console.log("datosPers ", datosPers);
            setDatosPersonas(datosPers);
        };
        obtenerDatos();
    }, [datos]);

    if (loading) return <h1>LOADING...</h1>;

    return (
        // TODO: dividir el home
        <div>
            <Navbar />

            <Container maxWidth="md" className={classes.global}>
                <Grid container spacing={2}>
                    <Grid item xs={6} className={classes.leftSide}>
                        <Grid item xs={12} sm={12}>
                            <TableContainer>
                                <Table
                                    className={classes.table}
                                    aria-label="simple table"
                                >
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="left">
                                                <Typography variant="h6">Nombre</Typography>
                                            </TableCell>
                                            <TableCell align="left">
                                                <Typography variant="h6">
                                                    Apellido
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="left">
                                                <Typography variant="h6">Edad</Typography>
                                            </TableCell>
                                            <TableCell align="left">
                                                <Typography variant="h6">
                                                    Categoria
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
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
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                    </Grid>
                    <Grid item xs={1}></Grid>
                    <Grid item xs={5} className={classes.rightSide}>
                        <Typography variant="h6">Texto de Ejemplo</Typography>
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
}
