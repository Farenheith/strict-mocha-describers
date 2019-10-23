# strict-mocha-describers

**WORK IN PROGRESS

The implementation of describers strongly oriented for the methods that will be tested

## how it works

When these describers are used to write your test, all other methods from the class other thant the method that will be tested are overwritten by a default error _not mocket yet_. The idea is to enforce that all these calls must be mocked and to make the test always break when some refactoring is made or a new method is called
