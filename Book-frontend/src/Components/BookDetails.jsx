import React, { useEffect, useState } from 'react'
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom'
import axios from 'axios'

// Clean, single-definition BookDetails component
const BookDetails = () => {
    const { id } = useParams()
    const location = useLocation()
    const navigate = useNavigate()
    const [book, setBook] = useState(location.state?.book || null)
    const [recommended, setRecommended] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        let mounted = true
        const fetch = async () => {
            try {
                // If navigation passed book in location.state, use it (handles in-place Link navigation)
                if (location.state?.book) {
                    if (mounted) setBook(location.state.book)
                } else if (!book || String(book?.book_id || book?.id) !== String(id)) {
                    // Otherwise fetch list and find the book by id
                    const res = await axios.get('http://localhost:8000/books')
                    const found = res.data.find((b) => String(b.book_id) === String(id) || String(b.id) === String(id))
                    if (mounted) setBook(found || { title: 'Unknown', authors: '', image_url: '', book_id: id })
                }

                // Fetch recommendations for this id
                const recRes = await axios.get(`http://127.0.0.1:8000/recommend/${id}`)
                if (!mounted) return
                const recData = recRes.data
                const list = Array.isArray(recData)
                    ? recData
                    : Array.isArray(recData?.recommendations)
                        ? recData.recommendations
                        : Array.isArray(recData?.recommended)
                            ? recData.recommended
                            : Array.isArray(recData?.data)
                                ? recData.data
                                : []
                setRecommended(list)
            } catch (err) {
                console.error(err)
                setError('Failed to load')
            } finally {
                if (mounted) setLoading(false)
            }
        }
        fetch()
        return () => {
            mounted = false
        }
    }, [id, location.state])

    if (loading) return <div className="p-6">Loading...</div>
    if (error) return <div className="p-6 text-red-600">{error}</div>

    return (
        <div className="p-6">
            <button onClick={() => navigate(-1)} className="px-3 py-1 bg-gray-300 rounded">
                Back
            </button>

            <div className="mt-4 flex flex-col justify-center md:flex-row gap-6">
                <div className="flex flex-col lg:flex-row justify-center lg:gap-10 gap-2 items-center mx-auto">

                    <div className="lg:w-72 w-48 flex justify-center ">
                        <img
                            src={book?.image_url || 'https://via.placeholder.com/180'}
                            alt={book?.title || 'Book cover'}
                            className="w-full h-auto rounded-lg shadow-md object-cover"
                        />
                    </div>

                    <div className="flex-1">
                        <h1 className="lg:text-2xl font-bold">{book?.original_title || book?.title}</h1>
                        <p className="text-gray-600 mt-1">{book?.authors}</p>
                        <div className="mt-3 text-sm text-gray-700 space-y-1">
                            <div>⭐ Rating: {book?.rating ?? 'N/A'}</div>
                            {book?.year && <div>Year: {book.year}</div>}
                        </div>
                    </div>
                </div>

            </div>

            <h2 className="mt-6 font-semibold">Recommended</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mt-3">
                {recommended.length === 0 && (
                    <div className="col-span-full text-center text-gray-600 py-8">
                        <p className="text-lg">No recommendations found.</p>
                    </div>
                )}

                {recommended.map((rb, i) => {
                    const recId = rb?.book_id ?? rb?.id ?? i
                    return (
                        <Link
                            key={recId}
                            to={`/book/${recId}`}
                            state={{ book: rb }}
                            className="block bg-white h-auto md:h-72 rounded-lg overflow-hidden shadow cursor-pointer hover:shadow-lg transition transform hover:scale-105"
                        >
                            <div className="w-full h-44 bg-gray-100">
                                <img
                                    src={rb?.image_url || 'https://via.placeholder.com/150'}
                                    alt={rb?.title || 'Recommended book'}
                                    className="w-full h-44 object-cover"
                                />
                            </div>
                            <div className="p-2">
                                <div className="font-medium text-sm truncate" title={rb?.original_title || rb?.title}>
                                    {rb?.original_title || rb?.title}
                                </div>
                                <div className="text-xs text-gray-500 truncate" title={rb?.authors}>
                                    {rb?.authors}
                                </div>
                            </div>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}

export default BookDetails
