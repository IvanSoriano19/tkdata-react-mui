import { Routes, Route } from "react-router-dom";
import "./App.css";
import { Home } from "./components/Home";
import { Register } from "./components/Register";
import { Login } from "./components/Login";
import { AuthProvider } from "./context/authContext";

function App() {
    return (
        <AuthProvider>
            <Routes>
                {/* <Route path='/' element={<Home/>} /> */}
                {/* <Route path='/' element={<Login/>} /> */}
                <Route path="/" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </AuthProvider>
    );
}

export default App;
