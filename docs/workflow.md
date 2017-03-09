## Workflow skeleton

Workflow command has 2 parameters: `action_name` and `query`:

```shell
# should use full path of `node`. I don't know how to use `node` in global yet
/usr/local/bin/node main.js "action_name" "query"
```

**main.js**
```js
const { Workflow, Item } = require('alfred-workflow-nodejs-next');

(function main() {
    const workflow = new Workflow();
    workflow.setName('example-alfred-workflow-using-nodejs');

    actionHandler.onAction('action_name_1', (query) => {
        // your code to handle action 1 here
    });

    actionHandler.onAction('action_name_2', (query) => {
        // your code to handle action 2 here
    });

    actionHandler.onSubActionSelected('action_name_2', (query, previousSelectedTitle, previousSelectedArg) => {
        // your code to handle selected sub action item of action_name_2 here
    });

    AlfredNode.start();
})();
```

## A Workflow example scenario:

- Open Alfred and type main action name `testworkflow`
=> There are 2 top level feedbacks are generated: `Feedback A` and `Feeback B`
=> Use arrow key to navigate to `Feedback B` and press `TAB` or `ENTER`
=> Alfred search bar will now become `Feedback B ➤ `
=> and display sub action items of `Feedback B`: `Item 1 of Feedback B` and `Item 2 of Feedback B`
=> Execute a sub item by using `TAB` or `ENTER` key when select a sub action item

### Register listener for action name `testworkflow`

- The action name `testworkflow` will generate 2 top level items: `Feedback A` and `Feeback B`
- Top level action usually has arg data so that sub action can know what data of parent action passes to.
- So it is not necessary if sub action has arg data 
  
```js
workflow.onAction('testworkflow', function(query) {
    // generate feeback A
    const itemA = new Item({
        title: 'Feedback A',
        subtitle: 'Press tab to get menu items',
        arg: { alias: 'X' }, // we can set data to top level item to use later to build sub items
        hasSubItems: true // set this to true to tell that this feedback has sub Items
    });
    workflow.addItem(itemA);

    // generate feeback B
    const itemB = new Item({
        title: 'Feedback B',
        subtitle: 'Press tab to get menu items',
        arg: { alias: 'Y' }, // we can set data to top level item to use later to build sub items
        hasSubItems: true // set this to true to tell that this feedback has sub Items
    });
    workflow.addItem(itemB);

    // generate feedback
    workflow.feedback();
});
```

### Register listener for sub item

```js
/**
* query: query is a string when user type after '➤' symbol, ex: 'Feedback A ➤ queryabc'
* selectedItemTitle: title of selected top level item
* selectedItemArg: arg of selected top level item
**/
workflow.onSubActionSelected('testworkflow', (query, previousSelectedTitle, previousSelectedArg) => { 
    // ...
})
```

```js
workflow.onSubActionSelected('testworkflow', (query, previousSelectedTitle, previousSelectedArg) => {
    const item1 = new Item({
        title: 'Item 1 of ' + title,
        subtitle: previousSelectedArg.alias,
        valid: true,
        hasSubItems: false
    });

    const item2 = new Item({
        title: 'Item 2 of ' + title,
        subtitle: previousSelectedArg.alias,
        valid: true,
        hasSubItems: false
    });

    workflow.addItem(item1);
    workflow.addItem(item2);

    // generate feedback
    workflow.feedback();
});
```

## Workflow and Item - Generate feedback

- Workflow is used to build and generate feedback
- Item is a class that represent data of a row of feedback in Alfred. `Item.getData` method will return an object containing follow props which is documented officially in Alfred site here: (https://www.alfredapp.com/help/workflows/inputs/script-filter/json/)[https://www.alfredapp.com/help/workflows/inputs/script-filter/json/]:
* uid
* title
* subtitle
* arg (support variables in arg, alfred 3)
* icon
* valid: default is true
* autocomplete
* type
* quicklookurl
* text
* mods
* hasSubItems: is a custom option of this `alfred-workflow-nodejs-next`. If `hasSubItems` is true, `valid` option is false.  

```js
const item1 = new Item({
    title: 'item 1',
    subtitle: 'sub 1'
});

const item2 = new Item({
    uid: 'uid',
    title: 'item 1',
    subtitle: 'sub 1',
    valid: true,
    icon: 'icon.png',
    arg: {
        a1: 'value1',
        a2: 'value2'
    }
});

const item3 = new Item({
    title: 'item 3',
    subtitle: 'sub 3',
    mods: {
        cmd: {
            valid: true,
            arg: 'cmd arg',
            subtitle: 'pressing cmd'
        },
        alt: {
            valid: false,
            arg: 'alt arg',
            subtitle: 'pressing alt'
        }
    }
});
workflow.addItem(item1);
workflow.addItem(item2);
workflow.addItem(item3);

// ...

// generate feedback
workflow.feedback();
```


## Generate info/warning/error message

```js
workflow.info('title', 'subtitle');
workflow.warning('title', 'subtitle');
workflow.error('title', 'subtitle');
// DO NOT work now: workflow.showLoading();
```