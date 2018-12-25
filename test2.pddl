(define (domain gripper)
  (:predicates (room ?b))
  (:action move
      :parameters (?x ?y)
      :vars (?q ?v)))

(define (domain other-gripper)
  (:predicates (bleep ?bloop)))
