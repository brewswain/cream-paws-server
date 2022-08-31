import {
   OrderCreatedEvent,
   Publisher,
   SubjectsEnum,
} from "@cream-paws-util/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
   subject: SubjectsEnum.OrderCreated = SubjectsEnum.OrderCreated;
}
