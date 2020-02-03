import React from 'react';
import './comment.scss';

export default class Comment extends React.Component {
    render() {
        return (
            <div className="comments">

                <div className="comments_comment card mb-4 shadow-sm">
                    {/*
                    <div className="card-header">
                        <p>Card header</p>
                    </div>
                    */}
                    <div className="comments__body card-body">
                        <p>Lorem ipsum dolor sit amet</p>
                    </div>
                </div>
                <div className="comments_comment card mb-4 shadow-sm">
                    {/*
                    <div className="card-header">
                        <p>Card header</p>
                    </div>
                    */}
                    <div className="comments__body card-body">
                        <p>Lorem ipsum dolor sit amet</p>
                    </div>
                </div>
                <div className="comments_comment card mb-4 shadow-sm">
                    {/*
                    <div className="card-header">
                        <p>Card header</p>
                    </div>
                    */}
                    <div className="comments__body card-body">
                        <p>Lorem ipsum dolor sit amet</p>
                    </div>
                </div>

            </div>

        );
    }
}