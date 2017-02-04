# Workflow skeleton

Workflow command has 2 parameters: `action` and `query`:
```shell
/usr/local/bin/node main.js "action" "query"
```

**main.js**
```js
const AlfredNode = require('alfred-workflow-nodejs');
const { actionHandler, Workflow, Item } = AlfredNode;

(function main() {
    const workflow = new Workflow();
    // set name for workflow (you SHOULD set name for your wf)
    workflow.setName('example-alfred-workflow-using-nodejs');
    
    actionHandler.onAction('action1', (query) => {
        // your code to handle action 1 here
    });

    actionHandler.onAction('action2', (query) => {
        // your code to handle action 2 here
    });

    actionHandler.onMenuItemSelected('action2', (query, selectedTitle, selectedData) => {
        // your code to handle selected menu item of action 2 here
    });

    AlfredNode.run();
})();
```


# Workflow and Item - Generate feedbacks

Workflow is used to build and generate feedbacks

Item is class that prepresent data of a feedback:
* uid
* title
* subtitle
* arg (support variables in arg, alfred 3)
* icon
* valid(true/false, default is false)
* autocomplete
* type
* quicklookurl
* text
* mods

```js
const Item = AlfredNode.Item;
const item1 = new Item({
    title: "item 1",
    subtitle: "sub 1"
});

const item2 = new Item({
    uid: "uid",
    title: "item 1",
    subtitle: "sub 1",
    valid: true,
    icon: "icon.png",
    arg: "arg",
    autocomplete: "autocomplete"
});

const item3 = new Item({
    title: "item 3",
    subtitle: "sub 3",
    mods: {
        cmd: {
            valid: true,
            arg: "cmd arg",
            subtitle: "pressing cmd"
        },
        alt: {
            valid: false,
            arg: "alt arg",
            subtitle: "pressing alt"
        }
    }
});
workflow.addItem(item1);
workflow.addItem(item2);

// ...

// generate feedbacks
workflow.feedback();
```


* Generate info/warning/error message
```js
workflow.info("title", "subtitle");
workflow.warning("title", "subtitle");
workflow.error("title", "subtitle");
```
