import { TextField, Button, makeStyles } from "@material-ui/core";
import { useState } from "react";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    register: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: "15% 36%",
    },
    textFieldStyle:{
        padding: 6
    },
    palette:{
        primary: "#447CC1"
    },
    buttonStyle:{
        alignItems: "center",
        justifyContent: "center"
    }
}));

export function Register(props) {
    const classes = useStyles();
    const [user, setUser] = useState({
        name: "",
        provincia: "",
        email: "",
        telefono: "",
        password: "",
    });

    const {signup} = useAuth()
    const navigate = useNavigate()
    const [error, setError] = useState()

    const handleChange = ({ target: { id, value } }) => {
        setUser({ ...user, [id]: value });
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        try {
            await signup(user.email, user.password)
            navigate("/")
        } catch (error) {
            setError(error.message) 
            console.log(error.message)
            
        }
    };

    return (
        <div className={classes.register}>

            {error && <p>{error}</p>}

            <form onSubmit={handleSubmit} >
                <TextField
                    id="name"
                    label="Nombre del club"
                    variant="outlined"
                    onChange={handleChange}
                    className={classes.textFieldStyle}
                />
                <TextField
                    id="provincia"
                    label="Provincia"
                    variant="outlined"
                    onChange={handleChange}
                    className={classes.textFieldStyle}
                />
                <TextField
                    id="email"
                    label="Email"
                    type="email"
                    variant="outlined"
                    onChange={handleChange}
                    className={classes.textFieldStyle}
                />
                <TextField
                    id="telefono"
                    label="Telefono"
                    variant="outlined"
                    onChange={handleChange}
                    className={classes.textFieldStyle}
                />
                <TextField
                    id="password"
                    label="Password"
                    type="password"
                    variant="outlined"
                    onChange={handleChange}
                    className={classes.textFieldStyle}
                />
                <br></br>
                <Button variant="contained" type="submit" className={classes.buttonStyle}>Registrar</Button>
            </form>
        </div>
    );
}
