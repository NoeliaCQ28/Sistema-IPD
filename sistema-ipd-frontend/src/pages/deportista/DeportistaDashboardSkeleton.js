import React from 'react';
import './DeportistaHomePage.css'; // Reutiliza los mismos estilos

const DeportistaDashboardSkeleton = () => (
    <div className="deportista-portal">
        <header className="portal-header">
            <div className="portal-header-text">
                <h1>Cargando...</h1>
                <p>Tu centro de mando deportivo.</p>
            </div>
        </header>
        <main className="portal-main-content">
            <aside className="portal-sidebar">
                <div className="skeleton-card">
                    <div className="skeleton-avatar"></div>
                    <div className="skeleton-line" style={{ width: '80%', margin: '0 auto 0.75rem' }}></div>
                    <div className="skeleton-line" style={{ width: '60%', margin: '0 auto 0.75rem' }}></div>
                    <div className="skeleton-line" style={{ width: '90%', margin: '0 auto' }}></div>
                </div>
            </aside>
            <section className="portal-feed">
                <div className="skeleton-card">
                    <div className="skeleton-line" style={{ width: '40%', height: '1.5em' }}></div>
                    <div className="skeleton-line" style={{ marginTop: '1.5rem' }}></div>
                    <div className="skeleton-line" style={{ width: '90%' }}></div>
                    <div className="skeleton-line" style={{ width: '80%' }}></div>
                </div>
            </section>
        </main>
    </div>
);

export default DeportistaDashboardSkeleton;