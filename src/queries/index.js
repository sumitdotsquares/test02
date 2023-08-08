const QUERIES = {
  query: elasticQuery
};

function elasticQuery(value) {
  return {
    query: {
      bool: {
        must: [
          // {
          //   range: {
          //     vl_price: {
          //       gt: 0
          //     }
          //   }
          // },
          {
            exists: {
              field: "pid"
            }
          },
          {
            match: {
              status: "true"
            }
          },
          {
            multi_match: {
              query: value,
              type: "phrase_prefix",
              fields: [
                "vl_title",
                "des",
                "rn",
                "rn_group",
                "rt",
                "rn_miskey",
                "rt_miskey"
              ]
            }
          }
        ]
      }
    },
    _source: [
      "vl_title",
      "des_info",
      "rn_info",
      "rn_group_info",
      "rt_info",
      "pid",
      // "airport_info.code",
      "url",
      "rn_miskey",
      "rt_miskey"
    ]
  };
}

export default QUERIES;
