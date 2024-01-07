import React, { useEffect, useState } from "react";
import { Navbar } from "../home/Navbar";
import {
    Container,
    Grid,
    Typography,
    createTheme,
    makeStyles,
    Card,
    CardContent
} from "@material-ui/core";
import { useAuth } from "../../context/authContext";
import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    where,
    getFirestore
} from "firebase/firestore";
import { db } from "../../firebase-config";

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
    tituloHeader:{
        alignItems: "center",
        width: "100%",
        display: "flex"
    }
}));

export function Campeonatos() {
    const classes = useStyles();
    const { user } = useAuth();
    const [datos, setDatos] = useState(null);
    const [datosCampeonatos, setDatosCampeonatos] = useState(null);

    const obtenerDatosCampeonatos = async () => {
        try {
            const campeonatosQuery = query(collection(db, "Campeonatos"));
            const campeonatosSnapshot = await getDocs(campeonatosQuery);
            const campeonatosData = {};
            await Promise.all(
                campeonatosSnapshot.docs.map(async (doc1) => {
                    const data = doc1.data();
                    // Obtener datos de los clubes asociados a cada campeonato
                    const clubesUids = Object.values(data.clubes);
                    const clubesPromises = clubesUids.map(async (uid) => {
                        try {
                            const clubDocRef = doc(db, "clubes", uid);
                            const clubDocSnap = await getDoc(clubDocRef);
                            if (clubDocSnap.exists()) {
                                const clubData = clubDocSnap.data();
                                console.log(clubData.name)
                                return { [uid]: clubData.name };
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

    // Llamada a la función para obtener los datos de campeonatos
    useEffect(() => {
        obtenerDatosCampeonatos();
    }, []);

    // useEffect(() => {
    //     const getData = async () => {
    //         try {
    //             const docRef = doc(db, "clubes", user.uid);
    //             const docSnap = await getDoc(docRef);
    //             if (docSnap.exists()) {
    //                 const data = docSnap.data();
    //                 setDatos(data);
    //             } else {
    //                 setDatos(null);
    //             }
    //             console.log(user)
    //         } catch (error) {
    //             console.error(error);
    //             setDatos(null);
    //         }
    //     };
    //     getData();
    // }, [user]);

    // useEffect(() => {
    //     const obtenerDatos = async () => {
    //         const datosQuery = query(
    //             collection(db, "Campeonatos"),
    //             where("organizador", "==", user.id)
    //         );
    //         console.log(datosQuery)
    //         const datosSnapshot = await getDocs(datosQuery);
    //         const datosCto = {};
    //         console.log(datosSnapshot)
    //         datosSnapshot.docs.forEach((doc) => {
    //             datosCto[doc.id] = {
    //                 id: doc.id,
    //                 ...doc.data(),
    //             };
    //         });
    //         setDatosCampeonatos(datosCto);
    //         console.log(datosCto)
    //     };
    //     obtenerDatos();
    // }, [datos]);

    return (
        <div>
            <Navbar />
            <Container maxWidth="md" className={classes.global}>
            <Grid container spacing={2}>
                <Grid container xs={5} className={classes.rightSide}>
                    <Grid item xs={12} sm={12} spacing={2}>
                        <Typography variant="h6">Campeonatos</Typography>
                    </Grid>
                    <Grid item xs={10}  spacing={2}>
                        {datosCampeonatos &&
                            Object.values(datosCampeonatos).map((campeonato) => (
                                <Grid item xs={12} key={campeonato.id}>
                                    <Card>
                                        <CardContent>
                                            <Typography spacing={1} variant="h6">{campeonato.nombre}</Typography>
                                            <Grid container spacing={1}>
                                                <Grid item xs={12}><Typography>Fecha: {campeonato.fecha}</Typography></Grid>
                                                <Grid item xs={12}><Typography>Lugar: {campeonato.lugar}</Typography></Grid>
                                                <Grid item xs={12}><Typography>Organizador: {campeonato.organizador}</Typography></Grid>
                                                <Grid item xs={12}><Typography>Categorias: {campeonato.categorias}</Typography></Grid>
                                                <Grid item xs={12}><Typography>Clubes inscritos: {campeonato.clubes ? Object.values(campeonato.clubes).length : 0}</Typography></Grid>
                                                {console.log(campeonato.organizador)}
                                            </Grid>
                                            {/* Otras propiedades del campeonato... */}
                                            {/* <Typography variant="subtitle1">Clubes:</Typography> */}
                                            {/* <Grid container spacing={2}>
                                                {campeonato.clubes &&
                                                    Object.values(campeonato.clubes).map((club) => (
                                                        <Grid item xs={12} key={Object.keys(club)[0]}>
                                                            <Card>
                                                                <CardContent>
                                                                    <Typography variant="body1">{club[Object.keys(club)[0]].name}</Typography>
                                                                    
                                                                </CardContent>
                                                            </Card>
                                                        </Grid>
                                                    ))}
                                            </Grid> */}
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                    </Grid>
                </Grid>
                <Grid item xs={1}></Grid>
                <Grid item xs={5} className={classes.rightSide}>
                    <Typography variant="h6">Mis campeonatos</Typography>
                    {/* Puedes implementar algo similar aquí para tus campeonatos personales */}
                </Grid>
            </Grid>
        </Container>
        </div>
    );
}
