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
