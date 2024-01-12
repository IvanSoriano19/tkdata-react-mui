import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    TextField,
    makeStyles,
    RadioGroup,
    FormControlLabel,
    FormControl,
    Select,
    InputLabel,
    MenuItem,
    Radio,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { db } from "../../../firebase-config";
import { doc, getDoc, updateDoc } from "firebase/firestore";

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

export function EditPersona(props) {
    const classes = useStyles();
    const { open, handleClose, persona } = props;
    const cadeteM = [
        "-33 Kg",
        "-37 Kg",
        "-41 Kg",
        "-45 Kg",
        "-49 Kg",
        "-53 Kg",
        "-57 Kg",
        "-61 Kg",
        "-65 Kg",
        "+65 Kg",
    ];
    const cadeteF = [
        "-29 Kg",
        "-33 Kg",
        "-37 Kg",
        "-41 Kg",
        "-44 Kg",
        "-47 Kg",
        "-51 Kg",
        "-55 Kg",
        "-59 Kg",
        "+59 Kg",
    ];
    const juniorM = [
        "-45 Kg",
        "-48 Kg",
        "-51 Kg",
        "-55 Kg",
        "-59 Kg",
        "-63 Kg",
        "-68 Kg",
        "-73 Kg",
        "-78 Kg",
        "+78 Kg",
    ];
    const juniorF = [
        "-42 Kg",
        "-44 Kg",
        "-46 Kg",
        "-49 Kg",
        "-52 Kg",
        "-55 Kg",
        "-59 Kg",
        "-63 Kg",
        "-68 Kg",
        "+68 Kg",
    ];
    const seniorM = [
        "-54 Kg",
        "-58 Kg",
        "-63 Kg",
        "-68 Kg",
        "-74 Kg",
        "-80 Kg",
        "-87 Kg",
        "+87 Kg",
    ];
    const seniorF = [
        "-46 Kg",
        "-49 Kg",
        "-53 Kg",
        "-57 Kg",
        "-62 Kg",
        "-67 Kg",
        "-73 Kg",
        "+73 Kg",
    ];
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
    const [sexoSeleccionado, setSexoSeleccionado] = useState("");
    const [pesoSeleccionado, setPesoSeleccionado] = useState("");
    const [tipoSeleccionado, setTipoSeleccionado] = useState("");
    const [contenidoFiltrado, setContenidoFiltrado] = useState([]);
    const [datos, setDatos] = useState("");

    useEffect(() => {
        const getData = async () => {
            try {
                console.log(persona);
                const docRef = doc(db, "Personas", persona[0]);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    console.log("docsnap 132", docSnap);
                    setDatos(data);

                    setPesoSeleccionado(data.Peso || "");
                    if (data.Categoria === "Cadete") {
                        if (data.Sexo === "Masculino") {
                            setContenidoFiltrado(cadeteM);
                        } else {
                            setContenidoFiltrado(cadeteF);
                        }
                    } else if (data.Categoria === "Junior") {
                        if (data.Sexo === "Masculino") {
                            setContenidoFiltrado(juniorM);
                        } else {
                            setContenidoFiltrado(juniorF);
                        }
                    } else if (data.Categoria === "Senior") {
                        if (data.Sexo === "Masculino") {
                            setContenidoFiltrado(seniorM);
                        } else {
                            setContenidoFiltrado(seniorF);
                        }
                    }
                } else {
                    setDatos(null);
                }
            } catch (error) {
                console.error(error);
                setDatos(null);
            }
        };
        getData();
    }, []);

    console.log("1", datos);

    useEffect(() => {
        if (datos) {
            setEditPersona({
                Nombre: datos.Nombre || "",
                Apellido: datos.Apellido || "",
                Club: datos.Club || "clb",
                Edad: datos.Edad || "",
                Categoria: datos.Categoria || "",
                Peso: datos.Peso || "",
                Tipo: datos.Tipo || "",
                Sexo: datos.Sexo || "",
            });
        }
    }, [datos]);

    const [editPersona, setEditPersona] = useState({
        Nombre: datos.Nombre || "",
        Apellido: datos.Apellido || "",
        Club: datos.Club || "clb",
        Edad: datos.Edad || "",
        Categoria: datos.Categoria || "",
        Peso: datos.Peso || "",
        Tipo: datos.Tipo || "",
        Sexo: datos.Sexo || "",
    });
    console.log("2", datos.Nombre);
    console.log("3", editPersona);

    const handleChange = (event, campo) => {
        const { value } = event.target;
        console.log("handle change => ", editPersona);
        setEditPersona((prevPersona) => ({ ...prevPersona, [campo]: value }));
    };
    useEffect(() => {
        console.log("categoria ",editPersona.Categoria)
        console.log("sexo ",editPersona.Sexo)
        if (editPersona.Categoria === "Cadete") {
            if (editPersona.Sexo === "Masculino") {
                setContenidoFiltrado(cadeteM);
            } else {
                setContenidoFiltrado(cadeteF);
            }
        } else if (editPersona.Categoria === "Junior") {
            if (editPersona.Sexo === "Masculino") {
                setContenidoFiltrado(juniorM);
            } else {
                setContenidoFiltrado(juniorF);
            }
        } else if (editPersona.Categoria === "Senior") {
            if (editPersona.Sexo === "Masculino") {
                setContenidoFiltrado(seniorM);
            } else {
                setContenidoFiltrado(seniorF);
            }
        }
    }, [categoriaSeleccionada, sexoSeleccionado]);

    const handleChangeCategoria = (event) => {
        const categoria = event.target.value;
        setCategoriaSeleccionada(categoria);
    };
    const handleChangeSexo = (event) => {
        const sexo = event.target.value;
        setSexoSeleccionado(sexo);
    };
    const handleChangeTipo = (event) => {
        const tipo = event.target.value;
        setTipoSeleccionado(tipo);
    };
    const handleChangePeso = (event) => {
        const peso = event.target.value;
        setPesoSeleccionado(peso);
    };

    const handleSubmit = async (event) => {
        try {
            event.preventDefault();

            console.log("submit", persona[0]);
            const docRef = doc(db, "Personas", persona[0]);
            console.log("docref", docRef);
            await updateDoc(docRef, {
                ...editPersona,
            });
            handleClose();
        } catch (error) {
            console.error("Error al guardar en la base de datos:", error);
        }
    };

    console.log("4", editPersona);
    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Editar alumno o entrenador</DialogTitle>
            <DialogContent>
                <form className={classes.form}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="name"
                                variant="outlined"
                                required
                                fullWidth
                                id="Nombre"
                                label="Nombre"
                                value={editPersona.Nombre}
                                onChange={(e) => handleChange(e, "Nombre")}
                            />
                            {console.log("5", editPersona)}
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="outlined"
                                fullWidth
                                id="Apellido"
                                label="Apellido"
                                value={editPersona.Apellido}
                                onChange={(e) => handleChange(e, "Apellido")}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <RadioGroup
                                required
                                fullWidth
                                row
                                value={editPersona.Sexo}
                                id="Sexo"
                                onChange={(e) => {
                                    handleChange(e, "Sexo");
                                    handleChangeSexo(e);
                                }}
                            >
                                <FormControlLabel
                                    value="Masculino"
                                    control={<Radio />}
                                    label="Masculino"
                                />
                                <FormControlLabel
                                    value="Femenino"
                                    control={<Radio />}
                                    label="Femenino"
                                />
                            </RadioGroup>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="Edad"
                                label="Edad"
                                value={editPersona.Edad}
                                onChange={(e) => handleChange(e, "Edad")}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <FormControl
                                variant="outlined"
                                fullWidth
                                label="Tipo"
                                id="Tipo"
                            >
                                <InputLabel>Tipo</InputLabel>
                                <Select
                                    id="Tipo"
                                    value={editPersona.Tipo}
                                    onChange={(e) => {
                                        handleChange(e, "Tipo");
                                        handleChangeTipo(e);
                                    }}
                                    required
                                    label="Tipo"
                                >
                                    <MenuItem value={"Competidor"}>
                                        Competidor
                                    </MenuItem>
                                    <MenuItem value={"Entrenador"}>
                                        Entrenador
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
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
                                        handleChange(e, "Categoria");
                                        handleChangeCategoria(e);
                                    }}
                                    required
                                    label="Categoria"
                                    value={editPersona.Categoria}
                                >
                                    <MenuItem value={"Cadete"}>Cadete</MenuItem>
                                    <MenuItem value={"Junior"}>Junior</MenuItem>
                                    <MenuItem value={"Senior"}>Senior</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl
                                variant="outlined"
                                required
                                fullWidth
                                id="Peso"
                                label="Peso"
                            >
                                <InputLabel>Peso</InputLabel>
                                <Select
                                    label="Continido Filtrado"
                                    value={editPersona.Peso}
                                    onChange={(e) => {
                                        handleChangePeso(e);
                                        handleChange(e, "Peso");
                                    }}
                                >
                                    {console.log(contenidoFiltrado)}
                                    {contenidoFiltrado.map((op, index) => (
                                        <MenuItem key={index} value={op}>
                                            {op}
                                        </MenuItem>
                                    ))}
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
