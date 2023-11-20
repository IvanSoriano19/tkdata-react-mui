import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    TextField,
    makeStyles,
    MenuItem,
    Select,
    InputLabel,
    FormControl
} from "@material-ui/core";
import React, { useState } from "react";
import { db } from "../../../firebase-config";
import { addDoc, collection } from "firebase/firestore";

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
    const cadeteM = ["-33 Kg", "-37 Kg", "-41 Kg", "-45 Kg", "-49 Kg", "-53 Kg", "-57 Kg", "-61 Kg", "-65 Kg", "+65 Kg"];
    const cadeteF = ["-29 Kg", "-33 Kg", "-37 Kg", "-41 Kg", "-44 Kg", "-47 Kg", "-51 Kg", "-55 Kg", "-59 Kg", "+59 Kg"];
    const juniorM = ["-45 Kg", "-48 Kg", "-51 Kg", "-55 Kg", "-59 Kg", "-63 Kg", "-68 Kg", "-73 Kg", "-78 Kg", "+78 Kg"];
    const juniorF = ["-42 Kg", "-44 Kg", "-46 Kg", "-49 Kg", "-52 Kg", "-55 Kg", "-59 Kg", "-63 Kg", "-68 Kg", "+68 Kg"];
    const seniorM = ["-54 Kg", "-58 Kg", "-63 Kg", "-68 Kg", "-74 Kg", "-80 Kg", "-87 Kg", "+87 Kg"];
    const seniorF = ["-46 Kg", "-49 Kg", "-53 Kg", "-57 Kg", "-62 Kg", "-67 Kg", "-73 Kg", "+73 Kg"];
    const [persona, setPersona] = useState({
        Nombre: "",
        Apellido: "",
        Club: club,
        Edad: "",
        Categoria: "",
        Peso: "",
        Tipo: "",
    });

    const handleSubmit = async () => {
        await addDoc(collection(db, "Personas"), {
            ...persona,
        });
        setTimeout(1000);
        setPersona({
            Nombre: "",
            Apellido: "",
            Club: club,
            Edad: "",
            Categoria: "",
            Peso: "",
            Tipo: "",
        });
        handleClose();
    };
    const handleChange = ({ target: { id, value } }) => {
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
                        <Grid item xs={12} sm={3}>
                            <FormControl
                                variant="outlined"
                                fullWidth
                            >
                                <InputLabel id="demo-simple-select-outlined-label">
                                    Categoria
                                </InputLabel>
                                <Select
                                    id="Categoria"
                                    onChange={handleChange}
                                    required
                                >
                                    <MenuItem value={"Cadete"}>Cadete</MenuItem>
                                    <MenuItem value={"Junior"}>Junior</MenuItem>
                                    <MenuItem value={"Senior"}>Senior</MenuItem>
                                    <MenuItem value={"Entrenador"}>Entrenador</MenuItem>
                                </Select>
                            </FormControl>
                            {/* <TextField
                                variant="outlined"
                                fullWidth
                                id="Categoria"
                                placeholder="Cadete / Junior / Senior"
                                label="Categoria"
                                onChange={handleChange}
                            /> */}
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="Peso"
                                label="Peso"
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={3}>
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
