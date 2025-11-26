import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { BookRecommender, BookDetails, Navbar, About, Contact, Footer, Auth } from './Components'
import { SearchProvider } from './context/SearchContext'
import { AuthProvider } from './context/AuthContext'

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <SearchProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<BookRecommender />} />
            <Route path="/book/:id" element={<BookDetails />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/auth" element={<Auth />} />
          </Routes>
          <Footer />
        </SearchProvider>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App