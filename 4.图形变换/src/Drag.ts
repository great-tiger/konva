export const DD = {
    _dragElements: new Map(),
    _drag(evt) {
        DD._dragElements.forEach(elem => {
            const { node } = elem
            if (elem.dragStatus !== 'dragging') {
                node.startDrag(evt)
            }
            node._setDragPosition(evt, elem)
        })
    },
    _endDragBefore(evt) {
       DD._dragElements.forEach((elem, key) => {
           elem.node.getLayer().draw()
       }) 
    },
    _endDragAfter(evt)  {
        DD._dragElements.forEach((elem, key) => {
            DD._dragElements.delete(key)
        })
    }
}
window.addEventListener('mouseup', DD._endDragBefore, true)
window.addEventListener('mousemove', DD._drag)
window.addEventListener('mouseup', DD._endDragAfter, false)