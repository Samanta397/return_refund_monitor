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
                   totalPriceSet {
                    shopMoney {
                      amount
                    }
                   }
                  refunds {
                    id
                    totalRefundedSet {
                      shopMoney {
                        amount
                      }
                    }
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

  } catch (error) {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>', error)
  }

}