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
import { doc, updateDoc} from "firebase/firestore";

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

export function EditClub(props) {
    const classes = useStyles();
    const { open, handleClose, club } = props;
    const [editClub, setEditClub] = useState({
        telefono: club.telefono || "",
        tipoClub: club.tipoClub || "",
        provincia: club.provincia || "",
        direccion: club.direccion || ""
    });

    const handleSubmit = async (e) => {
        e.preventDefault()
        const docRef = doc(db, "clubes", club.id);
        await updateDoc(docRef,{
            ...editClub
        });
        setTimeout(1000)
        handleClose();
    };
    const handleChange = ({target: { id, value }}) => {
        console.log(editClub)
        setEditClub({ ...editClub, [id]: value });
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Editar club</DialogTitle>
            <DialogContent>
                <form className={classes.form} onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="name"
                                variant="outlined"
                                fullWidth
                                id="telefono"
                                label="Telefono"
                                value={editClub.telefono}
                                onChange={handleChange}
                                autoFocus
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="outlined"
                                fullWidth
                                id="tipoClub"
                                label="Tipo de club"
                                value={editClub.tipoClub}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="outlined"
                                fullWidth
                                id="provincia"
                                label="Provincia"
                                value={editClub.provincia}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                variant="outlined"
                                fullWidth
                                id="direccion"
                                label="Direccion"
                                value={editClub.direccion}
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
                        Guardar cambios
                    </Button>
                </form>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancelar</Button>
            </DialogActions>
        </Dialog>
    );
}
