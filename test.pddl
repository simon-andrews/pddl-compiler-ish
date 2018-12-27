(define (domain gripper)
  (:predicates (room ?r) (ball ?b) (gripper ?g)
               (at-robby ?r) (at ?b ?r)
               (free ?g) (carry ?o ?g))
  (:action move
     :parameters (?from ?to)
     :precondition (and (room ?from)
                        (room ?to)
                        (at-robby ?from))
     :effect (and (at-robby ?to)
                  (not (at-robby ?from)))))

(define (problem gripper-four-balls)
  (:domain gripper)
  (:objects room-a room-b
            ball-1 ball-2 ball-3 ball-4
            left right)
  (:init    (room room-a) (room room-b)
            (ball ball-1) (ball ball-2) (ball ball-3) (ball ball-4)
            (gripper left) (gripper right) (free left) (free-right)
            (at-robby room-a)
            (at-ball ball-1 room-a) (at-ball ball-2 room-a)
            (at-ball ball-3 room-a) (at-ball ball-4 room-a))
  (:goal    (and (at-ball ball-1 room-b)
                 (at-ball ball-2 room-b)
                 (at-ball ball-3 room-b)
                 (at-ball ball-4 room-b))))
