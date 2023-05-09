import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    List,
    ListItem,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
    makeStyles,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { db } from "../../../firebase-config";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useAuth } from "../../../context/authContext";

const useStyles = makeStyles((theme) => ({
    global: {
        // alinear la tabla para que esté como el form de miclub
        display: "flex",
        alignItems: "center",
        width: "70%",
        backgroundColor: "#f8f6f4",
        borderRadius: "15px",
        marginTop: "30px",
    },
    table: {
        alignItems: "center",
    },
}));

function SimpleDialog(props) {
    const classes = useStyles();

    const { onClose, selectedValue, open } = props;

    const handleClose = () => {
        onClose(selectedValue);
    };

    const handleListItemClick = (value) => {
        onClose(value);
    };

    return (
        <Dialog
            onClose={handleClose}
            aria-labelledby="simple-dialog-title"
            open={open}
        >
            <DialogTitle id="simple-dialog-title">
                Añade un paciente
            </DialogTitle>
            <List>
                {/* aqui va el formulario */}
                <ListItem>
                    hola
                </ListItem>

                <ListItem
                    autoFocus
                    button
                    onClick={() => handleListItemClick("addAccount")}
                >
            
                </ListItem>
            </List>
        </Dialog>
    );
}

export function Personas(props) {
    const classes = useStyles();
    const [datosPersonas, setDatosPersonas] = useState([]);
    const [datos, setDatos] = useState([]);
    const { nombreClub } = props;

    const [open, setOpen] = useState(false);
    const [formValues, setFormValues] = useState({});

    useEffect(() => {
        const obtenerDatos = async () => {
            const datosQuery = query(
                collection(db, "Personas"),
                where("Club", "==", nombreClub)
            );
            const datosSnapshot = await getDocs(datosQuery);
            const datosPers = datosSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setDatosPersonas(datosPers);
        };

        obtenerDatos();
    }, [datos]);

    const handleClose = () => {
        setOpen(false);
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(formValues); // Aquí podrías enviar los valores del formulario a un servidor o almacenarlos en el estado global de la aplicación
        handleClose();
    };

    // console.log(datos);

    return (
        <Grid container className={classes.global}>
            <Grid item xs={12} sm={12} className={classes.miclubBtn}>
                {/* TODO: se va mirando
        crear el boton de crear personas
    */}
                <Button variant="contained" color="primary">
                    Crear
                </Button>
            </Grid>
            <TableContainer>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">
                                <Typography>Nombre</Typography>
                            </TableCell>
                            <TableCell align="left">
                                <Typography>Apellido</Typography>
                            </TableCell>
                            <TableCell align="left">
                                <Typography>Edad</Typography>
                            </TableCell>
                            <TableCell align="left">
                                <Typography>Categoria</Typography>
                            </TableCell>
                            <TableCell align="left">
                                <Typography>Tipo</Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {datosPersonas.map((row) => (
                            <TableRow>
                                <TableCell align="left">
                                    <Typography>{row.Nombre}</Typography>
                                </TableCell>
                                <TableCell align="left">
                                    <Typography>{row.Apellido}</Typography>
                                </TableCell>
                                <TableCell align="left">
                                    <Typography>{row.Edad}</Typography>
                                </TableCell>
                                <TableCell align="left">
                                    <Typography>{row.Categoria}</Typography>
                                </TableCell>
                                <TableCell align="left">
                                    <Typography>{row.Tipo}</Typography>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Grid>
    );
}
