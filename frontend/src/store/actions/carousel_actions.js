// moving to next slide
export const next = activeIndexFlag => ({
    type: 'NEXT',
    activeIndexFlag
})

// moving to previous slide
export const previous = activeIndexFlag => ({
    type: 'PREVIOUS',
    activeIndexFlag
})

// resetting active index for specific active index flag
export const resetActiveIndex = activeIndexFlag => ({
    type: 'RESET_INDEX',
    activeIndexFlag
})