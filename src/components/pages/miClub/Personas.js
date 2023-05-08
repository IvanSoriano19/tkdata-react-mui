import {
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    makeStyles,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { db } from "../../../firebase-config";
import { collection, getDocs } from "firebase/firestore";

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

export function Personas() {
    const classes = useStyles();

    const [datos, setDatos] = useState([]);

    async function obtenerDatos() {
        const datosSnapshot = await getDocs(collection(db, "Personas"));
        const datos = datosSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        setDatos(datos);
    }

    useEffect(() => {
        obtenerDatos();
    }, []);

    // console.log(datos);

    return (
        <Grid className={classes.global}>
            <TableContainer >
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
                        {datos.map((row) => (
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
