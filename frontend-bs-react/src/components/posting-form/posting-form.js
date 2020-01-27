import React from 'react';
import './posting-form.scss'

export default class PostingForm extends React.Component {
    render() {
        return (
            <section className={'posting-form'}>
                <textarea className={'form-control'}> </textarea>

                <button type="button" className="btn btn-secondary">Attach image</button>
                <button type="button" className="btn btn-primary">Post</button>
            </section>

        );
    }
}