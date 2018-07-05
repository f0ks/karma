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
        method: 'POST',
        path: '/comments',
        handler: function (request, reply) {

            const record = request.payload;

            //Create an id
            record._id = uuid.v1();
            record.date = new Date().getTime();

            db.comments.save(record, (err, result) => {

                if (err) {
                    return reply(Boom.wrap(err, 'Internal MongoDB error'));
                }

                reply(record);
            });
        },
        config: {
            validate: {
                payload: {
                    url: Joi.string().min(3).max(2000).required(),
                    comment: Joi.string().min(1).max(10000),
                    images: Joi.array()
                }
            }
        }
    });

    server.route({
        method: 'PATCH',
        path: '/comments/{id}',
        handler: function (request, reply) {

            db.comments.update({
                _id: request.params.id
            }, {
                $set: request.payload
            }, function (err, result) {

                if (err) {
                    return reply(Boom.wrap(err, 'Internal MongoDB error'));
                }

                if (result.n === 0) {
                    return reply(Boom.notFound());
                }

                reply().code(204);
            });
        },
        config: {
            validate: {
                payload: Joi.object({
                    title: Joi.string().min(10).max(50).optional(),
                    author: Joi.string().min(10).max(50).optional(),
                    isbn: Joi.number().optional()
                }).required().min(1)
            }
        }
    });

    server.route({
        method: 'DELETE',
        path: '/comments/{id}',
        handler: function (request, reply) {

            db.comments.remove({
                _id: request.params.id
            }, function (err, result) {

                if (err) {
                    return reply(Boom.wrap(err, 'Internal MongoDB error'));
                }

                if (result.n === 0) {
                    return reply(Boom.notFound());
                }

                reply().code(204);
            });
        }
    });

    return next();
};

exports.register.attributes = {
    name: 'routes-comments'
};