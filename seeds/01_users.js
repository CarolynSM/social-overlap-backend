exports.seed = function(knex, Promise) {
  return knex("users")
    .del()
    .then(function() {
      return knex("users").insert([
        {
          id: 1,
          userName: "csmsidekick",
          fullName: "Carolyn Selheim-Miller",
          userId: "2996647786",
          totalFollowers: 130,
          profileImg:
            "https://scontent-sea1-1.cdninstagram.com/vp/0a942abe7f5fab14a5592044a4d29868/5B62A935/t51.2885-19/s150x150/18299764_1513707282026949_6231511674025672704_a.jpg"
        }
      ]);
    });
};
