class Executor {
    constructor(options) {
        this.key = options.key;
        this.name = options.name;
        this.executor = options.executor;
    }

    execute(arg) {
        arg = (typeof arg === 'string') ? JSON.parse(arg) : arg;

        if ((this.name !== undefined && this.name === arg.actionName) ||
            (this.key !== undefined && this.key === arg.actionKey)) {
            this.executor(arg);
        }
    };
}

module.exports = Executor;
