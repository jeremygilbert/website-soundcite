
Array.prototype.flatten = function flatten(){
// from: http://tech.karbassi.com/2009/12/17/pure-javascript-flatten-array/
    var flat = [];
    for (var i = 0, l = this.length; i < l; i++){
        var type = Object.prototype.toString.call(this[i]).split(' ').pop().split(']').shift().toLowerCase();
        if (type) { flat = flat.concat(/^(array|collection|arguments|object)$/.test(type) ? flatten.call(this[i]) : this[i]); }
    }
    return flat;
};

if (typeof String.prototype.startsWith != 'function') {
    // from: http://stackoverflow.com/questions/646628/javascript-startswith
    String.prototype.startsWith = function (str){
        return this.slice(0, str.length) == str;
    };
} 

if (typeof String.prototype.endsWith != 'function') {
    // from: http://stackoverflow.com/questions/646628/javascript-startswith
    String.prototype.endsWith = function (str){
        return this.slice(-str.length) == str;
    };
}

var QueryProducer = function(terms) {
    this.conjunctor = 'AND';
    this.disjunctor = 'OR';

    this._conjunct = function() {
        return ' ' + this.conjunctor + ' ';
    }

    this._disjunct = function() {
        return ' ' + this.disjunctor + ' ';
    }

    this._quote = function(term) {
        if (term.indexOf(' ') < 0) {
            return term; 
        } else {
            if ( term.startsWith('"') && term.endsWith('"')
                || term.startsWith("'") && term.endsWith("'") ) {
                    return term;
            } else {
                return '"' + term + '"';
            }
        }
    }

    this._quoteTerms = function(terms) {
        var r = new Array();
        for (var i=0; i<terms.length; i++) {
            if (typeof terms[i] == 'string') {
                r.push(this._quote(terms[i])); 
            } else {
                var rr = new Array();
                for (var j=0; j<terms[i].length; j++) {
                    rr.push(this._quote(terms[i][j]));
                }
                r.push(rr);
            }
        }
        return r;
    }
    this.terms = this._quoteTerms(terms);

    this._binaryPermutation = function(terms) {
         if (terms === undefined) {
             terms = this.terms;
         }
         var r = new Array();
         for (var i=0; i<terms.length - 1; i++) {
             for (var j=i+1; j<terms.length; j++) {
                 r.push([terms[i], terms[j]]);
             }
         }
         return r;
    };

    this.fullConjunct = function(terms) {
    // Flattens term groups and returns AND formation of all terms
        if (terms === undefined) {
             terms = this.terms;
        }
        return terms.flatten().join(' ' + this.conjunctor + ' ');
    };

    this.fullDisjunct = function(terms) {
    // Flattens term groups and returns OR formation of all terms
        if (terms === undefined) {
             terms = this.terms;
        }
        return terms.flatten().join(' ' + this.disjunctor + ' ');
    };

    this.disjunctOfConjuncts = function(terms) {
    // Returns the OR formation of the ANDed term groups
        if (terms === undefined) {
            terms = this.terms;
        }
        if (typeof terms[0] == 'string') {
            return terms.join(this._disjunct());
        }
        q = [];
        for (var i=0; i<terms.length; i++) {
            q.push('(' + terms[i].join(this._conjunct()) + ')');
        } 
        return q.join(this._disjunct());
    }

    this.conjunctOfDisjuncts = function(terms) {
    // Returns the AND formation of the ORed term groups
        if (terms === undefined) {
            terms = this.terms;
        }
        if (typeof terms[0] == 'string') {
            return terms.join(this._conjunct());
        }
        q = [];
        for (var i=0; i<terms.length; i++) {
            q.push('(' + terms[i].join(this._disjunct()) + ')');
        } 
        return q.join(this._conjunct());
    };

    this.permutedDisjunctOfConjuncts = function(terms) {
    // All binary AND formations disjuncted. Only operates on a flat list
        if (terms === undefined) {
            terms = this.terms;
        }
        if (typeof this.terms[0] == 'string') {
            var groups = this._binaryPermutation(this.terms);
            return this.disjunctOfConjuncts(groups);      
        }
    };
}
