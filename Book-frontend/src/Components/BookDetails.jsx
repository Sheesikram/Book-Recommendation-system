import React, { useEffect, useState } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'

const BookDetails = () => {
    const { id } = useParams()
    const location = useLocation()
    const navigate = useNavigate()
    const [book, setBook] = useState(location.state?.book || null)
    const [recommended, setRecommended] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                // If we don't have book data from navigation state, try to fetch all books and find it
                if (!book) {
                    const res = await axios.get('http://localhost:8000/books')
                    const found = res.data.find((b) => String(b.book_id) === String(id) || String(b.id) === String(id))
                    setBook(found || { title: 'Unknown', authors: '', image_url: '', book_id: id })
                }

                // Fetch recommendations from backend
                const recRes = await axios.get(`http://127.0.0.1:8000/recommend/${id}`)
                // Normalize different possible response shapes into an array
                let recData = recRes.data
                let recArray = []

                if (Array.isArray(recData)) {
                    recArray = recData
                } else if (recData && typeof recData === 'object') {
                    // Common shapes: { recommendations: [...] } or { recommended: [...] } or { data: [...] }
                    if (Array.isArray(recData.recommendations)) recArray = recData.recommendations
                    else if (Array.isArray(recData.recommended)) recArray = recData.recommended
                    else if (Array.isArray(recData.data)) recArray = recData.data
                    else {
                        // If object keys map to book ids, try to extract values that are arrays/objects
                        const vals = Object.values(recData)
                        const maybeArray = vals.find(v => Array.isArray(v))
                        if (maybeArray) recArray = maybeArray
                    }
                }

                setRecommended(recArray)
                // console.log('Normalized recommended bo oks:', recArray)
            } catch (err) {
                console.error(err)
                setError('Failed to load book details or recommendations.')
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [id])

    if (loading) return <div className="p-6">Loading...</div>
    if (error) return <div className="p-6 text-red-600">{error}</div>

    return (
        <div className=" mx-auto p-6">
            <button onClick={() => navigate(-1)} className="mb-4 px-3 py-1 bg-gray-200 rounded">Back</button>

            <div className='flex justify-center gap-6 bg-white'>
                <div className=" shadow rounded p-4">
                    <div className="flex flex-col justify-center items-center align-center text-center my-3">
                        <img
                            src={book?.image_url || 'https://via.placeholder.com/180'}
                            alt={book?.title}
                            className="w-96 h-80 rounded"
                        />
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold mb-2">{book?.original_title || book?.title || 'Untitled'}</h2>
                        <p className="text-gray-600 mb-4">{book?.authors}</p>
                        <p className="text-sm text-gray-700">Rating: {book?.average_rating ?? 'N/A'}</p>
                    </div>
                </div>
            </div>

            <h3 className="mt-6 text-xl font-semibold">Recommended Books</h3>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
                {recommended.length === 0 && <div className="text-gray-600">No recommendations found.</div>}
                {recommended.map((rb, idx) => (
                    <div key={rb.book_id ?? idx} className="bg-white shadow rounded overflow-hidden w-72">
                        <img src={rb.image_url || 'https://via.placeholder.com/150'} alt={rb.title} className="w-full h-40 object-cover" />
                        <div className="p-2">
                            <div className="font-medium text-sm truncate">{rb.original_title || rb.title}</div>
                            <div className="text-xs text-gray-500">{rb.authors}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default BookDetails
