const { assert, expect } = require('chai');
const sinon = require('sinon');
const proxyquire = require('proxyquire');

describe('#utilities', function() {
    let utils;
    const sandbox = sinon.sandbox.create();


    beforeEach(() => {
        utils = proxyquire.noCallThru().load('../src/utilities', {
        });
    });

    afterEach(() => {
        sandbox.reset();
    });

    describe('#filter', () => {
        it('test with array of string and no keyBuilder function', () => {
            const arrays = ['ab', 'abcd', 'hello world', '1234'];
            let result = utils.filter('ab', arrays);
            assert.deepEqual(result, ['ab', 'abcd']);


            result = utils.filter('hl', arrays);
            assert.deepEqual(result, ['hello world'])
        });

        it('test with array of object and has keyBuilder function', () => {
            const arrays = [
                { name: 'ab' },
                { name: 'abcd' },
                { name: 'hello world' },
                { name: '1234'}
            ];
            let result = utils.filter('ab', arrays, (item) => item.name);
            assert.deepEqual(result, [{ name: 'ab' }, { name: 'abcd' }]);

            result = utils.filter('hl', arrays, (item) => item.name);
            assert.deepEqual(result, [{ name: 'hello world'}])
        });
    });

    describe('#memorizePromise', () => {
        it('should return an expect data', (done) => {
            const promise1 = new Promise((resolve, reject) => {
                resolve('result of promise1');
            });

            const getSomething = () => {
                return utils.memorizePromise('cache_key', 1000 * 60, () => {
                    return promise1;
                });
            };

            getSomething().then((data) => {
                assert.equal(data, 'result of promise1');
                done();
            });
        });
    });

});