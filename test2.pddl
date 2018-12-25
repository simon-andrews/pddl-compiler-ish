(define (domain gripper)
  (:predicates (room ?b))
  (:action move
      :parameters   (?x ?y)
      :precondition (and (ROOM ?x) (ROOM ?y) (at-robby ?x))
      :effect       (and (at-robby ?y) (not (at-robby ?x)))))
