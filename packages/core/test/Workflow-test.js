"use strict";
exports.__esModule = true;
var chai_1 = require("chai");
var sinon = require("sinon");
var proxyquire = require("proxyquire");
var AfItem_1 = require("../src/AfItem");
var storage_1 = require("../src/storage");
var constants_1 = require("../src/constants");
var convertJSObjectToString = function (obj) { return JSON.stringify(obj, null, '  '); };
describe('Test AfWorkflow', function () {
    var sandbox = sinon.sandbox.create();
    var workflow;
    var AfWorkflow;
    beforeEach(function () {
        AfWorkflow = proxyquire.noCallThru().load('../src/AfWorkflow.ts', {})["default"];
        workflow = new AfWorkflow();
    });
    afterEach(function () {
        sandbox.reset();
        storage_1["default"].clear();
    });
    it('#setName and #getName', function () {
        workflow.setName('test name');
        chai_1.assert.equal(workflow.getName('test name'), 'test name');
    });
    describe('Generate feedback', function () {
        it('With empty item list, should show error', function () {
            sandbox.spy(workflow, 'error');
            workflow.feedback();
            chai_1.assert.equal(workflow.error.callCount, 1);
        });
        it('#addItem: Add an item', function () {
            var item = new AfItem_1["default"]({
                title: 'title'
            });
            workflow.addItem(item);
            chai_1.assert.strictEqual(workflow.feedback(), convertJSObjectToString({
                items: [
                    {
                        uid: 'title',
                        title: 'title',
                        subtitle: '',
                        type: 'default',
                        icon: {
                            path: 'ICON_DEFAULT'
                        },
                        hasSubItems: false,
                        match: 'title | undefined',
                        valid: true
                    }
                ]
            }));
        });
        it('Add multiple items', function () {
            workflow.addItems([
                new AfItem_1["default"]({
                    title: 'title1'
                }),
                new AfItem_1["default"]({
                    title: 'title2'
                })
            ]);
            chai_1.assert.strictEqual(workflow.feedback(), convertJSObjectToString({
                items: [
                    {
                        uid: 'title1',
                        title: 'title1',
                        subtitle: '',
                        type: 'default',
                        icon: {
                            path: 'ICON_DEFAULT'
                        },
                        hasSubItems: false,
                        match: 'title1 | undefined',
                        valid: true
                    },
                    {
                        uid: 'title2',
                        title: 'title2',
                        subtitle: '',
                        type: 'default',
                        icon: {
                            path: 'ICON_DEFAULT'
                        },
                        hasSubItems: false,
                        match: 'title2 | undefined',
                        valid: true
                    }
                ]
            }));
        });
        it('Should clear items after generating feedback', function () {
            var item = new AfItem_1["default"]({
                title: 'title'
            });
            workflow.addItem(item);
            workflow.feedback();
            chai_1.assert.strictEqual(workflow.feedback(), undefined);
        });
        it('Should clear all items when generating error feedback', function () {
            var item = new AfItem_1["default"]({
                title: 'title'
            });
            workflow.addItem(item);
            chai_1.assert.strictEqual(workflow.error('wf error'), convertJSObjectToString({
                items: [
                    {
                        uid: 'wf error',
                        title: 'wf error',
                        subtitle: '',
                        type: 'default',
                        icon: {
                            path: 'ICON_ERROR'
                        },
                        hasSubItems: false,
                        match: 'wf error | ',
                        valid: true
                    }
                ]
            }));
        });
    });
    describe('#onAction', function () {
        it('should handle top level action', function () {
            var spy = sandbox.spy();
            workflow.onAction('action_name', spy);
            workflow._trigger('action_name', 'queryabc');
            chai_1.assert.isTrue(spy.calledWith('queryabc'));
        });
        it('should handle top level action with query as object', function () {
            var spy = sandbox.spy();
            workflow.onAction('action_name', spy);
            workflow._trigger('action_name', '{ "a": 1, "b": 2 }');
            chai_1.assert.isTrue(spy.calledWith({ a: 1, b: 2 }));
        });
        it('should handle top level action with trimmed query', function () {
            var spy = sandbox.spy();
            workflow.onAction('action_name', spy);
            workflow._trigger('action_name', '     queryabc   ');
            chai_1.assert.isTrue(spy.calledWith('queryabc'));
        });
    });
    describe('#onSubActionSelected', function () {
        it('should handle non top level action', function () {
            var spy = sandbox.spy();
            workflow.onSubActionSelected('action_name', spy);
            workflow._trigger('action_name', 'top_action_name_1 ' + constants_1.SUB_ACTION_DIVIDER_SYMBOL + ' queryabc');
            chai_1.assert.isTrue(spy.calledWith('queryabc'));
        });
        it('should handle non top level action and trimmed query', function () {
            var spy = sandbox.spy();
            var item = new AfItem_1["default"]({
                title: 'top_action_name_1',
                arg: ''
            });
            workflow.addItem(item);
            workflow.onSubActionSelected('action_name', spy);
            workflow._trigger('action_name', 'top_action_name_1 ' + constants_1.SUB_ACTION_DIVIDER_SYMBOL + ' queryabc     ');
            chai_1.assert.isTrue(spy.calledWith('queryabc', 'top_action_name_1', ''));
        });
        it('should handle non top level action and arg', function () {
            var spy = sandbox.spy();
            var item = new AfItem_1["default"]({
                title: 'top_action_name_1',
                arg: {
                    a: 1,
                    b: 2
                }
            });
            workflow.addItem(item);
            workflow.onSubActionSelected('action_name', spy);
            workflow._trigger('action_name', 'top_action_name_1 ' + constants_1.SUB_ACTION_DIVIDER_SYMBOL + ' queryabc     ');
            chai_1.assert.isTrue(spy.calledWith('queryabc', 'top_action_name_1', { a: 1, b: 2 }));
        });
    });
});
