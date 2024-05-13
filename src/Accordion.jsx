import {Children, useState} from "react";

export default function Accordion({title, children}) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <div className="accordion">
                <button className="accordion-btn" disabled={Children.count(children) === 0}
                        onClick={() => setOpen((open) => !open)}>
                    <h3>{title}</h3>
                    <h3>{open ? <>&#708;</> : <>&#709;</>}</h3>
                </button>
                {open && children}
            </div>
        </>
    )
}