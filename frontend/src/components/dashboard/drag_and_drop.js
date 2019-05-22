import interact from 'interactjs';
import { DEFAULT_PROFILE_SIZE_VALUE, DEFAULT_PROFILE_FONT_SIZE } from '../../config';

// target elements with the "draggable" class

export const Drag = setChanged => {

    const dragMoveListener = event => {
        var target = event.target,
            // keep the dragged position in the data-x/data-y attributes
            x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
            y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

        // translate the element
        target.style.webkitTransform =
            target.style.transform =
            'translate(' + x + 'px, ' + y + 'px)';
        // update the posiion attributes
        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);

        setChanged(changed => changePosAndSize(changed, event, x, y));

    }
    // this is used later in the resizing and gesture demos
    // window.dragMoveListener = dragMoveListener;

    interact('.draggable.resize-drag')
        .draggable({
            // enable inertial throwing
            inertia: true,
            // keep the element within the area of it's parent
            restrict: {
                restriction: "parent",
                endOnly: true,
                elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
            },
            // enable autoScroll
            autoScroll: true,

            // call this function on every dragmove event
            onmove: dragMoveListener,
            // call this function on every dragend event
            onend: () => { }
        })
        .resizable({
            // resize from all edges and corners
            edges: { left: true, right: true, bottom: true, top: true },

            // keep the edges inside the parent
            restrictEdges: {
                outer: 'parent',
                endOnly: true,
            },

            // minimum size
            restrictSize: {
                min: { width: 100, height: 'auto' },
            },

            inertia: true,
        })
        .on('resizemove', event => {
            let target = event.target,
                x = (parseFloat(target.getAttribute('data-x')) || 0),
                y = (parseFloat(target.getAttribute('data-y')) || 0);

            // update the element's style
            target.style.width = event.rect.width + 'px';
            // target.style.height = event.rect.height + 'px';

            if (target.getAttribute('medium') === 'whoami') {
                target.children[0].firstChild.style.fontSize = (DEFAULT_PROFILE_FONT_SIZE * parseFloat(target.offsetWidth) / DEFAULT_PROFILE_SIZE_VALUE) + 'px';
            }
            x += event.deltaRect.left;
            if (!event.edges.bottom && (event.edges.top || event.edges.right)) {
                const ratio = target.offsetHeight / target.offsetWidth;
                event.edges.right ? y -= event.deltaRect.right * ratio : y += event.deltaRect.left * ratio;
            }
            // console.log(event.deltaRect.left, event.deltaRect.top, event.deltaRect.right, event.rect.width)

            target.style.webkitTransform = target.style.transform =
                'translate(' + x + 'px,' + y + 'px)';
            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);
            setChanged(changed => changePosAndSize(changed, event, x, y));
        });
}

const changePosAndSize = (changed, event, x, y) => ({
    ...changed,
    [event.target.id]: {
        posX: x,
        posY: y,
        width: event.target.offsetWidth,
        height: event.target.offsetHeight
    }
});