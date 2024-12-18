import Header from './components/layout/Header'
import { Toaster } from './components/ui/sonner'

function App() {

  return (
    <div className="min-h-screen w-full bg-neutral-300"  >
      <Header/>

      <Toaster />
    </div>
  )
}

export default App
