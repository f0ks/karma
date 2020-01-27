import React from 'react';
import './posting-form.scss'

export default class PostingForm extends React.Component {
    render() {
        return (
            <section className={'posting-form'}>

                <div className="form-group">
                    <textarea className={'form-control'}> </textarea>
                </div>

                <div className="form-group text-left">
                    <button type="button" className="btn btn-primary">Post</button>
                    <button type="button" className="btn btn-outline-primary">Attach image</button>
                </div>
            </section>

        );
    }
}