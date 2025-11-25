import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { BookRecommender, BookDetails, Navbar, About, Contact, Footer } from './Components'
import { SearchProvider } from './context/SearchContext'

const App = () => {
  return (
    <BrowserRouter>
      <SearchProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<BookRecommender />} />
          <Route path="/book/:id" element={<BookDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
        <Footer />
      </SearchProvider>
    </BrowserRouter>
  )
}

export default App