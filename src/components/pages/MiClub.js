import React, { useCallback, useEffect, useState } from "react";
import { Navbar } from "../home/Navbar";
import { Container, makeStyles, Grid, TextField } from "@material-ui/core";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase-config";
import { useAuth } from "../../context/authContext";

const useStyles = makeStyles((theme) => ({
    global: {
        alignItems: "center",
        width: "90%",
        backgroundColor: "#f8f6f4",
        marginTop: "20px"
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: "#e55156",
    },
    form: {
        width: "100%",
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
        backgroundColor: "#447cc1",
        "&:hover": {
            backgroundColor: "#2765B0",
        },
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: "center",
        color: theme.palette.text.secondary,
    },
}));

export function MiClub() {
    const classes = useStyles();
    const { user } = useAuth();
    const [datos, setDatos] = useState(null);

    const getData = useCallback(async () => {
        const docRef = doc(db, "clubes", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            console.log(data);
            setDatos(data);
        } else {
            console.log("El documento no existe");
        }
    }, [user]);

    useEffect(() => {
        getData();
    }, [user, getData]);

    return (
        <div>
            <Navbar />
            {datos && datos.club ? (
                <Container maxWidth="md" className={classes.global}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField disabled label="Nombre del club" defaultValue={datos.club.name} variant="outlined"/>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField disabled label="Email del club" defaultValue={datos.club.email} variant="outlined"/>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField disabled label="Telefono del club" defaultValue={datos.club.telefono} variant="outlined"/>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField disabled label="Provincia del club" defaultValue={datos.club.provincia} variant="outlined"/>
                        </Grid>
                    </Grid>
                </Container>
            ) : (
                <p>no hay datos</p>
            )}
        </div>
    );
}
