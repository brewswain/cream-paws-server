import {
   Listener,
   OrderDeletedEvent,
   QueueGroup,
   SubjectsEnum,
} from "@cream-paws-util/common";
import { Message } from "node-nats-streaming";
import { Customer } from "../../models/customer";
import { Order } from "../../models/order";

export class OrderDeletedListener extends Listener<OrderDeletedEvent> {
   subject: SubjectsEnum.OrderDeleted = SubjectsEnum.OrderDeleted;
   queueGroupName = QueueGroup.Customers;

   async onMessage(data: OrderDeletedEvent["data"], msg: Message) {
      const customer = await Customer.findById(data.customerId);
      const order = await Order.findById(data.id);

      if (!customer) {
         throw new Error(
            "Customer could not be found. Please check Order Deleted Event's customerId being sent."
         );
      }

      if (!customer.orders) {
         throw new Error(
            "Customer has no Orders attached, so we can't delete anything."
         );
      }

      if (!order) {
         throw new Error(
            "Order could not be found. Please check Order Deleted Event's Id being sent."
         );
      }

      await order.deleteOne({ id: data.id });

      let foundOrderIndex = customer.orders?.findIndex(
         (customerOrder) => customerOrder.id === data.id
      );
      if (!foundOrderIndex) {
         throw new Error(
            "Order's Index not found, but exists in db. Please check customer."
         );
      }

      await customer.orders[foundOrderIndex].deleteOne({ id: data.id });

      await customer.save;

      msg.ack();
   }
}
