# strict-mocha-describers

This project implements over mocha strictly describers for creation of suite tests of classes.

## How it works

When these describers are used to write your test, all other methods from the class other than the method that will be tested are overwritten by a default error with the message _not mocked yet_. The idea is to enforce that all these calls must be mocked and to make the test always break when some refactoring is made or a new method is called.

## How to use it

The sintax is almost the same as you would use with mocha, but we have a special describe method for classes called *describeClass* which will be the start for any suite case created with this package. Look the following example

```
import { describeClass } from 'strict-mocha-descriers';

function bootStrap() {
    return new HelloWorldService();
}

describeClass(HelloWorldService, bootstrap, describeMethod => {
    describeMethod('helloWorld', it => {
        it('should print hello world', target => {
            sinon.stub(console, 'log');

            const result = target.helloWorld();

            expect(console.log).to.have.been.calledOnceWithExactly('hello world');
            expect(result).to.be.undefined;
        });
    });
});
```

First, rather than inform a description of the test to *describeClass*, we passed the class that we want to test. Also, as a second parameter, we passed a function that will be used to instantiate the target instance for each test. Finally, the callback to write each method suite case. Look that this callback receives a function as a parameter: *describeMethod*.

Now, look that *describeMethod* is called to create a suite case to wrap all case tests of one method. It receives the name of said method and it callback receives a parameter called *target*, which will be the instance of *HelloWorldService*, ready to be tested only for the helloWorld method.

If hello world method calls any other method of HelloWorldService, it must be mocked, otherwise an error will occur
