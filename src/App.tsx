import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { AuthGuard } from './components/auth'

export default function App() {
  return (
    <AuthGuard>
      <RouterProvider router={router} />
    </AuthGuard>
  )
}
