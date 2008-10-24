/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU: Common & General Use Javascript
 *  (c) 2008 Jonathan Lonowski
 *
 *~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU-Stand :: Query
 *    Read HTTP GET Variables
 *~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
**/

var Query = new (function () {
  this.Version = '8.1024';

/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU-Stand :: Query :: Core
**/
  this.read = function (key) {
    key = String(key);
    var queries = Type.clone(location.search).replace(/^\?/, '').split(/\&/);
    var matches = [];
    for (var i = 0; i < queries.length; i += 1)
      if (Type.is_a(queries[i], String) && queries[i].match(/[^\=]+\=?/))
        if (key === decodeURIComponent(queries[i].split('=')[0]))
          matches.push(decodeURIComponent(queries[i].split('=')[1] || ''));
    return Type.clone(matches);
  };


/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU-Stand :: Query :: Includes
**/
  var Type=new(function(){this.Version='8.1024';var UND='undefined',NUL='null',ARR='array',BLN='boolean',DTE='date',FNC='function',NUM='number',OBJ='object',RGX='regexp',STR='string',UNK='unknown';this.types=function(){return this.clone([UND,NUL,ARR,BLN,DTE,FNC,NUM,OBJ,RGX,STR,UNK]);};this.get=function(object){switch(typeof object){case'undefined':return UND;case'boolean':return BLN;case'number':return NUM;case'string':return STR;case'function':if(object.constructor===RegExp)return RGX;return FNC;case'object':if(object===null)return NUL;if(object.constructor===Array)return ARR;if(object.constructor===Boolean)return BLN;if(object.constructor===Date)return DTE;if(object.constructor===Number)return NUM;if(object.constructor===RegExp)return RGX;if(object.constructor===String)return STR;return OBJ;default:return UNK;}};this.clone=function(object){switch(this.get(object)){case NUL:return null;case ARR:case BLN:case FNC:case NUM:case OBJ:case RGX:case STR:return object.valueOf();case DTE:return new Date(object.valueOf());default:return undefined}};this.is_a=function(object,compare){switch(this.get(compare)){case UND:return this.get(object)===UND;case NUL:return this.get(object)===NUL;case STR:return this.get(object)===compare;case FNC:switch(compare){case Boolean:return this.get(object)===BLN;case Number:return this.get(object)===NUM;case String:return this.get(object)===STR;default:return object instanceof compare;}default:return undefined;}};this.isof=function(){var args=[],argc=arguments.length,argi;for(argi=0;argi<argc;argi+=1)args[argi]=arguments[argi];var object=args.shift();for(argi=0;argi<args.length;argi+=1)if(this.is_a(object,args[argi]))return true;return false;};this.limit=function(){var args=[],argc=arguments.length,argi;for(argi=0;argi<argc;argi+=1)args[argi]=arguments[argi];return this.isof.apply(this,args)?this.clone(args[0]):undefined;};})();

})();
