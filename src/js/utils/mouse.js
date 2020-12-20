export function getMousePosition ({ changedTouches, clientX, clientY }){
    const x = changedTouches ? changedTouches[0].clientX : clientX
    const y = changedTouches ? changedTouches[0].clientY : clientY

    return {
        x,
        y
    }
}
