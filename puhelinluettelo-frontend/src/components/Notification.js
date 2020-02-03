import React from 'react'

const Notification = ({ message }) => {
    if (message === null) {
        return null
    }

    if (message.startsWith('Error:')) {
        return (
            <div className="errorMessage">
                {message}
            </div>
        )
    }

    return (
        <div className="successMessage">
            {message}
        </div>
    )
}

export default Notification