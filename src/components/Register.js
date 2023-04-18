import { TextField, Button, makeStyles } from "@material-ui/core";
import { useState } from "react";

const useStyles = makeStyles((theme) => ({
    register: {
        alignItems: "center",
        width: "30%",
        display: "flex",
    },
}));

export function Register(props) {
    const classes = useStyles()

    const [user, setUser] = useState({
        name: "",
        provincia: "",
        email: "",
        telefono: "",
        password: "",
        password2: "",
    });

    return (
        <div className={classes.register}>
            <form>
                <TextField
                    id="name"
                    label="Nombre del club"
                    variant="standard"
                />
                <TextField
                    id="provincia"
                    label="Provincia"
                    variant="standard"
                />
                <TextField id="email" label="Email" variant="standard" />
                <TextField id="telefono" label="Telefono" variant="standard" />
                <TextField id="password" label="Password" variant="standard" />
                <TextField
                    id="password2"
                    label="Password2"
                    variant="standard"
                />
                <Button variant="contained">Registrar</Button>
            </form>
        </div>
    );
}
