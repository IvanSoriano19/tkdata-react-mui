import { TextField, Button } from "@material-ui/core";

// import { useState } from "react";

export function Login() {
    // const[user, setUser] = useState({
    //     email: '',
    //     password:''
    // })

    return (
        <div>
            <form>
                <TextField
                    id="standard-basic"
                    label="Email"
                    variant="standard"
                />
                <TextField
                    id="standard-basic"
                    label="Password"
                    variant="standard"
                />
                <Button variant="contained">Login</Button>
            </form>
        </div>
    );
}
