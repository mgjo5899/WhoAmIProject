export const resetChanged = () => ({
    type: 'RESET_CHANGED'
});

export const setChanged = changed => {
    if (typeof changed === 'function') {
        return {
            type: 'SET_CHANGED_CALLBACK',
            changed
        }
    } else {
        return {
            type: 'SET_CHANGED',
            changed
        }
    }
}