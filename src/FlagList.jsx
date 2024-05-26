import {useContext, useEffect, useState} from "react";
import FlagCanvas from "./FlagCanvas.jsx";
import {UserContext} from "./UserContext.js";
import {Link, useNavigate} from "react-router-dom";
import {useFlag} from "@unleash/proxy-client-react";
import FeatureFlags from "./FeatureFlags.js";

export default function FlagList() {
    const [flags, setFlags] = useState([]);
    const user = useContext(UserContext);
    const like_flag_enabled = useFlag(FeatureFlags.LIKE_FLAG);
    const navigate = useNavigate();
    useEffect(() => {
        fetch(import.meta.env.VITE_BACKEND_URL+ "/flags").then(response => response.json().then(body => setFlags(body)));
    }, []);

    return <>
        <h1>All the flags!</h1>
        <button onClick={() => navigate('/')}>Make a new flag</button>
        <main className="flag-list">
            {flags.map((flag, index) => <div key={index}>
                <FlagCanvas flag={flag}/>
                <p>{flag.id}</p>
                {like_flag_enabled && <>
                    <span>{flag.likeCount ? flag.likeCount : 'No'} like{flag.likeCount !== 1 && 's'}</span>
                    <button
                        onClick={() => fetch(import.meta.env.VITE_BACKEND_URL+ `/flags/${flag.id}/like`, {method: 'POST'}).then(() => {
                            {
                                flag.likeCount = flag.likeCount + 1;
                                setFlags(flags => [...flags.slice(0, index), flag, ...flags.slice(index + 1)]);
                            }
                        })}>&#128077;</button>
                </>}
            </div>)}</main>
        {user && <Link to={"/mylist"}>My flags</Link>}
    </>
}