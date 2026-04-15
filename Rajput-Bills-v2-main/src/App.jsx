import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import CreateBill from './pages/CreateBill'
import BillsList from './pages/BillsList'
import ViewBill from './pages/ViewBill'
import BrandAssets from './pages/BrandAssets'
import { AssetsProvider } from './contexts/AssetsContext'

export default function App() {
  return (
    <AssetsProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<CreateBill />} />
          <Route path="/bills" element={<BillsList />} />
          <Route path="/bill/:id" element={<ViewBill />} />
          <Route path="/brand-assets" element={<BrandAssets />} />
        </Routes>
      </Layout>
    </AssetsProvider>
  )
}
