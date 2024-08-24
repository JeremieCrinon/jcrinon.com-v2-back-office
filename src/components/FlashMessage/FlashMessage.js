import React, { useState, useEffect } from 'react';

function FlashMessage({ message, onClose }) {
    useEffect(() => {
        // Définir un délai pour fermer automatiquement le message après 10 secondes
        const timer = setTimeout(() => {
            onClose();
        }, 10000); // 10000 ms = 10 secondes

        // Nettoyer le timeout si le composant est démonté
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="alert alert-success" role="alert">
            {message}
        </div>
    );
}

export default FlashMessage;
