import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    TextField,
    makeStyles,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { db } from "../../../firebase-config";
import { doc,  updateDoc } from "firebase/firestore";

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

export function EditCampeonato(props) {
    const classes = useStyles();
    const { open, handleClose, campeonato } = props;
    const [editCampeonato, setEditCampeonato] = useState({
        nombre: campeonato.nombre || "",
        lugar: campeonato.lugar || "",
        direccion: campeonato.direccion || "",
        categoria: campeonato.categoria || "",
        tipo: campeonato.tipo || "",
        fecha: campeonato.fecha || "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const docRef = doc(db, "Campeonatos", campeonato.id);
        await updateDoc(docRef, {
            ...editCampeonato,
        });
        handleClose();
    };
    const handleChange = (event, campo) => {
        const { value } = event.target;
        setEditCampeonato({ ...editCampeonato, [campo]: value });
        console.log(editCampeonato);
    };

    useEffect(() => {
        setEditCampeonato({
            nombre: campeonato.nombre || "",
            lugar: campeonato.lugar || "",
            direccion: campeonato.direccion || "",
            categoria: campeonato.categoria || "",
            tipo: campeonato.tipo || "",
            fecha: campeonato.fecha || "",
        });
    }, [campeonato]);

    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
    const handleChangeCategoria = (event) => {
        const categoria = event.target.value;
        setCategoriaSeleccionada(categoria);
    };

    const [tipoSeleccionado, setTipoSeleccionado] = useState("")
    const handleChangeTipo = (event) => {
        const tipo = event.target.value;
        setCategoriaSeleccionada(tipo);
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Editar Campeonato</DialogTitle>
            <DialogContent>
                <form className={classes.form} onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="name"
                                variant="outlined"
                                fullWidth
                                id="nombre"
                                label="Nombre"
                                value={editCampeonato.nombre}
                                onChange={(e) => {
                                    handleChange(e, "nombre");
                                }}
                                autoFocus
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                id="fecha"
                                label="Fecha"
                                type="date"
                                value={editCampeonato.fecha}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                onChange={(e) => {
                                    handleChange(e, "fecha");
                                }}
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <TextField
                                variant="outlined"
                                fullWidth
                                id="direccion"
                                label="Direccion"
                                value={editCampeonato.direccion}
                                onChange={(e) => {
                                    handleChange(e, "direccion");
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="outlined"
                                fullWidth
                                id="lugar"
                                label="Lugar"
                                value={editCampeonato.lugar}
                                onChange={(e) => {
                                    handleChange(e, "lugar");
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl
                                variant="outlined"
                                fullWidth
                                label="Tipo"
                                id="tipo"
                            >
                                <InputLabel>Tipo</InputLabel>
                                <Select
                                    id="tipo"
                                    onChange={(e) => {
                                        handleChange(e, "tipo");
                                        handleChangeTipo(e);
                                    }}
                                    required
                                    label="Tipo de campeonato"
                                    value={editCampeonato.tipo}
                                >
                                    <MenuItem value={"Autonomico"}>
                                        Autonomico
                                    </MenuItem>
                                    <MenuItem value={"Liga"}>Liga</MenuItem>
                                    <MenuItem value={"Open"}>Open</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl
                                variant="outlined"
                                fullWidth
                                label="Categoria"
                                id="Categoria"
                            >
                                <InputLabel>Categoria</InputLabel>
                                <Select
                                    id="Categoria"
                                    onChange={(e) => {
                                        handleChange(e, "categoria");
                                        handleChangeCategoria(e);
                                    }}
                                    required
                                    label="Categoria"
                                    value={editCampeonato.categoria}
                                >
                                    <MenuItem value={"Cadete"}>Cadete</MenuItem>
                                    <MenuItem value={"Junior"}>Junior</MenuItem>
                                    <MenuItem value={"Senior"}>Senior</MenuItem>
                                </Select>
                            </FormControl>
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
