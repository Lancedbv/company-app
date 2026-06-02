import AgencyShell from './pages/AgencyShell'
import { EntitlementsProvider } from './lib/entitlements'

function App() {
  return (
    <EntitlementsProvider>
      <AgencyShell />
    </EntitlementsProvider>
  )
}

export default App
