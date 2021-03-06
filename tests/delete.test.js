'use strict';

/* global describe before beforeEach it */

/* eslint-disable */

const assert = require('assert');
const { expect, should } = require('chai');

/* eslint-enable */

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const environment = require('dotenv');
const varium = require('varium');
const { connect } = require('marpat');
const { Filemaker } = require('../index.js');

chai.use(chaiAsPromised);

describe('Delete Capabilities', () => {
  let database, client;
  before(done => {
    environment.config({ path: './tests/.env' });
    varium(process.env, './tests/env.manifest');
    connect('nedb://memory')
      .then(db => {
        database = db;
        return database.dropDatabase();
      })
      .then(() => {
        return done();
      });
  });

  beforeEach(done => {
    client = Filemaker.create({
      application: process.env.APPLICATION,
      server: process.env.SERVER,
      user: process.env.USERNAME,
      password: process.env.PASSWORD
    });
    done();
  });
  it('should delete FileMaker records.', () => {
    return expect(
      client
        .create(process.env.LAYOUT, { name: 'Darth Vader' })
        .then(response => client.delete(process.env.LAYOUT, response.recordId))
    ).to.eventually.be.a('object');
  });

  it('should reject deletions that do not specify a recordId', () => {
    return expect(client.delete(process.env.LAYOUT, '-2').catch(error => error))
      .to.eventually.be.a('object')
      .that.has.all.keys('code', 'message');
  });
});
