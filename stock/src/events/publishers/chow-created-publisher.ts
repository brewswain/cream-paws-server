import {
   ChowCreatedEvent,
   Publisher,
   SubjectsEnum,
} from "@cream-paws-util/common";

export class ChowCreatedPublisher extends Publisher<ChowCreatedEvent> {
   subject: SubjectsEnum.ChowCreated = SubjectsEnum.ChowCreated;
}
