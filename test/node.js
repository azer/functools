var tests = require('./tests'),
    puts = require('sys').puts,
    startTS = (new Date).getTime();

for(var name in tests){
  if(name.substring(0,5)=='test_'){
    tests[name]();
    console.log('Ran "'+name+'"');
  }
}

puts('OK - '+( (new Date).getTime() - startTS )/1000+'s');
