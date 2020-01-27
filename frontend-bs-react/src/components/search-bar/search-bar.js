import React from 'react';
import './search-bar.scss';

export default class SearchBar extends React.Component {
    render() {
        return (
            <section className={'search-bar'}>
                <div className="md-form active-pink active-pink-2 mb-3 mt-0">
                    <input className="form-control {/*form-control-lg*/}" type="text" placeholder="Search" aria-label="Search" />
                </div>
            </section>

        );
    }
}