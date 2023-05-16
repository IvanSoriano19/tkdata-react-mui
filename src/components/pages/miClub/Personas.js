import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    TextField,
    makeStyles,
} from "@material-ui/core";
import React, { useState } from "react";
import { db } from "../../../firebase-config";
import { addDoc, collection} from "firebase/firestore";

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: "#e55156",
    },
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
}));

export function Personas(props) {
    const classes = useStyles();
    const { open, handleClose, club } = props;
    const [persona, setPersona] = useState({
        Nombre: "",
        Apellido: "",
        Club: club,
        Edad: "",
        Categoria: "",
        Tipo: "",
    });

    const handleSubmit = async () => {
        await addDoc(collection(db, "Personas"),{
            ...persona
        });
        setTimeout(1000)
        setPersona({
            Nombre: "",
            Apellido: "",
            Club: club,
            Edad: "",
            Categoria: "",
            Tipo: "",
        })
        handleClose();
    };
    const handleChange = ({target: { id, value }}) => {
        setPersona({ ...persona, [id]: value });
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Añadir alumno o entrenador</DialogTitle>
            <DialogContent>
                <form className={classes.form} onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="name"
                                variant="outlined"
                                required
                                fullWidth
                                id="Nombre"
                                label="Nombre"
                                onChange={handleChange}
                                autoFocus
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="Apellido"
                                label="Apellido"
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="Edad"
                                label="Edad"
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={9}>
                            <TextField
                                variant="outlined"
                                fullWidth
                                id="Categoria"
                                placeholder="Cadete / Junior / Senior"
                                label="Categoria"
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                label="Tipo"
                                id="Tipo"
                                placeholder="Entrenador / Competidor"
                                onChange={handleChange}
                            />
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onClick={handleSubmit}
                    >
                        Crear
                    </Button>
                </form>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancelar</Button>
            </DialogActions>
        </Dialog>
    );
}
