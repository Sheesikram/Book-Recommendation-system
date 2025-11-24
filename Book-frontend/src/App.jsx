import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { BookRecommender, BookDetails } from './Components'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BookRecommender />} />
        <Route path="/book/:id" element={<BookDetails />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App