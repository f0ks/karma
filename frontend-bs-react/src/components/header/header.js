import React from 'react';
import './header.scss';

export default class Header extends React.Component {
    render() {
        return (
            <header className="header d-flex flex-column flex-md-row align-items-center p-3 px-md-4 mb-3 border-bottom shadow-sm">
                <h5 className="my-0 mr-md-auto font-weight-normal">Boroda board</h5>
                <nav className="my-2 my-md-0 mr-md-3">
                    <a className="p-2 text-dark" href="#">Contact</a>
                </nav>
                {/*<a className="btn btn-outline-primary" href="#">Sign up</a>*/}
            </header>

        );
    }
}