import axios from "axios"

let navigate = null

const excludedPaths = ['/login', '/register', '/']

export const setInterceptorNavigate = (navigateFn) => {
    navigate = navigateFn
}

export const setupInterceptors = () => {
    axios.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response?.status === 401) {
                const currentPath = window.location.pathname
                const isExcluded = excludedPaths.some(path => currentPath.startsWith(path))
                
                if (navigate && !isExcluded) {
                    navigate('/login')
                }
            }

            if (error.response?.status === 403) {
                console.error("Accès interdit")
            }

            if (error.response?.status === 500) {
                console.error("Erreur serveur")
            }

            return Promise.reject(error)
        }
    )
}
