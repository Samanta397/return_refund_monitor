import shopify, {authenticate} from "~/shopify.server";

export const bulkOperationsCreate = async (session, admin) => {

  try {
    const response = await admin.graphql(`#graphql
      mutation bulkOperationRunQuery {
        bulkOperationRunQuery(
          query: """
          {
            orders(first:10) {
              edges {
                node {
                  id
                  name
                  refunds(first: 10) {
                    id
                  }
                  customer {
                    email
                    firstName
                    lastName
                  }
                }
              }
            }
          }
    """
  ) {
    bulkOperation {
      id
      status
    }
    userErrors {
      field
      message
    }
  }
      }`,)

    // console.log('BULK', response)
  } catch (error) {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>', error)
  }

}