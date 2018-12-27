PDDL Compiler… ish
==================
JavaScript parser for some of [PDDL](https://en.wikipedia.org/wiki/Planning_Domain_Definition_Language). Possibly more exciting stuff coming soon.

Basically, this program takes PDDL files in, and returns a representation of the program as a bunch of JavaScript objects (see src/pddl.js).

For example, something like
```lisp
(define (domain repair-robot)
  (:predicates (is-broken ?x))
  (:action repair
    :parameters   (?thing1 ?thing2)
    :precondition (and (is-broken ?thing-1)
                       (is-broken ?thing-2))
    :effect       (and (not (is-broken ?thing1)
                            (is-broken ?thing2)))))

(define (problem repair-four-things)
  (:domain  repair-robot)
  (:objects toy vacuum-cleaner sink sculpture)
  (:init    (is-broken toy) (is-broken vacuum-cleaner)
            (is-broken sink) (is-broken sculpture))
  (:goal    (and (not (is-broken toy)
                      (is-broken vacuum-cleaner)
                      (is-broken sink)
                      (is-broken sculpture)))))

```
might parse to
```javascript
[ Domain {
    name: 'repair-robot',
    predicates:
     [ Predicate { name: 'is-broken', variables: [ Variable { name: 'x' } ] } ],
    actions:
     [ Action {
         name: 'repair',
         parameters: [ Variable { name: 'thing1' }, Variable { name: 'thing2' } ],
         precondition:
          And {
            predicates:
             [ Predicate {
                 name: 'is-broken',
                 variables: [ Variable { name: 'thing-1' } ] },
               Predicate {
                 name: 'is-broken',
                 variables: [ Variable { name: 'thing-2' } ] } ] },
         effect:
          And {
            predicates:
             [ Not {
                 predicates:
                  [ Predicate {
                      name: 'is-broken',
                      variables: [ Variable { name: 'thing1' } ] },
                    Predicate {
                      name: 'is-broken',
                      variables: [ Variable { name: 'thing2' } ] } ] } ] } } ] },
  Problem {
    name: 'repair-four-things',
    domainName: 'repair-robot',
    objects:
     [ Obj3ct { name: 'toy' },
       Obj3ct { name: 'vacuum-cleaner' },
       Obj3ct { name: 'sink' },
       Obj3ct { name: 'sculpture' } ],
    init:
     [ Predicate { name: 'is-broken', variables: [ 'toy' ] },
       Predicate { name: 'is-broken', variables: [ 'vacuum-cleaner' ] },
       Predicate { name: 'is-broken', variables: [ 'sink' ] },
       Predicate { name: 'is-broken', variables: [ 'sculpture' ] } ],
    goal:
     And {
       predicates:
        [ Not {
            predicates:
             [ Predicate { name: 'is-broken', variables: [ 'toy' ] },
               Predicate { name: 'is-broken', variables: [ 'vacuum-cleaner' ] },
               Predicate { name: 'is-broken', variables: [ 'sink' ] },
               Predicate { name: 'is-broken', variables: [ 'sculpture' ] } ] } ] } } ]
```

Requirements
------------
 * [Node.js](https://nodejs.org/en/) to run everything
 * [Parsimmon](https://github.com/jneen/parsimmon) for parsing
 * [Mocha](https://mochajs.org/) for unit tests

Getting started
---------------
 1. `npm install`
 2. `node index.js YOURFILE.pddl`

References
----------
 * [PDDL – The Planning Domain Denition Language (Version 1.2)](https://courses.cs.washington.edu/courses/cse473/06sp/pddl.pdf)
 * [Complete BNF description of PDDL 3.1](http://pddl4j.imag.fr/repository/wiki/BNF-PDDL-3.1.pdf)
 * [An Introduction to PDDL](http://www.cs.toronto.edu/~sheila/2542/w09/A1/introtopddl2.pdf)
 * [Revised NISP Manual](http://www.cs.yale.edu/homes/dvm/papers/nispman.pdf)
