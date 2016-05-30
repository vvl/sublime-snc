//jsnc_eval_print('1: running as ' + gs.getUser().getName());

var jsnc = new JasmineSNC(this);
var jasmine = jsnc.jasmine;

describe("Rhino 1.5R4 quirks", function() {
  it("the jasmine.isSpy() method would not crash the js runtime", function() {
    /*
    in Rhino 1.5R4 the code 'undefined instanceof Object' crashes the runtime
    add the following code to isSpy():
    
    if (j$.util.isUndefined(putativeSpy.and) || j$.util.isUndefined(putativeSpy.calls)) {
      return false;
    }
    
    */
    var obj = {};
    expect(jasmine.isSpy(obj)).toBe(false);
  });
  
  it("an empty Array object evaluates to true", function() {
    /*
    In Rhino 1.5R4 the code below wrongly evaluates to true.
    
    var arr = [];
    var result = (!arr);
    
    
    Replace the following code in processNode():
    
      if (!node.children) {
    
    replace with
    
      if (!(typeof node.children === 'object')) {
    
    */
    var arr = [];
    var result = (!arr);
    
    expect(result).toBe(false);
  });
});

jsnc.run();