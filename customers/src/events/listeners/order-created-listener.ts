import {
   Listener,
   OrderCreatedEvent,
   QueueGroup,
   SubjectsEnum,
} from "@cream-paws-util/common";
import { Message } from "node-nats-streaming";
import { Customer } from "../../models/customer";
import { OrderDoc } from "../../models/order";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
   subject: SubjectsEnum.OrderCreated = SubjectsEnum.OrderCreated;
   queueGroupName = QueueGroup.Customers;

   async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
      const customer = await Customer.findById(data.customer_id);

      if (!customer) {
         throw new Error("Customer not found, check ID or version number");
      }

      customer.orders?.push(data as OrderDoc);

      customer.save();

      msg.ack();
   }
}
