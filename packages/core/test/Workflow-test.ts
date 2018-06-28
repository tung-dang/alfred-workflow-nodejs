import { assert } from 'chai';
import * as sinon from 'sinon';
import * as proxyquire from "proxyquire";

import Item from '../src/Item';
import storage  from '../src/storage';
import { SUB_ACTION_DIVIDER_SYMBOL } from '../src/constants';

const convertJSObjectToString = obj => JSON.stringify(obj, null, '  ');

describe('Test Workflow', function() {
  const sandbox = sinon.sandbox.create();

  let workflow;
  let Workflow;

  beforeEach(() => {
    Workflow = proxyquire.noCallThru().load('../src/Workflow.ts', {}).default;
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
    it('With empty item list, should show error', () => {
      sandbox.spy(workflow, "error");
      workflow.feedback();
      assert.equal(workflow.error.callCount, 1);
    });

    it('#addItem: Add an item', function() {
      const item = new Item({
        title: 'title'
      });
      workflow.addItem(item);

      assert.strictEqual(
        workflow.feedback(),
        convertJSObjectToString({
          items: [
            {
              uid: "title",
              title: 'title',
              subtitle: '',
              type: 'default',
              icon: {
                "path": "ICON_DEFAULT"
              },
              hasSubItems: false,
              match: "title | undefined",
              valid: true,
            }
          ]
        })
      );
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

      assert.strictEqual(
        workflow.feedback(),
        convertJSObjectToString({
          items: [
            {
              uid: "title1",
              title: 'title1',
              subtitle: '',
              type: "default",
              icon: {
                "path": "ICON_DEFAULT"
              },
              hasSubItems: false,
              match: "title1 | undefined",
              valid: true
            },

            {
              uid: "title2",
              title: 'title2',
              subtitle: '',
              type: "default",
              icon: {
                "path": "ICON_DEFAULT"
              },
              hasSubItems: false,
              match: "title2 | undefined",
              valid: true
            }
          ]
        })
      );
    });

    it('Should clear items after generating feedback', function() {
      const item = new Item({
        title: 'title'
      });
      workflow.addItem(item);
      workflow.feedback();

      assert.strictEqual(
        workflow.feedback(),
        undefined
      );
    });

    it('Should clear all items when generating error feedback', function() {
      const item = new Item({
        title: 'title'
      });
      workflow.addItem(item);

      assert.strictEqual(
        workflow.error('wf error'),
        convertJSObjectToString({
          items: [
            {
              uid: 'wf error',
              title: 'wf error',
              subtitle: '',
              type: "default",
              icon: {
                path: 'ICON_ERROR'
              },
              hasSubItems: false,
              match: "wf error | ",
              valid: true
            }
          ]
        })
      );
    });
  });

  describe('#onAction', () => {
    it('should handle top level action', () => {
      const spy = sandbox.spy();
      workflow.onAction('action_name', spy);
      workflow._trigger('action_name', 'queryabc');

      assert.isTrue(spy.calledWith('queryabc'));
    });

    it('should handle top level action with query as object', () => {
      const spy = sandbox.spy();
      workflow.onAction('action_name', spy);
      workflow._trigger('action_name', '{ "a": 1, "b": 2 }');

      assert.isTrue(spy.calledWith({ a: 1, b: 2 }));
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
      workflow._trigger(
        'action_name',
        'top_action_name_1 ' + SUB_ACTION_DIVIDER_SYMBOL + ' queryabc'
      );

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
      workflow._trigger(
        'action_name',
        'top_action_name_1 ' + SUB_ACTION_DIVIDER_SYMBOL + ' queryabc     '
      );

      assert.isTrue(spy.calledWith('queryabc', 'top_action_name_1', ''));
    });

    it('should handle non top level action and arg', () => {
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
      workflow._trigger(
        'action_name',
        'top_action_name_1 ' + SUB_ACTION_DIVIDER_SYMBOL + ' queryabc     '
      );

      assert.isTrue(
        spy.calledWith('queryabc', 'top_action_name_1', { a: 1, b: 2 })
      );
    });
  });
});
