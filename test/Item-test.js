const { assert } = require('chai');

const { Item } = require('../src/main');
const { SUB_ACTION_DIVIDER_SYMBOL } = require('../src/constants');

describe('#Item', function() {
    it('check `title` prop', function() {
        const item = new Item({
            title: 'this is a title'
        });

        assert.propertyVal(item.getData(), 'title', 'this is a title');
    });

    it('default value of `subtitle` prop is empty string', function() {
        const item = new Item({
            title: 'this is a title',
        });

        assert.propertyVal(item.getData(), 'subtitle', '');
    });

    it('default value of `valid` prop is true', function() {
        let item = new Item({
            title: 'this is a title',
        });

        assert.propertyVal(item.getData(), 'valid', true);

        item = new Item({
            title: 'this is a title',
            valid: false
        });

        assert.propertyVal(item.getData(), 'valid', false);
    });

    it('`valid` prop should be false if `hasSubItems` is true', function() {
        let item = new Item({
            title: 'this is a title',
            hasSubItems: true
        });

        assert.propertyVal(item.getData(), 'valid', false);
        assert.propertyVal(item.getData(), 'hasSubItems', true);
    });

    it('`arg` prop should be string type if passing an object', function() {
        const item = new Item({
            title: 'this is a title',
            arg: {
                a: 1,
                b: 2
            }
        });

        assert.propertyVal(item.getData(), 'arg', JSON.stringify({
            a: 1,
            b: 2
        }));
    });

    it('`arg` prop should be string type if passing an string', function() {
        const item = new Item({
            title: 'this is a title',
            arg: 'this is a arg'
        });

        assert.propertyVal(item.getData(), 'arg', 'this is a arg');
    });

    it('`icon` prop should be object type if passing a string type', function() {
        const item = new Item({
            title: 'this is a title',
            icon: 'test.png'
        });

        assert.deepEqual(item.getData().icon, {
            path: 'test.png'
        });
    });

    it('autocomplete prop should include previous title if has sub items', function() {
        const item = new Item({
            title: 'this is a title',
            hasSubItems: true
        });

        assert.propertyVal(item.getData(), 'autocomplete', `this is a title ${SUB_ACTION_DIVIDER_SYMBOL} `);
    });
});