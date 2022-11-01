export const hostUrl = () => {
    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
        return 'http://localhost:3000'
    } else {
        return 'https://jaws-sharkster.netlify.app/'
    }
}