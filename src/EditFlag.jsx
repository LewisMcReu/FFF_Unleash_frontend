import FlagDesigner from "./FlagDesigner.jsx";
import {useLoaderData} from "react-router-dom";

export function EditFlag() {
    const flag = useLoaderData();
    return <FlagDesigner flag={flag}/>;
}