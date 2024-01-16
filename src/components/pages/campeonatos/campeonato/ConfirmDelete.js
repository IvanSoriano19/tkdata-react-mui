import {
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    Grid,
    makeStyles,
    createTheme,
    ThemeProvider,
} from "@material-ui/core";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../../../firebase-config";
import {
    collection,
    doc,
    getFirestore,
    writeBatch,
} from "firebase/firestore";

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
        backgroundColor: "#e55156",
        "&:hover": {
            backgroundColor: "#e53450",
        },
    },
    submitCancelar: {
        margin: theme.spacing(3, 0, 2),
        backgroundColor: "#447cc1",
        "&:hover": {
            backgroundColor: "#2765B0",
        },
    },
}));

export function ConfirmDelete(props) {
    const classes = useStyles();
    const { open, handleClose, idCampeonato } = props;
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const batch = writeBatch(getFirestore());
        const campeonatoRef = doc(collection(db, "Campeonatos"), idCampeonato);
        console.log("campeonatoRef",campeonatoRef)
        batch.delete(campeonatoRef);

        try {
            await batch.commit();
        } catch (error) {
            console.error("Error al eliminar campeonato:", error);
        }
        navigate("/campeonatos");
    };

    console.log(idCampeonato);

    return (
        <ThemeProvider theme={theme} className={classes.root}>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>
                    Seguro que quieres eliminar el campeonato?
                </DialogTitle>
                <DialogContent>
                    <form className={classes.form} onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="secondary"
                                    className={classes.submit}
                                >
                                    Eliminar
                                </Button>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    className={classes.submitCancelar}
                                    onClick={handleClose}
                                >
                                    Cancelar
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </DialogContent>
            </Dialog>
        </ThemeProvider>
    );
}
