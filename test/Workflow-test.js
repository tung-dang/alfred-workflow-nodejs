const { assert } = require('chai');
const sinon = require('sinon');

const { Workflow, Item, storage } = require('../src/main');
const { SUB_ACTION_SEPARATOR } = require('../src/constants');

const convertJSObjectToString = (obj) => JSON.stringify(obj, null, '\t');

describe('#WorkflowTest', function() {
    const sandbox = sinon.sandbox.create();

    let workflow;

    beforeEach(() => {
        workflow = new Workflow();
    });

    afterEach(() => {
        sandbox.reset();
        storage.clear();
    });


    it('#setName and #getName', () => {
        workflow.setName('test name');

        assert.equal(workflow.getName('test name'), 'test name');
    });

    describe('Generate feedback', () => {
        it('With empty item list', () => {
            assert.strictEqual(workflow.feedback(), convertJSObjectToString({ items: [] }));
        });


        it('Add a item', function() {
            const item = new Item({
                title: 'title'
            });
            workflow.addItem(item);

            assert.strictEqual(workflow.feedback(), convertJSObjectToString({
                items: [
                    {
                        arg: '',
                        title: 'title',
                        subtitle: '',
                        quicklookurl: 'title',
                        hasSubItems: false,
                    },

                ]
            }));
        });

        it('Add multiple items', function() {
            workflow.addItems([
                new Item({
                    title: 'title1'
                }),
                new Item({
                    title: 'title2'
                })
            ]);

            assert.strictEqual(workflow.feedback(), convertJSObjectToString({
                items: [
                    {
                        arg: '',
                        title: 'title1',
                        subtitle: '',
                        quicklookurl: 'title1',
                        hasSubItems: false,
                    },

                    {
                        arg: '',
                        title: 'title2',
                        subtitle: '',
                        quicklookurl: 'title2',
                        hasSubItems: false,
                    }
                ]
            }));
        });

        it('Should clear items after generating feedback', function() {
            const item = new Item({
                title: 'title'
            });
            workflow.addItem(item);
            workflow.feedback();

            assert.strictEqual(workflow.feedback(), convertJSObjectToString({ items: [] }));
        });

        it('Should clear all items when generating error feedback', function() {
            const item = new Item({
                title: 'title'
            });
            workflow.addItem(item);

            assert.strictEqual(workflow.error('wf error'), convertJSObjectToString({
                'items': [
                    {
                        arg: '',
                        title:'wf error',
                        subtitle: '',
                        icon:
                            { path:'/System/Library/CoreServices/CoreTypes.bundle/Contents/Resources/AlertStopIcon.icns'
                        },
                        quicklookurl: 'wf error',
                        valid: true,
                        hasSubItems: false
                    }
                ]
            }));
        });

        it('Should clear all items when generating warning feedback', function() {
            const item = new Item({
                title: 'title'
            });
            workflow.addItem(item);

            assert.strictEqual(workflow.warning('wf warning'), convertJSObjectToString({
                'items': [
                    {
                        arg: '',
                        title:'wf warning',
                        subtitle: '',
                        icon:
                            { path:'/System/Library/CoreServices/CoreTypes.bundle/Contents/Resources/AlertCautionIcon.icns'
                        },
                        quicklookurl: 'wf warning',
                        valid: true,
                        hasSubItems: false
                    }
                ]
            }));
        });

        it('Should clear all items when generating info feedback', function() {
            const item = new Item({
                title: 'title'
            });
            workflow.addItem(item);

            assert.strictEqual(workflow.warning('wf info'), convertJSObjectToString({
                'items': [
                    {
                        arg: '',
                        title:'wf info',
                        subtitle: '',
                        icon:
                            { path:'/System/Library/CoreServices/CoreTypes.bundle/Contents/Resources/AlertCautionIcon.icns'
                        },
                        quicklookurl: 'wf info',
                        valid: true,
                        hasSubItems: false
                    }
                ]
            }));
        });
    });

    describe('#onAction', () => {
        it('should handle top level action', () => {
            const spy = sandbox.spy();
            workflow.onAction('action_name', spy);
            workflow._trigger('action_name', 'queryabc');

            assert.isTrue(spy.calledWith('queryabc'));
        });

        it('should handle top level action with trimmed query', () => {
            const spy = sandbox.spy();
            workflow.onAction('action_name', spy);
            workflow._trigger('action_name', '     queryabc   ');

            assert.isTrue(spy.calledWith('queryabc'));
        });
    });

    describe('#onSubActionSelected', () => {
        it('should handle non top level action', () => {
            const spy = sandbox.spy();
            workflow.onSubActionSelected('action_name', spy);
            workflow._trigger('action_name', 'top_action_name_1 ' + SUB_ACTION_SEPARATOR + ' queryabc');

            assert.isTrue(spy.calledWith('queryabc'));
        });

        it('should handle non top level action and trimmed query', () => {
            const spy = sandbox.spy();

            const item = new Item({
                title: 'top_action_name_1',
                arg: ''
            });
            workflow.addItem(item);
            workflow.onSubActionSelected('action_name', spy);
            workflow._trigger('action_name', 'top_action_name_1 ' + SUB_ACTION_SEPARATOR + ' queryabc     ');

            assert.isTrue(spy.calledWith('queryabc', 'top_action_name_1', ''));
        });

        it.only('should handle non top level action and arg', () => {
            const spy = sandbox.spy();

            const item = new Item({
                title: 'top_action_name_1',
                arg: {
                    a: 1,
                    b: 2
                }
            });
            workflow.addItem(item);
            workflow.onSubActionSelected('action_name', spy);
            workflow._trigger('action_name', 'top_action_name_1 ' + SUB_ACTION_SEPARATOR + ' queryabc     ');

            assert.isTrue(spy.calledWith('queryabc', 'top_action_name_1', { a: 1, b: 2 }));
        });
    });
});