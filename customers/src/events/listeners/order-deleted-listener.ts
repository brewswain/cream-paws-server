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
      const order = await Order.findOne({ id: data.id });
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

      // This is left in to make sure the order exists
      let foundOrderIndex = customer.orders?.findIndex(
         (customerOrder) => customerOrder.id === data.id
      );

      if (foundOrderIndex === -1 || foundOrderIndex === undefined) {
         throw new Error(
            "Order's Index not found, but exists in db. Please check customer."
         );
      }

      let filteredArray = [];
      const filteredOrders = customer.orders.filter(
         (order) => order.id != data.id
      );

      filteredArray.push(filteredOrders);

      customer.set({ orders: filteredArray });

      await customer.save();

      msg.ack();
   }
}
