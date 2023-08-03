'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Products', [
      {
        productName: "Vitamin B Complex IPI 90 Tablet",
        description: "Per Botol",
        price: 7600,
        stock: 100,
        image: "assets/698400_5-12-2021_23-14-17-1665841160.jpg",
        CategoryId: 1
      },
      {
        productName: "Vitamin E 50 IU IPI 30 Tablet",
        description: "Per Botol",
        price: 8000,
        stock: 100,
        image: "assets/133507_11-1-2023_13-20-44.jpg",
        CategoryId: 1
      },
      {
        productName: "Blackmores Natural E 250 IU 50 Kapsul",
        description: "Per Botol",
        price: 188000,
        stock: 100,
        image: "assets/719747_14-6-2022_17-40-30-1665801875.jpg",
        CategoryId: 1
      },
      {
        productName: "Neurobion Forte 10 Table",
        description: "Per Strip",
        price: 188000,
        stock: 100,
        image: "assets/421387_25-8-2021_16-34-6-1665780355.jpg",
        CategoryId: 1
      },
      {
        productName: "Avigan (Favipiravir) 200 mg 10 Tablet",
        description: "Per Strip",
        price: 218000,
        stock: 100,
        image: "assets/625173_18-8-2022_11-40-37-1665822820.jpg",
        CategoryId: 4
      },
      {
        productName: "Oseltamivir 75 mg 10 Kapsul",
        description: "Per Strip",
        price: 41700,
        stock: 100,
        image: "assets/772005_29-8-2022_15-27-48-1665794307.jpg",
        CategoryId: 4
      },
      {
        productName: "Imboost Force 10 Kaplet",
        description: "Per Strip",
        price: 65000,
        stock: 100,
        image: "assets/889941_3-3-2023_8-58-12.jpg",
        CategoryId: 4
      },
      {
        productName: "Oxycan Green Kaleng",
        description: "Per Kaleng",
        price: 44500,
        stock: 100,
        image: "assets/9248-1665779473.jpg",
        CategoryId: 4
      },
      {
        productName: "Ventolin Inhaler 100 mcg 200 Doses",
        description: "Per Botol",
        price: 153800,
        stock: 100,
        image: "assets/1896-1665761131.jpg",
        CategoryId: 2
      },
      {
        productName: "Nebulizer Mask Child (Random Brand)",
        description: "Per Piece",
        price: 16900,
        stock: 100,
        image: "assets/656125_1-7-2020_18-44-11-1665802683.jpg",
        CategoryId: 2
      },
      {
        productName: "Nebulizer Mask Adult",
        description: "Per Piece",
        price: 21500,
        stock: 100,
        image: "assets/15498_11-11-2019_10-15-23-1665802682133507_11-1-2023_13-20-44.jpg",
        CategoryId: 2
      },
      {
        productName: "Oxycan Blue Kaleng",
        description: "Per Kaleng",
        price: 105800,
        stock: 100,
        image: "assets/738018_13-1-2023_14-3-18.jpg",
        CategoryId: 2
      },
      {
        productName: "Amlodipine 5 mg 10 Tablet",
        description: "Per Strip",
        price: 2300,
        stock: 100,
        image: "assets/794981_29-8-2022_16-10-10-1665787641.jpg",
        CategoryId: 3
      },
      {
        productName: "Aspilets 10 Tablet Kunyah",
        description: "Per Strip",
        price: 5400,
        stock: 100,
        image: "assets/61916_8-5-2022_21-18-10-1665778435.jpg",
        CategoryId: 3
      },
      {
        productName: "Cardio Aspirin 100 mg 10 Tablet",
        description: "Per Strip",
        price: 22300,
        stock: 100,
        image: "assets/381502_20-6-2023_14-14-21.jpg",
        CategoryId: 3
      },
      {
        productName: "Trental 400 mg 10 Tablet",
        description: "Per Strip",
        price: 146800,
        stock: 100,
        image: "assets/833796_20-6-2023_14-46-33.jpg",
        CategoryId: 3
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
    return queryInterface.bulkDelete('Products', null, {})
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
