// prettier-ignore
const catchAsync = (fn) => {
  const returnedFn = (req, res, next) => {
    fn(req, res, next).catch(next);
  };
  return returnedFn;
};

export default catchAsync;

// this utility aims to catch errors without having to nest code into a try/catch block
// it works like this:
//  - it takes as a parameter the function('fn') that you want to catch for possible errors
//  - because 'fn' shouldn't just be executed right away when catchAsync is called, catchAsync needs to return a function that then calls 'fn', so that when wrapping a function with catchAsync, it is as if we were declaring a function right there, but now there's no need to implement a try/catch block
