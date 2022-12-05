import {
   ChowCreatedEvent,
   Listener,
   QueueGroup,
   SubjectsEnum,
} from "@cream-paws-util/common";
import { Message } from "node-nats-streaming";
import { Chow } from "../../models/chow";

export class ChowCreatedListener extends Listener<ChowCreatedEvent> {
   subject: SubjectsEnum.ChowCreated = SubjectsEnum.ChowCreated;
   queueGroupName = QueueGroup.Customers;

   async onMessage(data: ChowCreatedEvent["data"], msg: Message) {
      const {
         id,
         brand,
         target_group,
         flavour,
         size,
         unit,
         wholesale_price,
         retail_price,
         is_paid_for,
      } = data;

      const chow = Chow.build({
         id: data.id,
         brand,
         target_group,
         flavour,
         size,
         unit,
         wholesale_price,
         retail_price,
         is_paid_for,
      });

      await chow.save();

      msg.ack();
   }
}
