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
} from "@material-ui/core";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase-config";
import { useAuth } from "../../../context/authContext";
import { Personas } from "./Personas.js";

const useStyles = makeStyles((theme) => ({
    global: {
        alignItems: "center",
        width: "92%",
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

    return (
        <div>
            <Navbar />
            <ThemeProvider theme={theme}>
                {datos && datos.club ? (
                    formData(classes, datos)
                ) : (
                    <div>Loading</div>
                )}

                <Personas/>
            </ThemeProvider>
        </div>
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
