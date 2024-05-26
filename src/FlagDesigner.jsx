import {useContext, useState} from 'react';
import {useFlag} from "@unleash/proxy-client-react";
import FeatureFlags from "./FeatureFlags.js";
import {
    Base,
    Bend,
    BendSinister,
    Bordure,
    Canton,
    Chief,
    CoupedCross,
    Fess,
    Field,
    HorizontalTriband,
    MapleLeaf,
    NASA,
    NordicCross,
    Pale,
    PerBend,
    PerBendSinister,
    PerCross,
    PerFess,
    PerPale,
    PerSaltire,
    Pile,
    PileThroughout,
    Saltire,
    Side,
    SideSinister,
    Star,
    Stripes,
    SymmetricCross,
    VerticalTriband
} from "./LayerSamples.jsx";
import Accordion from "./Accordion.jsx";
import FlagCanvas from "./FlagCanvas.jsx";
import mapToName from "./LayerNames.js";
import {UserContext} from "./UserContext.js";
import {Navigate, useNavigate} from "react-router-dom";

function FlagDesigner({flag}) {
    const chargeEnabled = useFlag(FeatureFlags.CHARGE);
    const colourPicker = useFlag(FeatureFlags.COLOUR_PICKER);
    const nasaEnabled = useFlag(FeatureFlags.NASA);
    const saveEnabled = useFlag(FeatureFlags.SAVE_FLAG);
    const updateEnabled = useFlag(FeatureFlags.UPDATE_FLAG);

    const [layers, setLayers] = useState(flag?.layers || []);
    const [name, setName] = useState();

    const user = useContext(UserContext);

    const navigate = useNavigate();

    function renderBasicLayerSample(type, SampleComponent) {
        return renderLayerSample(mapToName(type), SampleComponent, () => setLayers([...layers, {
            '@type': 'basic',
            type,
            colour: randomColor()
        }]))
    }

    function renderBasicScalableLayerSample(type, SampleComponent) {
        return renderLayerSample(mapToName(type), SampleComponent, () => setLayers([...layers, {
            '@type': 'basic-scalable',
            type,
            colour: randomColor(),
            scale: 1
        }]))
    }

    function renderTribandLayerSample(orientation, SampleComponent) {
        return renderLayerSample(mapToName(orientation + "_TRIBAND"), SampleComponent, () => setLayers([...layers, {
            '@type': 'triband',
            orientation,
            hoistColour: randomColor(),
            paleColour: randomColor(),
            flyColour: randomColor()
        }]))
    }

    function renderChargeLayerSample(emblem, SampleComponent) {
        return renderLayerSample(mapToName(emblem), SampleComponent, () => setLayers([...layers, {
            '@type': 'charge',
            emblem,
            colour: randomColor()
        }]));
    }

    function renderLayerEditor(layer, index) {
        return <div key={index} className="layer">
            <h4>#{index + 1} {mapToName(layer.type || layer.emblem)}</h4>
            <button className="small-btn close"
                    onClick={() =>
                        setLayers(layers => [...layers.slice(0, index), ...layers.slice(index + 1)])}>
                &#10005;
            </button>
            <div className="actions">
                <div className="order-btn">
                    <button className="small-btn" disabled={index === 0} onClick={() =>
                        setLayers(layers => [...layers.slice(0, index - 1), layer, layers[index - 1], ...layers.slice(index + 1)])
                    }>
                        &#708;
                    </button>
                    <button className="small-btn" disabled={index === layers.length - 1} onClick={() =>
                        setLayers(layers => [...layers.slice(0, index), layers[index + 1], layer, ...layers.slice(index + 2)])
                    }>
                        &#709;
                    </button>
                </div>
                <div className="field-container">
                    {layer['@type'] === 'triband' ? <>
                        <div className="field">
                            <label htmlFor="hoistColour">Hoist colour</label>
                            {<input id="hoistColour" type={colourPicker ? 'color' : 'text'} value={layer.hoistColour}
                                    onChange={event => setLayers(layers => {
                                        return [...layers.slice(0, index), {
                                            ...layer,
                                            hoistColour: event.target.value
                                        }, ...layers.slice(index + 1)]
                                    })}/>}
                        </div>
                        <div className="field">
                            <label htmlFor="paleColour">Pale colour</label>
                            <input id="paleColour" type={colourPicker ? 'color' : 'text'} value={layer.paleColour}
                                   onChange={event => setLayers(layers => {
                                       return [...layers.slice(0, index), {
                                           ...layer,
                                           paleColour: event.target.value
                                       }, ...layers.slice(index + 1)]
                                   })}/>
                        </div>
                        <div className="field">
                            <label htmlFor="flyColour">Fly colour</label>
                            <input id="flyColour" type={colourPicker ? 'color' : 'text'} value={layer.flyColour}
                                   onChange={event => setLayers(layers => {
                                       return [...layers.slice(0, index), {
                                           ...layer,
                                           flyColour: event.target.value
                                       }, ...layers.slice(index + 1)]
                                   })}/>
                        </div>
                    </> : layer['@type'] === 'basic-scalable' ? <>
                        <div className="field">
                            <label htmlFor="colour">Colour</label>
                            <input id="colour" type={colourPicker ? 'color' : 'text'} value={layer.colour}
                                   onChange={event => setLayers(layers => {
                                       return [...layers.slice(0, index), {
                                           ...layer,
                                           colour: event.target.value
                                       }, ...layers.slice(index + 1)]
                                   })}/>
                        </div>
                        <div className="field">
                            <label htmlFor="scale">Scale</label>
                            <input className="w-lg-100 w-md-100 w-50" id="scale" type="range" min=".5" max="2" step=".01" value={layer.scale}
                                   onChange={event => setLayers(layers => {
                                       return [...layers.slice(0, index), {
                                           ...layer,
                                           scale: event.target.value
                                       }, ...layers.slice(index + 1)]
                                   })}/>
                        </div>
                    </> : <>
                        <div className="field">
                            <label htmlFor="colour">Colour</label>
                            <input id="colour" type={colourPicker ? 'color' : 'text'} value={layer.colour}
                                   onChange={event => setLayers(layers => {
                                       return [...layers.slice(0, index), {
                                           ...layer,
                                           colour: event.target.value
                                       }, ...layers.slice(index + 1)]
                                   })}/>
                        </div>
                    </>
                    }
                </div>
            </div>
        </div>
    }

    if (flag?.id && !updateEnabled) {
        return <Navigate to={'/'}/>;
    }

    return (
        <>
            <div className="row">
                <div className="col-lg-3 col-md-3 d-lg-block d-md-block d-none desktop-designer-height">
                    {layers.map((layer, i) => renderLayerEditor(layer, i))}
                </div>
                <div className="col-lg-6 col-md-6 col-12 center mobile-flag-height">
                    <h1>Flag Designer</h1>
                    <FlagCanvas flag={{...flag, layers}}/>
                </div>
                <div className="d-lg-none d-md-none col-6 mobile-designer-height right-padding">
                    {layers.map((layer, i) => renderLayerEditor(layer, i))}
                </div>
                <div className="col-lg-3 col-md-3 d-lg-block d-md-block d-none desktop-designer-height">
                    <Accordion title="Basic">
                        {renderBasicLayerSample('FIELD', Field)}
                        {renderBasicLayerSample('PER_PALE', PerPale)}
                        {renderBasicLayerSample('PER_FESS', PerFess)}
                        {renderBasicLayerSample('PER_BEND', PerBend)}
                        {renderBasicLayerSample('PER_BEND_SINISTER', PerBendSinister)}
                        {renderBasicScalableLayerSample('PALE', Pale)}
                        {renderBasicScalableLayerSample('FESS', Fess)}
                        {renderBasicScalableLayerSample('BEND', Bend)}
                        {renderBasicScalableLayerSample('BEND_SINISTER', BendSinister)}
                        {renderBasicScalableLayerSample('SIDE', Side)}
                        {renderBasicScalableLayerSample('SIDE_SINISTER', SideSinister)}
                        {renderBasicScalableLayerSample('CHIEF', Chief)}
                        {renderBasicScalableLayerSample('BASE', Base)}
                        {renderBasicLayerSample('PER_CROSS', PerCross)}
                        {renderBasicLayerSample('PER_SALTIRE', PerSaltire)}
                        {renderBasicScalableLayerSample('COUPED_CROSS', CoupedCross)}
                        {renderBasicScalableLayerSample('SYMMETRIC_CROSS', SymmetricCross)}
                        {renderBasicScalableLayerSample('NORDIC_CROSS', NordicCross)}
                        {renderBasicScalableLayerSample('SALTIRE', Saltire)}
                        {renderBasicScalableLayerSample('CANTON', Canton)}
                        {renderBasicScalableLayerSample('BORDURE', Bordure)}
                        {renderBasicLayerSample('PILE', Pile)}
                        {renderBasicLayerSample('PILE_THROUGHOUT', PileThroughout)}
                        {renderBasicLayerSample('STRIPES', Stripes)}
                        {renderTribandLayerSample('VERTICAL', VerticalTriband)}
                        {renderTribandLayerSample('HORIZONTAL', HorizontalTriband)}
                    </Accordion>
                    {chargeEnabled && (
                        <Accordion title="Charge">
                            {renderChargeLayerSample('STAR', Star)}
                            {renderChargeLayerSample('MAPLE_LEAF', MapleLeaf)}
                            {nasaEnabled && renderChargeLayerSample('NASA', NASA)}
                        </Accordion>
                    )}
                </div>
                <div className="d-lg-none d-md-none col-6 mobile-designer-height left-padding">
                    <Accordion title="Basic">
                        {renderBasicLayerSample('FIELD', Field)}
                        {renderBasicLayerSample('PER_PALE', PerPale)}
                        {renderBasicLayerSample('PER_FESS', PerFess)}
                        {renderBasicLayerSample('PER_BEND', PerBend)}
                        {renderBasicLayerSample('PER_BEND_SINISTER', PerBendSinister)}
                        {renderBasicScalableLayerSample('PALE', Pale)}
                        {renderBasicScalableLayerSample('FESS', Fess)}
                        {renderBasicScalableLayerSample('BEND', Bend)}
                        {renderBasicScalableLayerSample('BEND_SINISTER', BendSinister)}
                        {renderBasicScalableLayerSample('SIDE', Side)}
                        {renderBasicScalableLayerSample('SIDE_SINISTER', SideSinister)}
                        {renderBasicScalableLayerSample('CHIEF', Chief)}
                        {renderBasicScalableLayerSample('BASE', Base)}
                        {renderBasicLayerSample('PER_CROSS', PerCross)}
                        {renderBasicLayerSample('PER_SALTIRE', PerSaltire)}
                        {renderBasicScalableLayerSample('COUPED_CROSS', CoupedCross)}
                        {renderBasicScalableLayerSample('SYMMETRIC_CROSS', SymmetricCross)}
                        {renderBasicScalableLayerSample('NORDIC_CROSS', NordicCross)}
                        {renderBasicScalableLayerSample('SALTIRE', Saltire)}
                        {renderBasicScalableLayerSample('CANTON', Canton)}
                        {renderBasicScalableLayerSample('BORDURE', Bordure)}
                        {renderBasicLayerSample('PILE', Pile)}
                        {renderBasicLayerSample('PILE_THROUGHOUT', PileThroughout)}
                        {renderBasicLayerSample('STRIPES', Stripes)}
                        {renderTribandLayerSample('VERTICAL', VerticalTriband)}
                        {renderTribandLayerSample('HORIZONTAL', HorizontalTriband)}
                    </Accordion>
                    {chargeEnabled && (
                        <Accordion title="Charge">
                            {renderChargeLayerSample('STAR', Star)}
                            {renderChargeLayerSample('MAPLE_LEAF', MapleLeaf)}
                            {nasaEnabled && renderChargeLayerSample('NASA', NASA)}
                        </Accordion>
                    )}
                </div>
                <div className="col-12 center top-padding">
                    {user && (updateEnabled || saveEnabled) && <>
                        {!flag?.id && <input type="text" value={name} onChange={event => setName(event.target.value)}/>}
                        <button onClick={() => {
                            if (flag?.id) {
                                fetch(import.meta.env.VITE_BACKEND_URL + `/flags/${flag.id}`, {
                                    method: "PUT",
                                    headers: {
                                        "Content-Type": "application/json",
                                        "Authorization": "Basic " + user.token
                                    },
                                    body: JSON.stringify({...flag, layers}),
                                }).then(() => navigate('/mylist'));
                            } else {
                                fetch(import.meta.env.VITE_BACKEND_URL + "/flags", {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                        "Authorization": "Basic " + user.token
                                    },
                                    body: JSON.stringify({...flag, layers, name}),
                                }).then(() => navigate('/mylist'));
                            }
                        }}>Save
                        </button>
                    </>}
                </div>
            </div>
        </>
    );
}


function renderLayerSample(name, SampleComponent, click) {
    return <div className="sample-layer" onClick={click}>
        <button>&#171;</button>
        <div className="center">
            <h4>{name}</h4>
            <SampleComponent/>
        </div>
    </div>;
}

function randomColor() {
    let colorString = Math.floor(Math.random() * 16777215).toString(16);
    while (colorString.length < 6) {
        colorString = "0" + colorString;
    }
    return "#" + colorString;
}

export default FlagDesigner;