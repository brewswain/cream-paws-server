import {
   OrderUpdatedEvent,
   Publisher,
   SubjectsEnum,
} from "@cream-paws-util/common";

export class OrderUpdatedPublisher extends Publisher<OrderUpdatedEvent> {
   subject: SubjectsEnum.OrderUpdated = SubjectsEnum.OrderUpdated;
}
