// Thin re-export so components can `import { useAuth } from '../hooks/useAuth'`
// as required by the assignment folder structure. The real implementation
// lives in context/AuthContext.jsx since it needs the Context object.
export { useAuth } from '../context/AuthContext'
