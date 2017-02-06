# Setting variables

* Set variables via script output

```js
AlfredNode.utils.generateVars({arg: 'xyz', variables: {key: value}};

// output
'{"alfredworkflow": {"arg": "xyz", "variables": {"key": "value"}}}'
```

* Set variables via wf feedback item

```js
const AlfredNode = require('alfred-workflow-nodejs');
const Item = AlfredNode.Item;
const item = new Item({
    title: "item 1", 
    arg: {
        arg: 'xyz', variables: {key: value}
    }
});
workflow.addItem(item);
workflow.feedback();

// output:
{"items": [
    {
     "title": "item 1",
     "arg": "{\"alfredworkflow\": {\"arg\": \"xyz\", \"variables\": {\"key\": \"value\"}}}"
     }
]}
```