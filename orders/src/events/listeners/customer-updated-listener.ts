import {
   CustomerUpdatedEvent,
   Listener,
   QueueGroup,
   SubjectsEnum,
} from "@cream-paws-util/common";
import { Message } from "node-nats-streaming";
import { Customer } from "../../models/customer";

export class CustomerUpdatedListener extends Listener<CustomerUpdatedEvent> {
   subject: SubjectsEnum.CustomerUpdated = SubjectsEnum.CustomerUpdated;
   queueGroupName = QueueGroup.Orders;

   async onMessage(data: CustomerUpdatedEvent["data"], msg: Message) {
      const { name, pets } = data;
      const customer = await Customer.findByEventVersion(data);

      if (!customer) {
         throw new Error("Customer not found");
      }

      customer.set({ name, pets });

      await customer.save();

      msg.ack;
   }
}
