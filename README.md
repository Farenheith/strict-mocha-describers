# strict-mocha-describers

The implementation of describers strongly oriented for the methods that will be tested

## How it works

When these describers are used to write your test, all other methods from the class other than the method that will be tested are overwritten by a default error with the message _not mocked yet_. The idea is to enforce that all these calls must be mocked and to make the test always break when some refactoring is made or a new method is called.

it is intended to be used with *mocha chai sinon* triad.

## Available describers

### method
A describer to create the tests of a single method of a instance;

### method.only

Same as **method**, but will make only the current test to be ran

### method.skip

Same as **method**, but will make the current test to be skipped.

### method.static

A describer to create the tests of a single static method.

### method.static.only

Same as **method.static**, but will make only the current test to be ran.

### method.static.skip

Same as **method.static**, but will make the current test to be skipped.

## Available assertions

### expectCall

Will validate the exactly interaction with the mocked method, which is:
* How many times has been called;
* Which parameters have been passed to it;
* In what order the calls happened.
