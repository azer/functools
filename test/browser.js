var module = {},
    assert = {
      'equal': function(a, b){
        if( a !== b ){
          throw new Error('Assertion Error: '+ a +' != ' + b);
        }
      },
      'ok': function(value){
        assert.equal(value, true);
      }
    };

function run(){
  lowkick.signal('begin');

  var tests = Object.keys(module.exports);

  (function iter(i){

    if(i >= tests.length){
      lowkick.signal('end');
      lowkick.ok();
      return;
    }

    var name = tests[i];

    lowkick.message('Running "'+name+'"');

    module.exports[name](iter.bind(undefined, i+1));

  }(0));

}

$(document).ready(run);
