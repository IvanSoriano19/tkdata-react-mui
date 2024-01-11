import { Routes, Route } from "react-router-dom";
import "./App.css";
import { Home } from "./components/home/Home";
import { Register } from "./components/auth/Register";
import { Login } from "./components/auth/Login";
import { AuthProvider } from "./context/authContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { MiClub } from "./components/pages/miClub/MiClub";
import { Campeonatos } from "./components/pages/campeonatos/Campeonatos";
import { Campeonato } from "./components/pages/campeonatos/Campeonato";
import { CrearCampeonato } from "./components/pages/campeonatos/CrearCampeonato";

function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <Home />
                        </ProtectedRoute>
                    }
                />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                    path="/mi-club"
                    element={
                        <ProtectedRoute>
                            <MiClub />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/campeonatos"
                    element={
                        <ProtectedRoute>
                            <Campeonatos />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/crear-campeonato"
                    element={
                        <ProtectedRoute>
                            <CrearCampeonato />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/campeonato"
                    element={
                        <ProtectedRoute>
                            <Campeonato />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </AuthProvider>
    );
}

export default App;
