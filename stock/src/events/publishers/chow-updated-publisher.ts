import {
   ChowUpdatedEvent,
   Publisher,
   SubjectsEnum,
} from "@cream-paws-util/common";

export class ChowUpdatedPublisher extends Publisher<ChowUpdatedEvent> {
   subject: SubjectsEnum.ChowUpdated = SubjectsEnum.ChowUpdated;
}
