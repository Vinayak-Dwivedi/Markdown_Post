import { Routes, Route } from "react-router-dom";
import Login from "./Components/Login";
import Users from "./Components/Users";
import EditUser from "./Components/EditUser";


function App() {
  return (
  
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/users" element={<Users />} />
        <Route path="/edit/:id" element={<EditUser />} />
      </Routes>
   
  );
}

export default App;
