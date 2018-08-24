'use strict';

const Boom = require('boom');
const uuid = require('node-uuid');
const Joi = require('joi');

exports.register = function (server, options, next) {

    const db = server.app.db;

    server.route({
        method: 'GET',
        path: '/comments',
        handler: function (request, reply) {

            db.comments.find({}).limit(10).sort({date: -1}, (err, docs) => {

                if (err) {
                    return reply(Boom.wrap(err, 'Internal MongoDB error'));
                }

                reply(docs);
            });

        }
    });


    server.route({
        method: 'GET',
        path: '/comments/{url}',
        handler: function (request, reply) {

            let total;

            db.comments.count({url: request.params.url}, (err, res) => {
                total = res;
                //console.log('count', doc)
            });

            db.comments.find({
                url: request.params.url
            },).limit(request.query.length ? parseInt(request.query) : 10)
                .skip(request.query.skip ? parseInt(request.query.skip) : 0).sort({date: -1}, // new posts first
                (err, doc) => {

                    if (err) {
                        return reply(Boom.wrap(err, 'Internal MongoDB error'));
                    }

                    if (!doc) {
                        return reply(Boom.notFound());
                    }

                    reply(
                        {
                            data: doc,
                            total: total
                        }
                    );
                });

        }
    });

    server.route({
        method: 'GET',
        path: '/comments/id/{id}',
        handler: function (request, reply) {
            db.comments.findOne({
                _id: request.params.id
            }, (err, comment) => {

                if (err) {
                    return reply(Boom.wrap(err, 'Internal MongoDB error'));
                }

                if (!comment) {
                    reply([]);
                }

                reply(comment);
            });

        }
    });

    server.route({
        method: 'POST',
        path: '/comments',
        handler: function (request, reply) {

            const record = request.payload;

            //Create an id
            record._id = uuid.v1();
            record.date = new Date().getTime();
            record.replies = [];

            db.comments.save(record, (err, result) => {

                if (err) {
                    return reply(Boom.wrap(err, 'Internal MongoDB error'));
                } else {
                    // find comment which is we repling
                    // and write id of reply to list
                    if (request.payload.replyTo) {
                        db.comments.update({_id: request.payload.replyTo}, {$push: {replies: record._id}});
                    }
                }

                reply(record);
            });
        },
        config: {
            validate: {
                payload: {
                    url: Joi.string().min(3).max(2000).required(),
                    comment: Joi.string().max(10000),
                    images: Joi.array(),
                    replyTo: Joi.string().min(36).max(36)
                }
            }
        }
    });

    return next();
};

exports.register.attributes = {
    name: 'routes-comments'
};