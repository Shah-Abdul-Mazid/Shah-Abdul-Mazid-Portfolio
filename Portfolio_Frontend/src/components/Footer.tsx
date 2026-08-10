const Footer = () => {
    return (
        <footer>
            <div className="container">
                <p>&copy; {new Date().getFullYear()} Your Website. All rights reserved.</p>
            </div>

            <style>{`
                footer {
                    padding: 60px 0;
                    border-top: 1px solid var(--border-color);
                    text-align: center;
                }

                footer p {
                    margin: 0 auto;
                    font-size: 0.9375rem;
                    color: var(--text-secondary);
                }
            `}</style>
        </footer>
    );
};

export default Footer;