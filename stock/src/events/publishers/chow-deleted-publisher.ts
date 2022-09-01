import {
   ChowDeletedEvent,
   Publisher,
   SubjectsEnum,
} from "@cream-paws-util/common";

export class ChowDeletedPublisher extends Publisher<ChowDeletedEvent> {
   subject: SubjectsEnum.ChowDeleted = SubjectsEnum.ChowDeleted;
}
