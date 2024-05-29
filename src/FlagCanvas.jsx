import {useEffect, useRef} from "react";

export default function FlagCanvas({flag}) {
    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        clearCanvas(context);
        flag.layers.forEach(layer => drawLayerOnCanvas(context, layer));
    }, [flag]);
    const canvasRef = useRef(null);

    return <canvas ref={canvasRef} width="300" height="200"></canvas>;
}

function clearCanvas(context) {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
}

function drawLayerOnCanvas(context, layer) {
    const {width, height} = context.canvas;
    if (layer['@type'] === 'basic') {
        context.fillStyle = layer['colour'];
        if (layer['type'] === 'FIELD') {
            context.fillRect(0, 0, width, height);
        } else if (layer['type'] === 'PER_PALE') {
            context.fillRect(0, 0, width / 2, height);
        } else if (layer['type'] === 'PER_FESS') {
            context.fillRect(0, 0, width, height / 2);
        } else if (layer['type'] === 'PER_BEND') {
            context.beginPath();
            context.moveTo(0, 0);
            context.lineTo(width, 0);
            context.lineTo(width, height);
            context.closePath();
            context.fill();
        } else if (layer['type'] === 'PER_BEND_SINISTER') {
            context.beginPath();
            context.moveTo(0, 0);
            context.lineTo(width, 0);
            context.lineTo(0, height);
            context.closePath();
            context.fill();
        } else if (layer['type'] === 'PER_CROSS') {
            context.fillRect(width / 2, 0, width / 2, height / 2);
            context.fillRect(0, height / 2, width / 2, height / 2);
        } else if (layer['type'] === 'PER_SALTIRE') {
            context.beginPath();
            context.moveTo(0, 0);
            context.lineTo(width / 2, height / 2);
            context.lineTo(width, 0);
            context.lineTo(width, height);
            context.lineTo(width / 2, height / 2);
            context.lineTo(0, height);
            context.closePath();
            context.fill();
        } else if (layer['type'] === 'PILE') {
            context.beginPath();
            context.moveTo(0, 0);
            context.lineTo(width / 2, height / 2);
            context.lineTo(0, height);
            context.closePath();
            context.fill();
        } else if (layer['type'] === 'PILE_THROUGHOUT') {
            context.beginPath();
            context.moveTo(0, 0);
            context.lineTo(width, height / 2);
            context.lineTo(0, height);
            context.closePath();
            context.fill();
        } else if (layer['type'] === 'STRIPES') {
            const stripeWidth = height / 9;
            context.fillRect(0, stripeWidth, width, stripeWidth);
            context.fillRect(0, stripeWidth * 3, width, stripeWidth);
            context.fillRect(0, stripeWidth * 5, width, stripeWidth);
            context.fillRect(0, stripeWidth * 7, width, stripeWidth);
        }
    } else if (layer['@type'] === 'basic-scalable') {
        context.fillStyle = layer['colour'];
        const scale = layer['scale'];
        if (layer['type'] === 'PALE') {
            const cWidth = .3 * scale * width;
            const left = (width - cWidth) / 2;
            context.fillRect(left, 0, cWidth, height);
        } else if (layer['type'] === 'FESS') {
            const cHeight = scale * height / 3;
            const top = (height - cHeight) / 2;
            context.fillRect(0, top, width, cHeight);
        } else if (layer['type'] === 'BEND') {
            const cHeight = .3 * scale * height;
            const path = new Path2D();
            path.rect(0, -cHeight / 2, width * 1.2, cHeight);
            context.transform(1, 0.667, 0, 1, 0, 0);
            context.fill(path);
        } else if (layer['type'] === 'BEND_SINISTER') {
            const cHeight = .3 * scale * height;
            const path = new Path2D();
            path.rect(0, -cHeight / 2, width * 1.2, cHeight);
            context.transform(1, -0.667, 0, 1, 0, height);
            context.fill(path);
        } else if (layer['type'] === 'SIDE') {
            const cWidth = .3 * scale * width;
            context.fillRect(0, 0, cWidth, height);
        } else if (layer['type'] === 'SIDE_SINISTER') {
            const cWidth = .3 * scale * width;
            context.fillRect(width - cWidth, 0, cWidth, height);
        } else if (layer['type'] === 'CHIEF') {
            const cHeight = .3 * scale * height;
            context.fillRect(0, 0, width, cHeight);
        } else if (layer['type'] === 'BASE') {
            const cHeight = .3 * scale * height;
            context.fillRect(0, height - cHeight, width, cHeight);
        } else if (layer['type'] === 'COUPED_CROSS') {
            const crossWidth = height / 6 * scale;
            const crossLength = crossWidth * 4;
            let left = (width - crossWidth) / 2;
            let top = (height - crossLength) / 2;
            context.fillRect(left, top, crossWidth, crossLength);
            left = (width - crossLength) / 2;
            top = (height - crossWidth) / 2;
            context.fillRect(left, top, crossLength, crossWidth);
        } else if (layer['type'] === 'SYMMETRIC_CROSS') {
            const crossWidth = height / 6 * scale;
            context.fillRect((width - crossWidth) / 2, 0, crossWidth, height);
            context.fillRect(0, (height - crossWidth) / 2, width, crossWidth);
        } else if (layer['type'] === 'NORDIC_CROSS') {
            const crossWidth = height / 6 * scale;
            context.fillRect(width * .36 - crossWidth / 2, 0, crossWidth, height);
            context.fillRect(0, (height - crossWidth) / 2, width, crossWidth);
        } else if (layer['type'] === 'SALTIRE') {
            const crossWidth = height / 6 * scale;
            const path = new Path2D();
            path.rect(0, -crossWidth / 2, width * 1.2, crossWidth);
            context.setTransform(1, 0.667, 0, 1, 0, 0);
            context.fill(path);
            const pathSinister = new Path2D();
            pathSinister.rect(0, -crossWidth / 2, width * 1.2, crossWidth);
            context.setTransform(1, -0.667, 0, 1, 0, height);
            context.fill(pathSinister);
        } else if (layer['type'] === 'CANTON') {
            context.fillRect(0, 0, width / 2 * scale, height / 2 * scale);
        } else if (layer['type'] === 'BORDURE') {
            const borderWidth = height / 6 * scale;
            context.fillRect(0, 0, width, borderWidth);
            context.fillRect(0, 0, borderWidth, height);
            context.fillRect(0, height - borderWidth, width, borderWidth);
            context.fillRect(width - borderWidth, 0, borderWidth, height);
        }
    } else if (layer['@type'] === 'triband') {
        if (layer['orientation'] === 'VERTICAL') {
            const bandWidth = width / 3;
            context.fillStyle = layer['hoistColour'];
            context.fillRect(0, 0, bandWidth, height);
            context.fillStyle = layer['paleColour'];
            context.fillRect(bandWidth, 0, bandWidth, height);
            context.fillStyle = layer['flyColour'];
            context.fillRect(bandWidth * 2, 0, bandWidth, height);
        } else if (layer['orientation'] === 'HORIZONTAL') {
            const bandHeight = height / 3;
            context.fillStyle = layer['hoistColour'];
            context.fillRect(0, 0, width, bandHeight);
            context.fillStyle = layer['paleColour'];
            context.fillRect(0, bandHeight, width, bandHeight);
            context.fillStyle = layer['flyColour'];
            context.fillRect(0, bandHeight * 2, width, bandHeight);
        }
    } else if (layer['@type'] === 'charge') {
        const scale = layer['scale'];
        context.fillStyle = layer['colour'];
        if (layer['emblem'] === 'STAR') {
            //m 56 237 l 74 -228 l 74 228 L 10 96 h 240
            const path = new Path2D('M -74 114 L 0 -114 L 74 114 L -120 -27 H 120');
            context.setTransform(.5, 0, 0, .5, width / 2, height / 2);
            context.fill(path);
        } else if (layer['emblem'] === 'CIRCLE') {
            context.beginPath();
            const radius = height / 4 * scale;
            console.log(radius)
            context.arc(width / 2, height / 2, radius, 0, 2 * Math.PI);
            context.fill();
        } else if (layer['emblem'] === 'MAPLE_LEAF') {
            const path = new Path2D('m-90 2030 45-863a95 95 0 0 0-111-98l-859 151 116-320a65 65 0 0 0-20-73l-941-762 212-99a65 65 0 0 0 34-79l-186-572 542 115a65 65 0 0 0 73-38l105-247 423 454a65 65 0 0 0 111-57l-204-1052 327 189a65 65 0 0 0 91-27l332-652 332 652a65 65 0 0 0 91 27l327-189-204 1052a65 65 0 0 0 111 57l423-454 105 247a65 65 0 0 0 73 38l542-115-186 572a65 65 0 0 0 34 79l212 99-941 762a65 65 0 0 0-20 73l116 320-859-151a95 95 0 0 0-111 98l45 863z');
            context.setTransform(.03, 0, 0, .03, width / 2, height / 2);
            context.fill(path);
        } else if (layer['emblem'] === 'NASA') {
            const img = new Image();
            img.onload = () => {
                context.drawImage(img, (width - img.width) / 2, (height - img.height) / 2)
            }
            img.src = 'https://upload.wikimedia.org/wikipedia/commons/e/e5/NASA_logo.svg';
        }
    }
    context.resetTransform();
}
