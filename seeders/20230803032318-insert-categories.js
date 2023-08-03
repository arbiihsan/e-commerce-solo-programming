'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Categories', [
      {
        categoryTag: "Vitamin-Suplemen",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        categoryTag: "Asma",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        categoryTag: "Kesehatan-Jantung",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        categoryTag: "Kebutuhan-Covid-19",
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
    ], {})
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
  },

  down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Categories', null, {})
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
