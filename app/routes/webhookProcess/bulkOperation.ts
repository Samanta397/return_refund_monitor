import db from "../../db.server";

export const bulkOperation = async (shop, body, admin) => {
  // await db.session.deleteMany({ where: { shop } });
  console.log('WEBHOOK BULK')
  console.log(body)

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

    console.log('bulkOperation', response)
  } catch (error) {
    console.log("EEEEE",error)
  }
}