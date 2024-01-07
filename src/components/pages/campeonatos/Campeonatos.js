import React, { useEffect, useState } from "react";
import { Navbar } from "../../home/Navbar";
import {
    Container,
    Grid,
    Typography,
    createTheme,
    makeStyles,
    Card,
    CardContent,
    IconButton,
    ThemeProvider
} from "@material-ui/core";
import { AddBoxRounded} from '@material-ui/icons';
import { useAuth } from "../../../context/authContext";
import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    where,
} from "firebase/firestore";
import { db } from "../../../firebase-config";

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
    campeonatos:{
        display:"flex",
        alignItems: "center",
        justifyContent: "center",
        margin:"10px"
    },
    campeonatoNombre:{
        marginBottom:"5px"
    },
    btnCampeonato: {
        display:"flex",
        alignItems:"right",
        justifyContent: "right",
        marginTop: "-12px",
        color: theme.palette.primary
    }
}));

export function Campeonatos() {
    const classes = useStyles();
    const { user } = useAuth();
    const [datosCampeonatos, setDatosCampeonatos] = useState(null);

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

    useEffect(() => {
        obtenerDatosCampeonatos();
    }, []);

    return (
        <div>
            <Navbar />
            <ThemeProvider theme={theme}>
            <Container maxWidth="md" className={classes.global}>
            <Grid container spacing={2}>
                <Grid container xs={5} className={classes.rightSide}>
                    <Grid className={classes.campeonatos} item xs={12} sm={12} spacing={2}>
                        <Typography variant="h4">Campeonatos</Typography>
                    </Grid>
                    <Grid item xs={10}  spacing={2}>
                        {datosCampeonatos &&
                            Object.values(datosCampeonatos).map((campeonato) => (
                                <Grid item xs={12} key={campeonato.id}>
                                    <Card>
                                        <CardContent>
                                            <Typography className={classes.campeonatoNombre} spacing={2} variant="h5">{campeonato.nombre}</Typography>
                                            <Grid container spacing={1}>
                                                <Grid item xs={12}><Typography>Fecha: {campeonato.fecha}</Typography></Grid>
                                                <Grid item xs={12}><Typography>Lugar: {campeonato.lugar}</Typography></Grid>
                                                <Grid item xs={12}><Typography>Organizador: {campeonato.organizador}</Typography></Grid>
                                                <Grid item xs={12}><Typography>Categorias: {campeonato.categorias}</Typography></Grid>
                                                <Grid item xs={6}><Typography>Clubes inscritos: {campeonato.clubes ? Object.values(campeonato.clubes).length  : 0}</Typography></Grid>
                                                <Grid item xs={6} className={classes.btnCampeonato}>
                                                    <IconButton
                                                        color="primary"
                                                        // onClick={}
                                                        
                                                    >
                                                        <AddBoxRounded/>
                                                    </IconButton>
                                                </Grid>
                                                {console.log(campeonato.clubes)}
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
                    {/* TODO Poner campeonatos en los que estoy inscrito  */}
                </Grid>
            </Grid>
        </Container>
        </ThemeProvider>
        </div>
    );
}
