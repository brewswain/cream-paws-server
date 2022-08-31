import {
   OrderDeletedEvent,
   Publisher,
   SubjectsEnum,
} from "@cream-paws-util/common";

export class OrderDeletedPublisher extends Publisher<OrderDeletedEvent> {
   subject: SubjectsEnum.OrderDeleted = SubjectsEnum.OrderDeleted;
}
