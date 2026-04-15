import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import { AssetsProvider } from './contexts/AssetsContext'

// Bills
import CreateBill   from './pages/CreateBill'
import BillsList    from './pages/BillsList'
import ViewBill     from './pages/ViewBill'
import BrandAssets  from './pages/BrandAssets'

// Road Tax
import TaxDashboard from './pages/TaxDashboard'
import TaxVehicles  from './pages/TaxVehicles'
import TaxPayments  from './pages/TaxPayments'
import TaxAutomate  from './pages/TaxAutomate'

// Pagar
import PagarCalc    from './pages/PagarCalc'
import PagarRecords from './pages/PagarRecords'
import PagarDrivers from './pages/PagarDrivers'

export default function App() {
  return (
    <AssetsProvider>
      <Layout>
        <Routes>
          {/* Bills */}
          <Route path="/"             element={<CreateBill />} />
          <Route path="/bills"        element={<BillsList />} />
          <Route path="/bill/:id"     element={<ViewBill />} />
          <Route path="/brand-assets" element={<BrandAssets />} />

          {/* Road Tax */}
          <Route path="/tax"           element={<TaxDashboard />} />
          <Route path="/tax/vehicles"  element={<TaxVehicles />} />
          <Route path="/tax/payments"  element={<TaxPayments />} />
          <Route path="/tax/automate"  element={<TaxAutomate />} />

          {/* Pagar */}
          <Route path="/pagar"          element={<PagarCalc />} />
          <Route path="/pagar/records"  element={<PagarRecords />} />
          <Route path="/pagar/drivers"  element={<PagarDrivers />} />
        </Routes>
      </Layout>
    </AssetsProvider>
  )
}
