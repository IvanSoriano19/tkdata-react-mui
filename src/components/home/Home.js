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
    Card,
    CardContent,
    IconButton
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
    },
    campeonatos:{
        display:"flex",
        alignItems: "center",
        justifyContent: "center",
        margin:"10px"
    },
    campeonatoNombre:{
        marginBottom:"5px"
    },
    card: {
        marginBottom:"20px",
    },
    container: {
        display: "flex",
        alignItems: "flex-start", 
        justifyContent: "space-between", 
        width: "100%",
        marginTop: "100px",
    },
}));

export function Home() {
    const classes = useStyles();

    const { user, loading } = useAuth();
    const [datos, setDatos] = useState(null);
    const [datosPersonas, setDatosPersonas] = useState([]);
    const [datosCampeonatos, setDatosCampeonatos] = useState(null);
    const [clubesUsuario, setClubesUsuario] = useState([]);
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

    const obtenerDatosCampeonatos = async () => {
        try {
            const campeonatosQuery = query(collection(db, "Campeonatos"));
            const campeonatosSnapshot = await getDocs(campeonatosQuery);
            const campeonatosData = {};
            await Promise.all(
                campeonatosSnapshot.docs.map(async (doc1) => {
                    const data = doc1.data();
                    const clubesUids = Object.values(data.clubes);
                    const clubesPromises = clubesUids.map(async (nombre) => {
                        try {
                            const clubQuery = query(
                                collection(db, "clubes"),
                                where("name", "==", nombre)
                            );
                            const clubSnapshot = await getDocs(clubQuery);
                        if (!clubSnapshot.empty) {
                            const clubData = clubSnapshot.docs[0].data();
                            return { [clubData.id]: clubData.name };
                        }
                        return null;
                        } catch (error) {
                            console.error(
                                "Error al obtener el documento del club:",
                                error
                            );
                            return null;
                        }
                    });

                    const clubesData = await Promise.all(clubesPromises);
                    const clubesObject = Object.assign({}, ...clubesData);

                    campeonatosData[doc1.id] = {
                        id: doc1.id,
                        ...data,
                        clubes: clubesObject,
                    };
                })
            );

            setDatosCampeonatos(campeonatosData);
            console.log(campeonatosData);
        } catch (error) {
            console.error("Error al obtener datos de campeonatos:", error);
            setDatosCampeonatos({});
        }
    };

    const obtenerClubesUsuario = async () => {
        try {
            const docRef = doc(db, "clubes", user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                setClubesUsuario(data.name || []);
            } else {
                setClubesUsuario([]);
            }
        } catch (error) {
            console.error(error);
            setClubesUsuario([]);
        }
    };

    const campeonatosUsuario = datosCampeonatos
    ? Object.values(datosCampeonatos).filter((campeonato) => {
            const clubesCampeonato =  Object.values(campeonato.clubes || {});
            return clubesCampeonato.some((club) => club === clubesUsuario);
        })
    : [];

    const mostrarCampeonatos = (ctos) => {
        return(
            ctos &&
                Object.values(ctos).map((campeonato) => (
                    <Grid item xs={12} key={campeonato.id}>
                        <Card className={classes.card}> 
                            <CardContent>
                                <Typography className={classes.campeonatoNombre} spacing={2} variant="h5">{campeonato.nombre}</Typography>
                                <Grid container spacing={1}>
                                    <Grid item xs={12}><Typography>Fecha: {campeonato.fecha}</Typography></Grid>
                                    <Grid item xs={12}><Typography>Lugar: {campeonato.lugar}</Typography></Grid>
                                    <Grid item xs={12}><Typography>Organizador: {campeonato.organizador}</Typography></Grid>
                                    <Grid item xs={12}><Typography>Categoria: {campeonato.categoria}</Typography></Grid>
                                    <Grid item xs={6}><Typography>Clubes inscritos: {campeonato.clubes ? Object.values(campeonato.clubes).length  : 0}</Typography></Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                ))
        )
    }

    useEffect(() => {
        obtenerDatosCampeonatos();
        obtenerClubesUsuario();
    }, []);


    if (loading) return <h1>LOADING...</h1>;

    return (
        // TODO: dividir el home
        <div>
            <Navbar />

            <Container maxWidth="md" className={classes.global}>
                <Grid container spacing={2} className={classes.container}>
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
                    <Grid container xs={5} className={classes.rightSide}>
                        <Grid item className={classes.campeonatos} xs={12} sm={12} spacing={2}>
                            <Typography variant="h4">Mis campeonatos</Typography>
                        </Grid>
                        <Grid item xs={10}  spacing={2}>
                        {mostrarCampeonatos(campeonatosUsuario)}
                        </Grid>
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
}
