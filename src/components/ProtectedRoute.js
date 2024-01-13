import { useAuth } from "../context/authContext";
import { Navigate } from "react-router-dom";
import { IconButton, makeStyles, createTheme } from "@material-ui/core";
import { HourglassEmptyOutlined } from "@material-ui/icons";

const theme = createTheme({
    palette: {
        primary: {
            main: "#447cc1",
        },
        secondary: {
            main: "#e55156",
        },
    },
});

const useStyles = makeStyles((theme) => ({
    loading: {
        alignItems: "center",
        margin: "auto",
    },
    loadingContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh', // Ajusta esto según tus necesidades
    },
}));

export function ProtectedRoute({ children }) {
    const classes = useStyles();
    const { user, loading } = useAuth();

    if (loading)
        return (
            <div className={classes.loadingContainer}>
                <IconButton className={classes.loading}>
                    <HourglassEmptyOutlined fontSize="large" />
                </IconButton>
            </div>
        );

    if (!user) return <Navigate to="/login" />;

    return <>{children}</>;
}
