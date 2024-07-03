import fs from "fs";
import readline from 'readline'
import fsPromises from "fs/promises";
import db from "../../db.server";

export const processBulkOperations = async (fileName, shop) => {

  try {
    const store = await db.shopifyStore.findFirst(
      {
        where: {url: shop}
      }
    )

    const orders = await openFile(fileName);

    for(const order of orders) {
      const customerData = {
        email: order.customer.email,
        firstName: order.customer.firstName,
        lastName: order.customer.lastName
      }

      const createdCustomer = await db.customer.upsert({
        where: {
          email: order.customer.email
        },
        create: customerData,
        update: customerData
      })

      const orderData = {
        order_id: order.id,
        order_name: order.name,
        cost: Number(order.totalPriceSet.shopMoney.amount),
        store: {
          connect: store
        },
        customer: {
          connect: createdCustomer
        }
      }

      const createdOrder = await db.shopifyOrder.upsert({
        where: {
          order_id: order.id
        },
        create: orderData,
        update: orderData
      })

      for (const refund of order.refunds) {
        const refundData = {
          refund_id: refund.id,
          cost: Number(refund.totalRefundedSet.shopMoney.amount),
          order: {
            connect: createdOrder
          }
        }

        const createdRefund = await db.refund.upsert({
          where: {
            refund_id: refund.id
          },
          update: refundData,
          create: refundData
        })
      }
    }

    // await fsPromises.rm(fileName)
  } catch(error) {
    await fsPromises.rm(fileName)
    throw error
  }
}

export const openFile = async (fileName) => {
  return new Promise((resolve, reject) => {
    const fileStream = fs.createReadStream(fileName);

    if (fileStream) {
      // create a readline interface for reading the file line by line
      const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
      });

      // create an array to hold the parsed JSON objects
      const jsonArray = [];

      // read each line of the file and parse it as JSON
      rl.on('line', (line) => {
        jsonArray.push(JSON.parse(line))
      });

      rl.on('close', () => {
        resolve(jsonArray)
      })

      rl.on('error', reject)
    }
  })
}

const parseLine = (line: string, fields: string[]) => {
  const json = JSON.parse(line);

  const res = pick(json, fields)
  return res
}

const pick = (obj, fields) => {
  return Object.keys(obj)
    .filter(item => fields.includes(item))
    .reduce((obj2, key) => (obj2[key] = obj[key], obj2), {});
}