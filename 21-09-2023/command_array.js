db.friends
  .aggregate([
    { $unwind: "$hobbies" },
    { $group: { _id: { age: "$age" }, allHobbies: { $addToSet: "$hobbies" } } },
  ])
  .pretty();
db.friends
  .aggregate([
    { $project: { _id: 0, examScore: { $slice: ["$examScores", 1] } } },
  ])
  .pretty();

db.friends
  .aggregate([{ $project: { _id: 0, examScore: { $size: "$examScores" } } }])
  .pretty();

db.friends
  .aggregate([
    {
      $project: {
        _id: 0,
        scores: {
          $filter: {
            input: "$examScores",
            as: "sc",
            cond: { $gt: ["$$sc.score", 60] },
          },
        },
      },
    },
  ])
  .pretty();

db.friends
  .aggregate([
    { $unwind: "$examScores" },
    { $project: { _id: 1, name: 1, age: 1, score: "$examScores.score" } },

    { $sort: { score: -1 } },
    {
      $group: {
        _id: "$_id",
        name: { $first: "$name" },
        maxScore: { $max: "$score" },
      },
    },
    { $sort: { maxScore: -1 } },
  ])
  .pretty();

// Bucket example : aggregation frame work in mongodb.
db.persons
  .aggregate([
    {
      $bucket: {
        groupBy: "$dob.age",
        boundaries: [0, 18, 30, 50, 80, 120],
        output: { numPersons: { $sum: 1 }, averageAge: { $avg: "$dob.age" } },
      },
    },
  ])
  .pretty();
db.persons
  .aggregate([
    {
      $bucketAuto: {
        groupBy: "$dob.age",
        buckets: 5,
        output: { numPersons: { $sum: 1 }, averageAge: { $avg: "$dob.age" } },
      },
    },
  ])
  .pretty();

db.persons
  .aggregate([
    { $match: { gender: "male" } },
    {
      $project: {
        _id: 0,
        name: { $concat: ["$name.first", " ", "$name.last"] },
        birthdate: { $toDate: "$dob.date" },
      },
    },
    { $sort: { birthdate: 1 } },
    { $skip: 10 },
    { $limit: 10 },
  ])
  .pretty();

db.transformedPersons.aggregate([
  {
    $geoNear: {
      near: {
        type: "Point",
        coordinates: [-18.4, -42.8],
      },
      maxDistanace: 1000000,

      query: { age: { $gt: 30 } },
      distanceField: "distance",
    },
  },

  { $limit: 10 },
]);
