import React from "react";
import { Navbar } from "../home/Navbar";
import { Container, makeStyles, Grid} from '@material-ui/core'
// import { doc, getDoc } from "firebase/firestore";
// import { auth, db } from "../firebase-config";


const useStyles = makeStyles((theme) => ({
    global: {
        alignItems: "center",
        width: "90%",
        backgroundColor: "#e55156",
        marginTop: "20px"
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: "#e55156",
    },
    form: {
        width: "100%",
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
        backgroundColor: "#447cc1",
        '&:hover':{
            backgroundColor: "#2765B0",
        }
    },
    
}));

export function MiClub() {
    const classes = useStyles()

    // const getData = async () => {

    //     const docRef = doc(db, "clubes", "SF");
    //     const docSnap = await getDoc(docRef);

    // }

    return (
        <div>
            <Navbar/>
            <Container maxWidth="md" className={classes.global}>
                <Grid container spacing={2}>
                    <Grid item md={12}>
                        Hola
                    </Grid>
                </Grid>
            </Container>
        </div>
    )
    
}
