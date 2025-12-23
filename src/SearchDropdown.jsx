import './SearchDropdown.css'

function SearchDropdown({ onClose, searchTerm, setSearchTerm, galleryItems, onProductClick, onSearch }) {
    const matchingProducts = galleryItems.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const highlightMatch = (text, searchTerm) => {
        if (!searchTerm) return text
        
        const lowerText = text.toLowerCase()
        const lowerSearch = searchTerm.toLowerCase()
        const index = lowerText.indexOf(lowerSearch)
        
        if (index === -1) return text
        
        const before = text.substring(0, index)
        const match = text.substring(index, index + searchTerm.length)
        const after = text.substring(index + searchTerm.length)
        
        return (
            <>
                {before}
                <strong>{match}</strong>
                {after}
            </>
        )
    }

    return (
        <div 
            className="searchDropdown"
            onClick={(e) => e.stopPropagation()}
        >
            <button 
                className="searchCloseButton"
                onClick={onClose}
            >
                ×
            </button>
            <input 
                className="searchInput" 
                type="text" 
                placeholder="Search..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && searchTerm) {
                        onSearch()
                    }
                }}
            />
            {matchingProducts.length > 0 && searchTerm && (
                <div className="searchResults">
                    {matchingProducts.map((item, index) => (
                        <div 
                            key={index} 
                            className="searchResultItem"
                            onClick={() => onProductClick(item)}
                        >
                            {highlightMatch(item.title, searchTerm)}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default SearchDropdown