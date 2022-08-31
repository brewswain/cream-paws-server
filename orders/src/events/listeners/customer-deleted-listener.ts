import {
   CustomerDeletedEvent,
   Listener,
   QueueGroup,
   SubjectsEnum,
} from "@cream-paws-util/common";
import { Message } from "node-nats-streaming";
import { Customer } from "../../models/customer";

export class CustomerDeletedListener extends Listener<CustomerDeletedEvent> {
   subject: SubjectsEnum.CustomerDeleted = SubjectsEnum.CustomerDeleted;
   queueGroupName = QueueGroup.Orders;

   async onMessage(data: CustomerDeletedEvent["data"], msg: Message) {
      const { id } = data;
      const customer = await Customer.findById(id);

      if (!customer) {
         throw new Error("Customer does not exist");
      }

      await customer.deleteOne({ id });

      msg.ack();
   }
}
