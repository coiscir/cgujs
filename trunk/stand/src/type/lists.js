/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU-Stand :: Type :: Lists
**/
  this.isof = function () {
    var args = [], argc = arguments.length, argi;
    for (argi = 0; argi < argc; argi += 1)
      args[argi] = arguments[argi];
      
    var obj = args.shift(), type = this.get(obj);
    for (argi = 0; argi < args.length; argi += 1)
      if (args[argi] === type)
        return true;
    return false;
  };
  
  this.limit = function () {
    var args = [], argc = arguments.length, argi;
    for (argi = 0; argi < argc; argi += 1)
      args[argi] = arguments[argi];
    return this.isof.apply(this, args) ? this.clone(args[0]) : undefined;
  };

