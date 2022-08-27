import {
   Publisher,
   CustomerCreatedEvent,
   SubjectsEnum,
} from "@cream-paws-util/common";

export class CustomerCreatedPublisher extends Publisher<CustomerCreatedEvent> {
   subject: SubjectsEnum.CustomerCreated = SubjectsEnum.CustomerCreated;
}
