import db from "../../db.server";
import axios from 'axios';
import fsPromises from "fs/promises";
import {bulkQueue} from "~/jobQueue";

export const bulkOperation = async (shop, body, admin) => {
  // await db.session.deleteMany({ where: { shop } });
  // console.log('WEBHOOK BULK')
  // console.log(body)

  try {
    const response = await admin.graphql(`#graphql
        query{
          node(id: "${body.admin_graphql_api_id}") {
            ... on BulkOperation {
              url
              partialDataUrl
              status
            }
          }
        }`,)
    const res = await response.json()

    // console.log('bulkOperation', res.data.node.url)

    if (res.data.node.url) {
      const data = await axios.get(res.data.node.url);
      const timestamp = Date.now()
      const fileName = `files/bulkContent-${shop}-${timestamp}.jsonl`

      // console.log('>>>>>>>>>>>>', data.data)

      await fsPromises.writeFile(fileName, Buffer.from(data.data)).then(()=> {
        console.log('The file has been saved!');
      })

      try {
        await bulkQueue.add('synchronization', {
          type: 'register',
          filename: fileName,
          shop: shop
        });
      } catch (error) {
        throw error;
      }
    }
  } catch (error) {
    console.log("EEEEE",error)
  }
}