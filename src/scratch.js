const f = function (a,b,c) {return c*(a+b)}
f.prototype.c2 = function(a,b){ return f(a,b,2)}

console.log(f)
