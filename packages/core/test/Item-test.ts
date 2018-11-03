import { assert } from 'chai';
import * as proxyquire from 'proxyquire';

const SUB_ACTION_DIVIDER_SYMBOL = '➤';

describe.only('Test Item', () => {
  let Item;

  beforeEach(() => {
    Item = proxyquire.noCallThru().load('../src/Item.ts', {}).default;
  });

  afterEach(() => {});

  it('check `title` prop', function() {
    const item = new Item({
      title: 'this is a title'
    });

    assert.propertyVal(item.getAlfredItemData(), 'title', 'this is a title');
  });

  it('default value of `subtitle` prop is empty string', function() {
    const item = new Item({
      title: 'this is a title'
    });

    assert.propertyVal(item.getAlfredItemData(), 'subtitle', '');
  });

  it('default value of `valid` prop is true', function() {
    let item = new Item({
      title: 'this is a title'
    });

    assert.propertyVal(item.getAlfredItemData(), 'valid', true);

    item = new Item({
      title: 'this is a title',
      valid: false
    });

    assert.propertyVal(item.getAlfredItemData(), 'valid', false);
  });

  it('`valid` prop should be false if `hasSubItems` is true', function() {
    let item = new Item({
      title: 'this is a title',
      hasSubItems: true
    });

    assert.propertyVal(item.getAlfredItemData(), 'valid', false);
    assert.propertyVal(item.getAlfredItemData(), 'hasSubItems', true);
  });

  describe('#arg', () => {
    it('`arg` prop should be string type if passing an object', function() {
      const item = new Item({
        title: 'this is a title',
        arg: {
          a: 1,
          b: 2
        }
      });

      assert.propertyVal(
        item.getAlfredItemData(),
        'arg',
        JSON.stringify({
          a: 1,
          b: 2
        })
      );
    });

    it('`arg` prop should be string type if passing a string', function() {
      const item = new Item({
        title: 'this is a title',
        arg: 'this is a arg'
      });

      assert.propertyVal(item.getAlfredItemData(), 'arg', 'this is a arg');
    });

    it('`arg` prop in `mods` prop should be string type if passing an object', function() {
      const item = new Item({
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

      assert.propertyVal(
        item.getAlfredItemData().mods.alt,
        'arg',
        JSON.stringify({
          a: 1,
          b: 2
        })
      );
    });

    it('`arg` prop in `mods` prop should be string type if passing a string', function() {
      const item = new Item({
        title: 'this is a title',
        mods: {
          alt: {
            valid: true,
            arg: '{ a: 1, b: 2 }',
            subtitle: 'https://www.alfredapp.com/powerpack/'
          }
        }
      });

      assert.propertyVal(
        item.getAlfredItemData().mods.alt,
        'arg',
        '{ a: 1, b: 2 }'
      );
    });
  });

  it('`icon` prop should be object type if passing a string type', function() {
    const item = new Item({
      title: 'this is a title',
      icon: 'test.png'
    });

    assert.deepEqual(item.getAlfredItemData().icon, {
      path: 'test.png'
    });
  });

  it('autocomplete prop should include previous title if has sub items', function() {
    const item = new Item({
      title: 'this is a title',
      hasSubItems: true
    });

    assert.propertyVal(
      item.getAlfredItemData(),
      'autocomplete',
      `this is a title ${SUB_ACTION_DIVIDER_SYMBOL} `
    );
  });
});
