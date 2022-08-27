import {
   CustomerDeletedEvent,
   Publisher,
   SubjectsEnum,
} from "@cream-paws-util/common";

export class CustomerDeletedPublisher extends Publisher<CustomerDeletedEvent> {
   subject: SubjectsEnum.CustomerDeleted = SubjectsEnum.CustomerDeleted;
}
