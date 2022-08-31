import {
   CustomerCreatedEvent,
   Listener,
   QueueGroup,
   SubjectsEnum,
} from "@cream-paws-util/common";
import { Message } from "node-nats-streaming";
import { Customer } from "../../models/customer";

export class CustomerCreatedListener extends Listener<CustomerCreatedEvent> {
   subject: SubjectsEnum.CustomerCreated = SubjectsEnum.CustomerCreated;
   queueGroupName = QueueGroup.Orders;

   async onMessage(data: CustomerCreatedEvent["data"], msg: Message) {
      const { id, name, pets } = data;

      const customer = Customer.build({
         id,
         name,
         pets,
      });

      await customer.save();

      msg.ack();
   }
}
