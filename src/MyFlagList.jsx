import {useContext, useEffect, useState} from "react";
import FlagCanvas from "./FlagCanvas.jsx";
import {UserContext} from "./UserContext.js";
import {Link, useNavigate} from "react-router-dom";

export default function MyFlagList() {
    const [flags, setFlags] = useState([]);
    const user = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(import.meta.env.VITE_BACKEND_URL+ `/flags?user=${user?.name}`).then(response => response.json().then(body => setFlags(body)));
    }, [user]);

    return <>
        <h1>All the flags!</h1>
        <button onClick={() => navigate('/')}>Make a new flag</button>
        <main className="flag-list">{
            flags.map(flag => <div key={flag.id}>
                <FlagCanvas flag={flag}/>
                <p>{flag.id}</p>
                <button onClick={() => {
                    navigate(`/editflag/${flag.id}`)
                }}>Edit
                </button>
            </div>)}
        </main>
        <Link to={"/list"}>All flags</Link>
    </>
}