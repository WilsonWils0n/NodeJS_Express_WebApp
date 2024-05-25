// wrapper that catches an error and sends it to the error 500 middleware
// if no error was raised, will call next() so that the loggerEnd middleware gets called
function errorWrapper(wrapMe) {
    return async (req, res, next) => {
      try {
        await wrapMe(req, res, next);
        next(); // to logger end
      } catch (error) {
        next(error); // to error handle
      }
    };
  }
  
  export { errorWrapper };
  