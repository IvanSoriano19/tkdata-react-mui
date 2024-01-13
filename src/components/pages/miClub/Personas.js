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
    FormControl,
    RadioGroup,
    FormControlLabel,
    Radio,
} from "@material-ui/core";
import React, { setState, useEffect, useState } from "react";
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
    formControl: {
        margin: theme.spacing(1),
        minWidth: 200,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

export function Personas(props) {
    const classes = useStyles();
    const { open, handleClose, club } = props;
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
    const [tipoEntrenador, setTipoEntrenador] = useState(false)
    const [contenidoFiltrado, setContenidoFiltrado] = useState([]);
    const [state, setState] = useState({});
    const forceUpdate = () => setState({});
    const [persona, setPersona] = useState({
        Nombre: "",
        Apellido: "",
        Club: club,
        Edad: "",
        Categoria: "",
        Peso: "",
        Tipo: "",
        Sexo: "",
    });
    const handleChange = (event, campo) => {
        const { value } = event.target;
        setPersona({ ...persona, [campo]: value });
        console.log("handlechange",persona)
    };
    useEffect(() => {
        if (persona.Categoria === "Cadete") {
            if (persona.Sexo === "Masculino") {
                setContenidoFiltrado(cadeteM);
            } else {
                setContenidoFiltrado(cadeteF);
            }
        } else if (persona.Categoria === "Junior") {
            if (persona.Sexo === "Masculino") {
                setContenidoFiltrado(juniorM);
            } else {
                setContenidoFiltrado(juniorF);
            }
        } else if (persona.Categoria === "Senior") {
            if (persona.Sexo === "Masculino") {
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
        if(tipo === "Entrenador"){
            setTipoEntrenador(true);
            setCategoriaSeleccionada("")
            setPesoSeleccionado("")
            persona.Categoria = ""
            persona.Peso = ""
        }else{
            setTipoEntrenador(false);
        }
    };
    const handleChangePeso = (event) => {
        const peso = event.target.value;
        setPesoSeleccionado(peso);
    };
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await addDoc(collection(db, "Personas"), {
                ...persona,
                Peso: pesoSeleccionado,
            });
            setPersona({
                Nombre: "",
                Apellido: "",
                Club: club,
                Edad: "",
                Categoria: "",
                Peso: "",
                Tipo: "",
                Sexo: "",
            });
            setTimeout(() => forceUpdate(), 100);
            handleClose();
        } catch (error) {
            console.error("Error al guardar en la base de datos:", error);
        }
    };
    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Añadir alumno o entrenador</DialogTitle>
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
                                onChange={(e) => handleChange(e, "Nombre")}
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
                                onChange={(e) => handleChange(e, "Apellido")}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <RadioGroup
                                required
                                fullWidth
                                row
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
                                    value={tipoSeleccionado}
                                    onChange={(e) => {
                                        handleChange(e, "Tipo");
                                        handleChangeTipo(e);
                                    }}
                                    required
                                    label="Tipo"
                                >
                                    <MenuItem value={"Competidor"}>Competidor</MenuItem>
                                    <MenuItem value={"Entrenador"}>Entrenador</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        {!tipoEntrenador && (
                            <>
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
                                    value={pesoSeleccionado}
                                    label=""
                                    onChange={(e) => {
                                        handleChangePeso(e);
                                        handleChange(e, "Peso");
                                    }}
                                >
                                    {contenidoFiltrado.map((op, index) => (
                                        <MenuItem key={index} value={op}>
                                            {op}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        </>
                        )}
                        {tipoEntrenador && (
                            <>
                            <Grid item xs={12} sm={6}>
                            <FormControl
                                variant="outlined"
                                fullWidth
                                label="Categoria"
                                id="Categoria"
                                disabled
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
                                disabled
                            >
                                <InputLabel>Peso</InputLabel>
                                <Select
                                    value={pesoSeleccionado}
                                    label=""
                                    onChange={(e) => {
                                        handleChangePeso(e);
                                        handleChange(e, "Peso");
                                    }}
                                >
                                    {contenidoFiltrado.map((op, index) => (
                                        <MenuItem key={index} value={op}>
                                            {op}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        </>
                        )}
                        
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
