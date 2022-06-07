'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('Promos', [
      {
        date: '2022-04-11',
        end: '2022-04-17',
        discount: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        date: '2022-04-18',
        end: '2022-04-24',
        discount: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Promos');
  },
};
