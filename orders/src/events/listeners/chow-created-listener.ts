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
   queueGroupName = QueueGroup.Orders;

   // TODO:
   // Change this flow. This listener should just receive the chow's ID and append that to our Order.
   // This will then get populated correctly inside of our Customers service.
   async onMessage(data: ChowCreatedEvent["data"], msg: Message) {
      const {
         id,
         brand,
         target_group,
         flavour,
         size,
         unit,
         quantity,
         wholesale_price,
         retail_price,
         is_paid_for,
      } = data;

      console.log("chow data from orders service", data);

      const chow = Chow.build({
         id: id,
         brand,
         target_group,
         flavour,
         size,
         unit,
         quantity,
         wholesale_price,
         retail_price,
         is_paid_for,
      });

      await chow.save();

      msg.ack();
   }
}
