"use strict";
module.exports = async () => {
    // Force Jest to exit after all tests
    await new Promise(resolve => setTimeout(resolve, 1000));
    process.exit(0);
};
//# sourceMappingURL=teardown.js.map