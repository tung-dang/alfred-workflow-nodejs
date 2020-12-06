"use strict";
exports.__esModule = true;
var chai_1 = require("chai");
var proxyquire = require("proxyquire");
var SUB_ACTION_DIVIDER_SYMBOL = '➤';
describe.only('Test AfItem', function () {
    var AfItem;
    beforeEach(function () {
        AfItem = proxyquire.noCallThru().load('../src/AfItem.ts', {})["default"];
    });
    afterEach(function () { });
    it('check `title` prop', function () {
        var item = new AfItem({
            title: 'this is a title'
        });
        chai_1.assert.propertyVal(item.getAlfredItemData(), 'title', 'this is a title');
    });
    it('default value of `subtitle` prop is empty string', function () {
        var item = new AfItem({
            title: 'this is a title'
        });
        chai_1.assert.propertyVal(item.getAlfredItemData(), 'subtitle', '');
    });
    it('default value of `valid` prop is true', function () {
        var item = new AfItem({
            title: 'this is a title'
        });
        chai_1.assert.propertyVal(item.getAlfredItemData(), 'valid', true);
        item = new AfItem({
            title: 'this is a title',
            valid: false
        });
        chai_1.assert.propertyVal(item.getAlfredItemData(), 'valid', false);
    });
    it('`valid` prop should be false if `hasSubItems` is true', function () {
        var item = new AfItem({
            title: 'this is a title',
            hasSubItems: true
        });
        chai_1.assert.propertyVal(item.getAlfredItemData(), 'valid', false);
        chai_1.assert.propertyVal(item.getAlfredItemData(), 'hasSubItems', true);
    });
    describe('#arg', function () {
        it('`arg` prop should be string type if passing an object', function () {
            var item = new AfItem({
                title: 'this is a title',
                arg: {
                    a: 1,
                    b: 2
                }
            });
            chai_1.assert.propertyVal(item.getAlfredItemData(), 'arg', JSON.stringify({
                a: 1,
                b: 2
            }));
        });
        it('`arg` prop should be string type if passing a string', function () {
            var item = new AfItem({
                title: 'this is a title',
                arg: 'this is a arg'
            });
            chai_1.assert.propertyVal(item.getAlfredItemData(), 'arg', 'this is a arg');
        });
        it('`arg` prop in `mods` prop should be string type if passing an object', function () {
            var item = new AfItem({
                title: 'this is a title',
                mods: {
                    alt: {
                        valid: true,
                        arg: {
                            a: 1,
                            b: 2
                        },
                        subtitle: 'https://www.alfredapp.com/powerpack/'
                    }
                }
            });
            chai_1.assert.propertyVal(item.getAlfredItemData().mods.alt, 'arg', JSON.stringify({
                a: 1,
                b: 2
            }));
        });
        it('`arg` prop in `mods` prop should be string type if passing a string', function () {
            var item = new AfItem({
                title: 'this is a title',
                mods: {
                    alt: {
                        valid: true,
                        arg: '{ a: 1, b: 2 }',
                        subtitle: 'https://www.alfredapp.com/powerpack/'
                    }
                }
            });
            chai_1.assert.propertyVal(item.getAlfredItemData().mods.alt, 'arg', '{ a: 1, b: 2 }');
        });
    });
    it('`icon` prop should be object type if passing a string type', function () {
        var item = new AfItem({
            title: 'this is a title',
            icon: 'test.png'
        });
        chai_1.assert.deepEqual(item.getAlfredItemData().icon, {
            path: 'test.png'
        });
    });
    it('autocomplete prop should include previous title if has sub items', function () {
        var item = new AfItem({
            title: 'this is a title',
            hasSubItems: true
        });
        chai_1.assert.propertyVal(item.getAlfredItemData(), 'autocomplete', "this is a title " + SUB_ACTION_DIVIDER_SYMBOL + " ");
    });
});
