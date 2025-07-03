import React from 'react'
import ReactDOM from 'react-dom'

export default function Modal({ 
  isOpen, 
  onClose, 
  children, 
  title,
  maxWidth = 'xl',
  showCloseButton = true,
  className = ''
}) {
  if (!isOpen) return null

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-transparent backdrop-blur-[4px]" 
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className={`relative bg-gray-800 rounded-xl shadow-2xl border border-gray-700 w-full mx-2 p-4 z-10 ${
        maxWidth === 'sm' ? 'max-w-sm' : 
        maxWidth === 'md' ? 'max-w-md' :
        maxWidth === 'lg' ? 'max-w-lg' :
        maxWidth === 'xl' ? 'max-w-xl' : 
        maxWidth === '2xl' ? 'max-w-2xl' : 
        maxWidth
      } ${className}`}>
        
        {/* Close Button */}
        {showCloseButton && (
          <button
            className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-2xl font-bold"
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
        )}

        {/* Title */}
        {title && (
          <h2 className="text-xl font-bold text-white mb-3 text-center">
            {title}
          </h2>
        )}

        {/* Content */}
        {children}
      </div>
    </div>
  )

  return ReactDOM.createPortal(modalContent, document.body)
}
