const { assert, expect } = require('chai');
const sinon = require('sinon');
const proxyquire = require('proxyquire');

describe('#storage', function() {
    let storage;
    const sandbox = sinon.sandbox.create();
    const setPasswordSpy = sandbox.spy();
    const getPasswordSpy = sandbox.stub();


    beforeEach(() => {
        storage = proxyquire.noCallThru().load('../src/storage', {
            'keychain': {
                setPassword: setPasswordSpy,
                getPassword: getPasswordSpy
            }
        });
    });

    afterEach(() => {
        storage.clear();
        sandbox.reset();
    });

    it('#get & #set with primitive type', () => {
        storage.set('test_key', 1);
        assert.equal(1, storage.get('test_key'))


        storage.set('test_key', 'a string');
        assert.equal('a string', storage.get('test_key'))
    });

    it('#get & #set with object type', () => {
        storage.set('test_key', {
            a: 1,
            b: 2
        });

        assert.deepEqual({
            a: 1,
            b: 2
        }, storage.get('test_key'))
    });

    it('#remove', () => {
        storage.set('test_key', {
            a: 1,
            b: 2
        });
        storage.remove('test_key');

        assert.deepEqual(undefined, storage.get('test_key'))
    });

    it('#clear', () => {
        storage.set('test_key', {
            a: 1,
            b: 2
        });
        storage.clear();

        assert.deepEqual(undefined, storage.get('test_key'))
    });

    describe('#setting', () => {
        it('#setSetting', () => {
            storage.setSetting('test_key', 1);
            assert.deepEqual(1, storage.getSetting('test_key'))

            storage.setSetting('test_key', 'a string');
            assert.deepEqual('a string', storage.getSetting('test_key'))


            storage.setSetting('test_key', {
                a: 1,
                b: 2
            });
            assert.deepEqual({
                a: 1,
                b: 2
            }, storage.getSetting('test_key'))
        });

        it('#removeSetting', () => {
            storage.setSetting('test_key', 1);
            storage.removeSetting('test_key');
            assert.deepEqual(undefined, storage.getSetting('test_key'));
        });

        it('#setPassword', () => {
            storage.setSetting('test_key', 1);
            storage.clearSetting();
            assert.deepEqual(undefined, storage.getSetting('test_key'));
        });
    });

    describe('#password', () => {
        it('#setPassword in happy case', () => {
            storage.setPassword('admin', '123456', {
                getName: () => 'a mock of Workflow object'
            });

            const actual = setPasswordSpy.getCall(0).args[0];
            assert.propertyVal(actual, 'account', 'admin');
            assert.propertyVal(actual, 'service', 'a mock of Workflow object');
            assert.propertyVal(actual, 'password', '123456');
        });

        it('#setPassword in missing given input', () => {
            storage.setPassword('', '', {
                getName: () => 'a mock of Workflow object'
            });

            assert.isFalse(setPasswordSpy.called);
        });

        it('#getPassword', (done) => {
            getPasswordSpy.callsArgWith(1, null, '123456');
            storage.getPassword('admin', {
                getName: () => 'a mock of Workflow object'
            })
            .then((data) => {
                assert.equal(data, '123456');
                done();
            });
        });


        it('#getPassword missing arguments', (done) => {
            getPasswordSpy.callsArgWith(1, null, '123456');
            storage.getPassword('')
                .then(
                    (data) => {},
                    (error) => {
                        assert.isTrue(true, 'this promise should be rejected');
                        done();
                    }
                );
        });
    });
});