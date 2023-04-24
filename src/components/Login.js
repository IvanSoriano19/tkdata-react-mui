import { TextField, Button, makeStyles, Typography } from "@material-ui/core";
import { useState } from "react";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    register: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: "15% 36%",
        backgroundColor: "#fff000"
    },
    textFieldStyle:{
        padding: 6
    },
    error:{
        position: "absolute",
        marginTop: 0
    },
    buttonStyle:{
        display: "flex",
        alignItems: "center"
    }
}));

export function Login(props) {
    const classes = useStyles();
    const navigate = useNavigate()
    const [user, setUser] = useState({
        name: "",
        password: "",
    });

    const { login } = useAuth()
    const [errors, setErrors] = useState()

    const handleChange = ({ target: { id, value } }) => {
        setUser({ ...user, [id]: value });
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        setErrors('')
        try {
            await login(user.email, user.password);
            navigate("/")
        }catch(error) {
            setErrors(error.message) 
            
        }
    };

    const handleRegister = () =>{
        navigate("/register")
    }

    return (
        <div className={classes.register}>

            {errors && <p className={classes.error}>{errors}</p>}

            <form onSubmit={handleSubmit} >
                
                <TextField
                    id="email"
                    label="Email"
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
                <Button variant="contained" type="submit" className={classes.buttonStyle}>Login</Button>
                <p onClick={handleRegister}>Aun no estoy registrado</p>
            </form>
        </div>
    );
}
