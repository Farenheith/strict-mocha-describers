"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mocha_1 = require("mocha");
class ItHelper {
    constructor(targetWrapper) {
        this.targetWrapper = targetWrapper;
    }
    createSuiteCase(testFunction) {
        return (description, fn) => {
            return testFunction(description, () => {
                return fn(this.targetWrapper.target);
            });
        };
    }
    createIt() {
        const result = this.createSuiteCase(mocha_1.it);
        result.only = this.createSuiteCase(mocha_1.it.only);
        result.skip = this.createSuiteCase(mocha_1.it.skip);
        return result;
    }
}
exports.ItHelper = ItHelper;
//# sourceMappingURL=strict-it.js.map