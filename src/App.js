import { Routes, Route } from "react-router-dom";
import "./App.css";
import { Home } from "./components/home/Home";
import { Register } from "./components/Register";
import { Login } from "./components/Login";
import { AuthProvider } from "./context/authContext";
import { ProtectedRoute } from "./components/ProtectedRoute";

function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route path='/' element={
                    <ProtectedRoute>
                        <Home/>
                    </ProtectedRoute>
                } />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </AuthProvider>
    );
}

export default App;
